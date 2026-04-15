// supabase/functions/sap-proxy/index.ts
// Proxy para SAP Business One Service Layer
// Resolve CORS e mantém credenciais server-side

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SAP_BASE_URL = Deno.env.get("SAP_SERVICE_LAYER_URL") ?? "";
const SAP_USER = Deno.env.get("SAP_USER") ?? "";
const SAP_PASSWORD = Deno.env.get("SAP_PASSWORD") ?? "";
const SAP_COMPANY_DB = "SBO_SAEGGO_PRD";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-sap-session",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
};

interface SessionCache {
  sessionId: string;
  cookies: string;
  expiresAt: number;
}

let sessionCache: SessionCache | null = null;

async function getSAPSession(): Promise<SessionCache> {
  if (sessionCache && Date.now() < sessionCache.expiresAt) {
    return sessionCache;
  }

  const response = await fetch(`${SAP_BASE_URL}/Login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      CompanyDB: SAP_COMPANY_DB,
      UserName: SAP_USER,
      Password: SAP_PASSWORD,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`SAP Login falhou (${response.status}): ${body}`);
  }

  const data = await response.json();
  const cookies = response.headers.get("set-cookie") ?? "";

  sessionCache = {
    sessionId: data.SessionId,
    cookies,
    expiresAt: Date.now() + 29 * 60 * 1000,
  };

  return sessionCache;
}

serve(async (req) => {
  // Preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    // /sap-proxy/Login → trata separadamente (não precisa de sessão prévia)
    const sapPath = url.pathname.replace(/^\/functions\/v1\/sap-proxy/, "");

    if (!SAP_BASE_URL) {
      return new Response(
        JSON.stringify({ error: "SAP_SERVICE_LAYER_URL não configurada no Supabase." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const session = await getSAPSession();

    const sapUrl = `${SAP_BASE_URL}${sapPath}${url.search}`;
    const body = req.method !== "GET" ? await req.text() : undefined;

    const sapResponse = await fetch(sapUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Cookie": session.cookies,
        "B1SESSION": session.sessionId,
      },
      body,
    });

    const responseText = await sapResponse.text();

    return new Response(responseText, {
      status: sapResponse.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Invalida sessão em caso de erro de autenticação
    if (message.includes("Login") || message.includes("401")) {
      sessionCache = null;
    }
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
