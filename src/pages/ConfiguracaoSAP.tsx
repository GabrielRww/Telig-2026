import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, RefreshCw, Info } from "lucide-react";
import { fetchSAPServiceCalls, type SAPServiceCall } from "@/integrations/sap/serviceCalls";
import { SUPABASE_URL } from "@/integrations/supabase/client";
import { toast } from "sonner";

const statusLabel: Record<number, string> = {
  1: "Aberto",
  2: "Pendente",
  3: "Encerrado",
};

const statusColor: Record<number, string> = {
  1: "bg-blue-100 text-blue-800",
  2: "bg-yellow-100 text-yellow-800",
  3: "bg-green-100 text-green-800",
};

export default function ConfiguracaoSAP() {
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [testError, setTestError] = useState("");
  const [serviceCalls, setServiceCalls] = useState<SAPServiceCall[]>([]);
  const [loadingCalls, setLoadingCalls] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const proxyUrl = `${SUPABASE_URL}/functions/v1/sap-proxy`;

  const handleTestarConexao = async () => {
    setTestStatus("loading");
    setTestError("");
    try {
      const response = await fetch(`${proxyUrl}/ServiceCalls?$top=1`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const body = await response.text();
        throw new Error(`HTTP ${response.status}: ${body}`);
      }
      setTestStatus("ok");
      toast.success("Proxy SAP respondeu com sucesso!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestStatus("error");
      setTestError(msg);
      toast.error("Falha ao conectar via proxy SAP.");
    }
  };

  const handleBuscarServiceCalls = async () => {
    setLoadingCalls(true);
    try {
      const calls = await fetchSAPServiceCalls(50);
      setServiceCalls(calls);
      setLastSync(new Date());
      toast.success(`${calls.length} ServiceCalls carregados do SAP.`);
    } catch (err) {
      toast.error("Erro ao buscar ServiceCalls do SAP.");
      console.error(err);
    } finally {
      setLoadingCalls(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuração SAP B1</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Integração com SAP Business One via Service Layer — SAEGGO DO BRASIL LTDA
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Proxy Supabase → SAP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
            <Info size={16} className="mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p>
                As chamadas ao SAP passam pelo proxy Supabase Edge Function, evitando problemas de CORS e mantendo as credenciais seguras no servidor.
              </p>
              <p className="font-mono text-xs break-all">{proxyUrl}</p>
              <p className="mt-2 font-medium">
                Para funcionar, configure as variáveis de ambiente no painel do Supabase:
              </p>
              <ul className="list-disc list-inside text-xs space-y-0.5">
                <li><code>SAP_SERVICE_LAYER_URL</code> — URL correta da Service Layer AutoSky</li>
                <li><code>SAP_USER</code> — usuário SAP</li>
                <li><code>SAP_PASSWORD</code> — senha SAP</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleTestarConexao} disabled={testStatus === "loading"}>
              {testStatus === "loading" && <Loader2 size={14} className="animate-spin mr-1" />}
              Testar Conexão
            </Button>
            {testStatus === "ok" && (
              <span className="flex items-center gap-1 text-green-700 text-sm font-medium">
                <CheckCircle size={16} /> Conectado via proxy
              </span>
            )}
            {testStatus === "error" && (
              <span className="flex items-center gap-1 text-red-600 text-sm">
                <XCircle size={16} /> {testError}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">ServiceCalls recentes no SAP</CardTitle>
          <div className="flex items-center gap-3">
            {lastSync && (
              <span className="text-xs text-muted-foreground">
                Última sync: {lastSync.toLocaleTimeString("pt-BR")}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleBuscarServiceCalls} disabled={loadingCalls}>
              {loadingCalls ? <Loader2 size={14} className="animate-spin mr-1" /> : <RefreshCw size={14} className="mr-1" />}
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {serviceCalls.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Clique em "Atualizar" para carregar os ServiceCalls do SAP B1.
            </p>
          ) : (
            <div className="space-y-2">
              {serviceCalls.map((call) => (
                <div key={call.ServiceCallID} className="flex items-start justify-between border rounded p-3 text-sm">
                  <div className="space-y-0.5">
                    <p className="font-medium">#{call.ServiceCallID} — {call.Subject}</p>
                    <p className="text-muted-foreground text-xs">
                      Cliente: {call.CustomerCode}
                      {call.TechnicianCode && ` | Técnico: ${call.TechnicianCode}`}
                      {call.CreationDate && ` | Abertura: ${call.CreationDate}`}
                    </p>
                  </div>
                  <Badge className={`text-xs shrink-0 ml-2 ${statusColor[call.Status] ?? "bg-gray-100 text-gray-700"}`}>
                    {statusLabel[call.Status] ?? "Desconhecido"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações do ambiente SAP</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1 text-muted-foreground">
          <p><strong>Versão:</strong> SAP Business One 10.0</p>
          <p><strong>Hospedagem:</strong> AutoSky Cloud — us-a0db02c42-sca.autosky.app</p>
          <p><strong>Banco de dados:</strong> SBO_SAEGGO_PRD</p>
          <p><strong>Empresa:</strong> SAEGGO DO BRASIL LTDA</p>
          <p className="pt-2 text-xs">
            Prefixo <code className="bg-muted px-1 rounded">C</code> = Clientes |{" "}
            Prefixo <code className="bg-muted px-1 rounded">F</code> = Fornecedores/Técnicos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
