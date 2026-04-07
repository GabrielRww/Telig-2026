import { useState } from "react";
import { Search, History, User, Clock, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: number;
  osId: number;
  usuario: string;
  perfil: string;
  acao: string;
  detalhe: string;
  dataHora: string;
  ip: string;
  statusAnterior?: string;
  statusNovo?: string;
}

const mockAuditLogs: AuditLog[] = [
  { id: 1, osId: 188432, usuario: "Maria Souza", perfil: "Atendente", acao: "Abertura", detalhe: "Ordem de serviço criada - tipo INSTALAÇÃO", dataHora: "04/04/2026 08:15:22", ip: "192.168.1.10", statusNovo: "Em agendamento" },
  { id: 2, osId: 188432, usuario: "Maria Souza", perfil: "Atendente", acao: "Vinculação Equipamento", detalhe: "Equipamento TJ-2024-001 (TJammer 4G) vinculado à OS. Transferência automática para cliente Volare Segurança registrada.", dataHora: "04/04/2026 08:18:45", ip: "192.168.1.10" },
  { id: 3, osId: 188432, usuario: "Maria Souza", perfil: "Atendente", acao: "Designação Técnico", detalhe: "Técnico Carlos Silva designado para a OS", dataHora: "04/04/2026 08:20:10", ip: "192.168.1.10" },
  { id: 4, osId: 188432, usuario: "Carlos Silva", perfil: "Técnico", acao: "Alteração Status", detalhe: "Status alterado", dataHora: "04/04/2026 09:30:00", ip: "10.0.0.5", statusAnterior: "Em agendamento", statusNovo: "Agendada" },
  { id: 5, osId: 188432, usuario: "Carlos Silva", perfil: "Técnico", acao: "Visualização", detalhe: "Técnico acessou a ordem de serviço", dataHora: "05/04/2026 07:00:12", ip: "10.0.0.5" },
  { id: 6, osId: 188432, usuario: "Carlos Silva", perfil: "Técnico", acao: "Alteração Status", detalhe: "Status alterado", dataHora: "05/04/2026 07:05:33", ip: "10.0.0.5", statusAnterior: "Agendada", statusNovo: "Em Atendimento" },
  { id: 7, osId: 188432, usuario: "Carlos Silva", perfil: "Técnico", acao: "Alteração Status", detalhe: "Status alterado", dataHora: "05/04/2026 08:45:00", ip: "10.0.0.5", statusAnterior: "Em Atendimento", statusNovo: "Em Execução" },
  { id: 8, osId: 188432, usuario: "Carlos Silva", perfil: "Técnico", acao: "Adição Despesa", detalhe: "Despesa de deslocamento R$ 50,00 adicionada", dataHora: "05/04/2026 09:00:15", ip: "10.0.0.5" },
  { id: 9, osId: 188432, usuario: "Carlos Silva", perfil: "Técnico", acao: "Alteração Status", detalhe: "Status alterado", dataHora: "05/04/2026 10:30:00", ip: "10.0.0.5", statusAnterior: "Em Execução", statusNovo: "Finalizada" },
  { id: 10, osId: 188432, usuario: "Admin Master", perfil: "Administrador", acao: "Validação", detalhe: "Ordem validada pelo administrador", dataHora: "05/04/2026 14:00:00", ip: "192.168.1.1", statusAnterior: "Finalizada", statusNovo: "Validada" },
  // OS 188431
  { id: 11, osId: 188431, usuario: "Ana Costa", perfil: "Atendente", acao: "Abertura", detalhe: "Ordem de serviço criada - tipo RETIRADA", dataHora: "04/04/2026 09:00:00", ip: "192.168.1.12", statusNovo: "Em agendamento" },
  { id: 12, osId: 188431, usuario: "Ana Costa", perfil: "Atendente", acao: "Designação Técnico", detalhe: "Técnico João Santos designado", dataHora: "04/04/2026 09:10:00", ip: "192.168.1.12" },
  { id: 13, osId: 188431, usuario: "Ana Costa", perfil: "Atendente", acao: "Alteração Status", detalhe: "Status alterado", dataHora: "04/04/2026 09:15:00", ip: "192.168.1.12", statusAnterior: "Em agendamento", statusNovo: "Agendada" },
];

const acaoColorMap: Record<string, string> = {
  "Abertura": "bg-green-100 text-green-800",
  "Alteração Status": "bg-blue-100 text-blue-800",
  "Vinculação Equipamento": "bg-purple-100 text-purple-800",
  "Designação Técnico": "bg-indigo-100 text-indigo-800",
  "Visualização": "bg-gray-100 text-gray-800",
  "Adição Despesa": "bg-yellow-100 text-yellow-800",
  "Validação": "bg-emerald-100 text-emerald-800",
};

export default function Auditoria() {
  const [osSearch, setOsSearch] = useState("");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!osSearch.trim()) return;
    const id = parseInt(osSearch);
    const filtered = mockAuditLogs.filter((l) => l.osId === id);
    setLogs(filtered);
    setSearched(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Auditoria</h1>
      <p className="text-sm text-muted-foreground">
        Rastreie todas as ações realizadas em uma ordem de serviço — quem abriu, modificou, transferiu e finalizou.
      </p>

      {/* Search */}
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Digite o número da OS (ex: 188432)"
                value={osSearch}
                onChange={(e) => setOsSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9"
                type="number"
              />
            </div>
            <Button onClick={handleSearch} className="gap-2" disabled={!osSearch.trim()}>
              <Search size={14} />
              Buscar Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {searched && logs.length === 0 && (
        <Card className="border shadow-sm">
          <CardContent className="p-8 text-center text-muted-foreground">
            <History size={40} className="mx-auto mb-3 opacity-40" />
            <p>Nenhum registro de auditoria encontrado para a OS <strong>{osSearch}</strong>.</p>
          </CardContent>
        </Card>
      )}

      {logs.length > 0 && (
        <>
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                Logs da OS #{logs[0].osId} — {logs.length} registro(s)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Timeline */}
              <div className="relative pl-8 pr-4 pb-4">
                {logs.map((log, i) => (
                  <div key={log.id} className="relative pb-6 last:pb-0">
                    {/* Line */}
                    {i < logs.length - 1 && (
                      <div className="absolute left-[-16px] top-6 w-px h-full bg-border" />
                    )}
                    {/* Dot */}
                    <div className="absolute left-[-20px] top-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-primary/20" />

                    <div className="bg-muted/20 rounded-lg border p-4 ml-2">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={cn("text-xs font-medium", acaoColorMap[log.acao] || "bg-gray-100 text-gray-800")}>
                            {log.acao}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={12} />
                            {log.dataHora}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">IP: {log.ip}</span>
                      </div>

                      <p className="text-sm text-foreground mt-2">{log.detalhe}</p>

                      {log.statusAnterior && log.statusNovo && (
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <Badge variant="outline" className="font-normal">{log.statusAnterior}</Badge>
                          <ArrowRight size={12} className="text-muted-foreground" />
                          <Badge variant="outline" className="font-normal border-primary text-primary">{log.statusNovo}</Badge>
                        </div>
                      )}

                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <User size={12} />
                        <span className="font-medium text-foreground">{log.usuario}</span>
                        <span>— {log.perfil}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
