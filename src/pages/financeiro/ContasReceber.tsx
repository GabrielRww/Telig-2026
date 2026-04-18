import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input as InputUI } from "@/components/ui/input";
import { toast } from "sonner";
import {
  useNotasFiscais, atualizarNF, formatCurrencyBRL, formatDate, isVencida,
  type NotaFiscal, type ContaReceberStatus,
} from "@/data/financeiro";

const statusConfig: Record<ContaReceberStatus, string> = {
  "Em aberto": "bg-blue-100 text-blue-800",
  "Pago parcial": "bg-yellow-100 text-yellow-800",
  "Pago total": "bg-green-100 text-green-800",
  "Vencido": "bg-red-100 text-red-800",
};

export default function ContasReceber() {
  const nfs = useNotasFiscais();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroPeriodoInicio, setFiltroPeriodoInicio] = useState("");
  const [filtroPeriodoFim, setFiltroPeriodoFim] = useState("");
  const [dialogNF, setDialogNF] = useState<NotaFiscal | null>(null);
  const [valorPago, setValorPago] = useState("");
  const [dataPagamento, setDataPagamento] = useState(new Date().toISOString().split("T")[0]);

  // Só NFs emitidas aparecem em contas a receber
  const nfsEmitidas = nfs
    .filter((nf) => nf.status === "Emitida")
    .map((nf) => ({
      ...nf,
      statusPagamento: isVencida(nf.dataVencimento, nf.statusPagamento) && nf.statusPagamento !== "Pago total"
        ? "Vencido" as ContaReceberStatus
        : nf.statusPagamento,
    }));

  const nfsFiltradas = nfsEmitidas.filter((nf) => {
    const matchBusca = !busca || nf.cliente.toLowerCase().includes(busca.toLowerCase()) || nf.osPedido.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "todos" || nf.statusPagamento === filtroStatus;
    const matchInicio = !filtroPeriodoInicio || nf.dataEmissao >= filtroPeriodoInicio;
    const matchFim = !filtroPeriodoFim || nf.dataEmissao <= filtroPeriodoFim;
    return matchBusca && matchStatus && matchInicio && matchFim;
  });

  const totalAberto = nfsEmitidas.filter((n) => n.statusPagamento !== "Pago total").reduce((s, n) => s + (n.valor - n.valorPago), 0);
  const totalRecebido = nfsEmitidas.reduce((s, n) => s + n.valorPago, 0);
  const totalVencido = nfsEmitidas.filter((n) => n.statusPagamento === "Vencido").reduce((s, n) => s + (n.valor - n.valorPago), 0);

  const handleRegistrarPagamento = () => {
    if (!dialogNF) return;
    const vPago = parseFloat(valorPago.replace(",", ".")) || 0;
    const totalPago = dialogNF.valorPago + vPago;
    const novoStatus: ContaReceberStatus = totalPago >= dialogNF.valor ? "Pago total" : totalPago > 0 ? "Pago parcial" : "Em aberto";
    atualizarNF(dialogNF.id, { valorPago: totalPago, statusPagamento: novoStatus, dataPagamento });
    toast.success("Pagamento registrado");
    setDialogNF(null);
    setValorPago("");
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Contas a Receber</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">Em Aberto</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrencyBRL(totalAberto)}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">Recebido</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrencyBRL(totalRecebido)}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">Vencido</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrencyBRL(totalVencido)}</p>
        </CardContent></Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar cliente ou OS..." className="pl-8 h-8 text-sm" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-[160px] h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos status</SelectItem>
            <SelectItem value="Em aberto">Em aberto</SelectItem>
            <SelectItem value="Pago parcial">Pago parcial</SelectItem>
            <SelectItem value="Pago total">Pago total</SelectItem>
            <SelectItem value="Vencido">Vencido</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" className="w-[150px] h-8 text-sm" value={filtroPeriodoInicio} onChange={(e) => setFiltroPeriodoInicio(e.target.value)} placeholder="De" />
        <Input type="date" className="w-[150px] h-8 text-sm" value={filtroPeriodoFim} onChange={(e) => setFiltroPeriodoFim(e.target.value)} placeholder="Até" />
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        {nfsFiltradas.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            <TrendingUp size={32} className="mx-auto mb-2 opacity-30" />
            {nfsEmitidas.length === 0 ? "Nenhuma NF emitida ainda. Emita NFs na tela de Notas Fiscais." : "Nenhum resultado para os filtros aplicados."}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>NF</TableHead>
                <TableHead>OS</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Emissão</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Recebido</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nfsFiltradas.map((nf) => (
                <TableRow key={nf.id}>
                  <TableCell className="font-mono text-xs">{nf.id}</TableCell>
                  <TableCell className="text-xs">{nf.osPedido}</TableCell>
                  <TableCell className="text-sm">{nf.cliente}</TableCell>
                  <TableCell className="text-xs">{formatDate(nf.dataEmissao)}</TableCell>
                  <TableCell className="text-xs">{formatDate(nf.dataVencimento)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{formatCurrencyBRL(nf.valor)}</TableCell>
                  <TableCell className="text-right font-mono text-sm text-green-600">{formatCurrencyBRL(nf.valorPago)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{formatCurrencyBRL(nf.valor - nf.valorPago)}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${statusConfig[nf.statusPagamento]}`}>{nf.statusPagamento}</Badge>
                  </TableCell>
                  <TableCell>
                    {nf.statusPagamento !== "Pago total" && (
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => { setDialogNF(nf); setValorPago(""); }}>
                        Receber
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!dialogNF} onOpenChange={() => setDialogNF(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Registrar Recebimento — {dialogNF?.id}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/30 rounded p-3 text-sm space-y-1">
              <p>Cliente: <strong>{dialogNF?.cliente}</strong></p>
              <p>Valor total: <strong>{formatCurrencyBRL(dialogNF?.valor ?? 0)}</strong></p>
              <p>Já recebido: <strong className="text-green-600">{formatCurrencyBRL(dialogNF?.valorPago ?? 0)}</strong></p>
              <p>Saldo: <strong>{formatCurrencyBRL((dialogNF?.valor ?? 0) - (dialogNF?.valorPago ?? 0))}</strong></p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Valor recebido agora (R$)</Label>
              <InputUI placeholder="0,00" value={valorPago} onChange={(e) => setValorPago(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Data do pagamento</Label>
              <InputUI type="date" value={dataPagamento} onChange={(e) => setDataPagamento(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogNF(null)}>Cancelar</Button>
            <Button onClick={handleRegistrarPagamento}>Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
