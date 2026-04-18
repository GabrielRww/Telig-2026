import { useState } from "react";
import { Search, TrendingDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useServiceOrders } from "@/data/service-orders";
import {
  useContasPagar, gerarContasPagarDaOS, atualizarContaPagar,
  formatCurrencyBRL, formatDate, type ContaPagar, type ContaPagarStatus,
} from "@/data/financeiro";

const statusConfig: Record<ContaPagarStatus, string> = {
  Pendente: "bg-yellow-100 text-yellow-800",
  Aprovado: "bg-blue-100 text-blue-800",
  Pago: "bg-green-100 text-green-800",
};

export default function ContasPagar() {
  const orders = useServiceOrders();
  const contas = useContasPagar();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTecnico, setFiltroTecnico] = useState("todos");
  const [filtroPeriodoInicio, setFiltroPeriodoInicio] = useState("");
  const [filtroPeriodoFim, setFiltroPeriodoFim] = useState("");
  const [dialogCP, setDialogCP] = useState<ContaPagar | null>(null);
  const [dataPagamento, setDataPagamento] = useState(new Date().toISOString().split("T")[0]);

  const tecnicos = [...new Set(contas.map((c) => c.tecnico).filter(Boolean))];

  const contasFiltradas = contas.filter((cp) => {
    const matchBusca = !busca || cp.tecnico.toLowerCase().includes(busca.toLowerCase()) || cp.osPedido.toLowerCase().includes(busca.toLowerCase()) || cp.descricao.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "todos" || cp.status === filtroStatus;
    const matchTecnico = filtroTecnico === "todos" || cp.tecnico === filtroTecnico;
    const matchInicio = !filtroPeriodoInicio || cp.criadoEm >= filtroPeriodoInicio;
    const matchFim = !filtroPeriodoFim || cp.criadoEm <= filtroPeriodoFim;
    return matchBusca && matchStatus && matchTecnico && matchInicio && matchFim;
  });

  const totalPendente = contas.filter((c) => c.status !== "Pago").reduce((s, c) => s + c.valor, 0);
  const totalPago = contas.filter((c) => c.status === "Pago").reduce((s, c) => s + c.valor, 0);
  const totalAprovado = contas.filter((c) => c.status === "Aprovado").reduce((s, c) => s + c.valor, 0);

  const handleGerarContasPendentes = () => {
    const osElegiveis = orders.filter((o) => ["Finalizada", "Validada", "Faturada"].includes(o.status));
    osElegiveis.forEach((o) => gerarContasPagarDaOS(o));
    toast.success(`Contas a pagar geradas das OS elegíveis`);
  };

  const handleAtualizarStatus = (cp: ContaPagar, status: ContaPagarStatus) => {
    const update: Partial<ContaPagar> = { status };
    if (status === "Pago") update.dataPagamento = dataPagamento;
    atualizarContaPagar(cp.id, update);
    toast.success(`Status atualizado para ${status}`);
    setDialogCP(null);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contas a Pagar</h1>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleGerarContasPendentes}>
          <RefreshCw size={14} /> Gerar das OS
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">Pendente</p>
          <p className="text-2xl font-bold text-yellow-600">{formatCurrencyBRL(totalPendente)}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">Aprovado para Pagar</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrencyBRL(totalAprovado)}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">Total Pago</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrencyBRL(totalPago)}</p>
        </CardContent></Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar técnico, OS ou descrição..." className="pl-8 h-8 text-sm" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <Select value={filtroTecnico} onValueChange={setFiltroTecnico}>
          <SelectTrigger className="w-[160px] h-8 text-sm"><SelectValue placeholder="Técnico" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos técnicos</SelectItem>
            {tecnicos.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-[140px] h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="Pendente">Pendente</SelectItem>
            <SelectItem value="Aprovado">Aprovado</SelectItem>
            <SelectItem value="Pago">Pago</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" className="w-[150px] h-8 text-sm" value={filtroPeriodoInicio} onChange={(e) => setFiltroPeriodoInicio(e.target.value)} />
        <Input type="date" className="w-[150px] h-8 text-sm" value={filtroPeriodoFim} onChange={(e) => setFiltroPeriodoFim(e.target.value)} />
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        {contasFiltradas.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            <TrendingDown size={32} className="mx-auto mb-2 opacity-30" />
            {contas.length === 0
              ? 'Clique em "Gerar das OS" para criar contas a pagar das OS finalizadas.'
              : "Nenhum resultado para os filtros."}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>OS</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contasFiltradas.map((cp) => (
                <TableRow key={cp.id}>
                  <TableCell className="text-xs font-mono">{cp.osPedido}</TableCell>
                  <TableCell className="text-sm">{cp.tecnico || "-"}</TableCell>
                  <TableCell className="text-sm">{cp.descricao}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{cp.tipo === "tecnico" ? "Técnico" : "Despesa"}</Badge>
                  </TableCell>
                  <TableCell className="text-xs">{formatDate(cp.criadoEm)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{formatCurrencyBRL(cp.valor)}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${statusConfig[cp.status]}`}>{cp.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {cp.status !== "Pago" && (
                      <Button variant="ghost" size="sm" className="text-xs" onClick={() => setDialogCP(cp)}>Atualizar</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!dialogCP} onOpenChange={() => setDialogCP(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Atualizar Conta a Pagar</DialogTitle></DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3 space-y-1">
              <p>OS: <strong>{dialogCP?.osPedido}</strong></p>
              <p>Técnico: <strong>{dialogCP?.tecnico}</strong></p>
              <p>Descrição: <strong>{dialogCP?.descricao}</strong></p>
              <p>Valor: <strong>{formatCurrencyBRL(dialogCP?.valor ?? 0)}</strong></p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Data pagamento</Label>
              <Input type="date" value={dataPagamento} onChange={(e) => setDataPagamento(e.target.value)} />
            </div>
          </div>
          <DialogFooter className="gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setDialogCP(null)}>Cancelar</Button>
            {dialogCP?.status === "Pendente" && (
              <Button variant="outline" onClick={() => handleAtualizarStatus(dialogCP, "Aprovado")}>Aprovar</Button>
            )}
            <Button onClick={() => dialogCP && handleAtualizarStatus(dialogCP, "Pago")}>Marcar como Pago</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
