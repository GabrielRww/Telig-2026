// src/integrations/sap/client.ts
// Cliente para SAP Business One Service Layer via proxy Supabase

import { SUPABASE_URL } from "@/integrations/supabase/client";

// O proxy fica em: https://<supabase-project>.supabase.co/functions/v1/sap-proxy
const SAP_PROXY_URL = `${SUPABASE_URL}/functions/v1/sap-proxy`;

export async function sapGet<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${SAP_PROXY_URL}/${endpoint}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const response = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`SAP GET ${endpoint} falhou: ${err}`);
  }
  return response.json();
}

export async function sapPost<T>(endpoint: string, body: object): Promise<T> {
  const response = await fetch(`${SAP_PROXY_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`SAP POST ${endpoint} falhou: ${err}`);
  }
  return response.json();
}

export async function sapPatch(endpoint: string, id: number | string, body: object): Promise<void> {
  const response = await fetch(`${SAP_PROXY_URL}/${endpoint}(${id})`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`SAP PATCH ${endpoint}(${id}) falhou: ${err}`);
  }
}

export function sapLogout() {

}

export function isSAPConfigured(): boolean {

  return true;
}
