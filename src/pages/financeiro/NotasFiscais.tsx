import { useState } from "react";
import { FileText, Plus, CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useServiceOrders } from "@/data/service-orders";
import {
  useNotasFiscais, criarNFdaOS, atualizarNF, getNFporOS,
  formatCurrencyBRL, formatDate, type NotaFiscal, type NFStatus,
} from "@/data/financeiro";

const statusConfig: Record<NFStatus, { label: string; color: string; icon: React.ElementType }> = {
  Pendente: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  Emitida: { label: "Emitida", color: "bg-green-100 text-green-800", icon: CheckCircle },
  Cancelada: { label: "Cancelada", color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function NotasFiscais() {
  const orders = useServiceOrders();
  const nfs = useNotasFiscais();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [dialogNF, setDialogNF] = useState<NotaFiscal | null>(null);
  const [editando, setEditando] = useState<Partial<NotaFiscal>>({});

  const osFaturadas = orders.filter((o) => o.status === "Faturada");
  const osSemNF = osFaturadas.filter((o) => !getNFporOS(o.id));

  const nfsFiltradas = nfs.filter((nf) => {
    const matchBusca = !busca || nf.cliente.toLowerCase().includes(busca.toLowerCase()) || nf.osPedido.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "todos" || nf.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const totalEmitido = nfs.filter((n) => n.status === "Emitida").reduce((s, n) => s + n.valor, 0);
  const totalPendente = nfs.filter((n) => n.status === "Pendente").reduce((s, n) => s + n.valor, 0);

  const handleCriarNF = (osId: number) => {
    const order = orders.find((o) => o.id === osId);
    if (!order) return;
    const nf = criarNFdaOS(order);
    toast.success(`NF ${nf.id} criada para OS ${order.pedido}`);
  };

  const handleAbrirEdicao = (nf: NotaFiscal) => {
    setDialogNF(nf);
    setEditando({ status: nf.status, dataVencimento: nf.dataVencimento, observacao: nf.observacao });
  };

  const handleSalvarEdicao = () => {
    if (!dialogNF) return;
    atualizarNF(dialogNF.id, editando);
    toast.success("NF atualizada");
    setDialogNF(null);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notas Fiscais de OS</h1>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">OS Faturadas sem NF</p>
            <p className="text-2xl font-bold text-yellow-600">{osSemNF.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Total Emitido</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrencyBRL(totalEmitido)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Total Pendente</p>
            <p className="text-2xl font-bold text-yellow-600">{formatCurrencyBRL(totalPendente)}</p>
          </CardContent>
        </Card>
      </div>

      {/* OS Faturadas sem NF */}
      {osSemNF.length > 0 && (
        <Card className="border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-yellow-700 flex items-center gap-2">
              <Clock size={16} /> OS Faturadas aguardando emissão de NF ({osSemNF.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {osSemNF.map((os) => (
                <div key={os.id} className="flex items-center justify-between border rounded p-3 bg-yellow-50/50">
                  <div>
                    <p className="text-sm font-medium">{os.pedido} — {os.cliente}</p>
                    <p className="text-xs text-muted-foreground">{os.tipo} | Valor: {os.valorCliente} | Realização: {os.realizacao}</p>
                  </div>
                  <Button size="sm" onClick={() => handleCriarNF(os.id)} className="gap-1 shrink-0">
                    <Plus size={14} /> Criar NF
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Listagem de NFs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar por cliente ou OS..." className="pl-8 h-8 text-sm" value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-[150px] h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Emitida">Emitida</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {nfsFiltradas.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <FileText size={32} className="mx-auto mb-2 opacity-30" />
              Nenhuma nota fiscal encontrada
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
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nfsFiltradas.map((nf) => {
                  const cfg = statusConfig[nf.status];
                  return (
                    <TableRow key={nf.id}>
                      <TableCell className="font-mono text-xs">{nf.id}</TableCell>
                      <TableCell className="text-xs">{nf.osPedido}</TableCell>
                      <TableCell className="text-sm">{nf.cliente}</TableCell>
                      <TableCell className="text-xs">{formatDate(nf.dataEmissao)}</TableCell>
                      <TableCell className="text-xs">{formatDate(nf.dataVencimento)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrencyBRL(nf.valor)}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${cfg.color}`}>{cfg.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleAbrirEdicao(nf)}>Editar</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog edição NF */}
      <Dialog open={!!dialogNF} onOpenChange={() => setDialogNF(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar NF — {dialogNF?.id}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Status</Label>
              <Select value={editando.status} onValueChange={(v) => setEditando((p) => ({ ...p, status: v as NFStatus }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Emitida">Emitida</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Data Vencimento</Label>
              <Input type="date" value={editando.dataVencimento ?? ""} onChange={(e) => setEditando((p) => ({ ...p, dataVencimento: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Observação</Label>
              <Textarea value={editando.observacao ?? ""} onChange={(e) => setEditando((p) => ({ ...p, observacao: e.target.value }))} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogNF(null)}>Cancelar</Button>
            <Button onClick={handleSalvarEdicao}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
