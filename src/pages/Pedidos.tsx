import { useMemo, useState } from "react";
import { FileDown, PackagePlus, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { validarCNPJ } from "@/lib/cpf";
import { useProdutos } from "@/data/produtos";
import { useVendedores } from "@/data/vendedores";
import {
  calcularValorTotalPedido,
  cancelarPedido,
  criarPedidoCompra,
  formatCurrency,
  receberPedido,
  statusPedidoColors,
  statusPedidoLabels,
  type PedidoItem,
  type StatusPedido,
  usePedidosCompra,
} from "@/data/pedidos";

const statusOptions: Array<{ value: StatusPedido | "all"; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "rascunho", label: statusPedidoLabels.rascunho },
  { value: "aguardando", label: statusPedidoLabels.aguardando },
  { value: "parcial", label: statusPedidoLabels.parcial },
  { value: "recebido", label: statusPedidoLabels.recebido },
  { value: "cancelado", label: statusPedidoLabels.cancelado },
];

function createItemLine(): PedidoItem {
  return {
    produtoId: 0,
    produtoNome: "",
    produtoCodigo: "",
    quantidadePedida: 1,
    quantidadeRecebida: 0,
    precoUnitario: 0,
  };
}

export default function Pedidos() {
  const pedidos = usePedidosCompra();
  const produtos = useProdutos();
  const vendedores = useVendedores();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [receiveSheetOpen, setReceiveSheetOpen] = useState(false);
  const [receivingId, setReceivingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fornecedorNome: "",
    fornecedorCnpj: "",
    vendedorId: "",
    status: "aguardando" as StatusPedido,
    dataPedido: new Date().toISOString().slice(0, 10),
    dataPrevisaoEntrega: "",
    desconto: 0,
    frete: 0,
    observacoes: "",
    itens: [createItemLine()],
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return pedidos.filter((pedido) => {
      const matchStatus = filterStatus === "all" || pedido.status === filterStatus;
      const matchSearch =
        !term ||
        pedido.numeroPedido.toLowerCase().includes(term) ||
        pedido.fornecedorNome.toLowerCase().includes(term) ||
        pedido.fornecedorCnpj.toLowerCase().includes(term) ||
        pedido.itens.some((item) => item.produtoNome.toLowerCase().includes(term));
      return matchStatus && matchSearch;
    });
  }, [filterStatus, pedidos, search]);

  const totalGeral = useMemo(
    () => pedidos.reduce((accumulator, pedido) => accumulator + calcularValorTotalPedido(pedido), 0),
    [pedidos]
  );

  const openCreate = () => {
    setFormData({
      fornecedorNome: "",
      fornecedorCnpj: "",
      vendedorId: "",
      status: "aguardando",
      dataPedido: new Date().toISOString().slice(0, 10),
      dataPrevisaoEntrega: "",
      desconto: 0,
      frete: 0,
      observacoes: "",
      itens: [createItemLine()],
    });
    setSheetOpen(true);
  };

  const addItem = () => {
    setFormData((prev) => ({ ...prev, itens: [...prev.itens, createItemLine()] }));
  };

  const updateItem = (index: number, partial: Partial<PedidoItem>) => {
    setFormData((prev) => ({
      ...prev,
      itens: prev.itens.map((item, itemIndex) => (itemIndex === index ? { ...item, ...partial } : item)),
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itens: prev.itens.length > 1 ? prev.itens.filter((_, itemIndex) => itemIndex !== index) : prev.itens,
    }));
  };

  const handleProductChange = (index: number, produtoIdValue: string) => {
    const produtoId = Number(produtoIdValue);
    const produto = produtos.find((item) => item.id === produtoId);
    updateItem(index, {
      produtoId,
      produtoNome: produto?.nome ?? "",
      produtoCodigo: produto?.codigo ?? "",
      precoUnitario: produto?.precoCusto ?? 0,
    });
  };

  const handleSave = () => {
    if (!formData.fornecedorNome.trim()) {
      toast.error("Informe o fornecedor.");
      return;
    }
    if (formData.fornecedorCnpj && !validarCNPJ(formData.fornecedorCnpj)) {
      toast.error("CNPJ inválido.");
      return;
    }
    if (formData.itens.some((item) => !item.produtoId || item.quantidadePedida <= 0)) {
      toast.error("Adicione pelo menos um item válido.");
      return;
    }

    criarPedidoCompra({
      fornecedorNome: formData.fornecedorNome,
      fornecedorCnpj: formData.fornecedorCnpj,
      vendedorId: formData.vendedorId ? Number(formData.vendedorId) : null,
      status: formData.status,
      dataPedido: formData.dataPedido,
      dataPrevisaoEntrega: formData.dataPrevisaoEntrega,
      dataRecebimento: "",
      desconto: formData.desconto,
      frete: formData.frete,
      observacoes: formData.observacoes,
      itens: formData.itens.map((item) => ({ ...item, quantidadeRecebida: 0 })),
    });

    toast.success("Pedido criado com sucesso.");
    setSheetOpen(false);
  };

  const handleCancel = (pedidoId: number) => {
    cancelarPedido(pedidoId);
    toast.success("Pedido cancelado.");
  };

  const handleReceive = () => {
    if (receivingId === null) return;
    const pedido = pedidos.find((item) => item.id === receivingId);
    if (!pedido) return;
    const quantidades: Record<number, number> = {};
    pedido.itens.forEach((item) => {
      quantidades[item.produtoId] = item.quantidadePedida - item.quantidadeRecebida;
    });
    receberPedido(receivingId, quantidades);
    toast.success("Recebimento registrado e estoque atualizado.");
    setReceiveSheetOpen(false);
  };

  const pedidosParaReceber = receivingId ? pedidos.find((pedido) => pedido.id === receivingId) : null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pedidos</h1>
          <p className="text-sm text-muted-foreground">Total do cadastro: {formatCurrency(totalGeral)}</p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
          <Plus size={16} /> Novo Pedido
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar pedido, fornecedor ou produto..." value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2" onClick={() => toast.info("Exporte a partir da lista filtrada quando integrar o backend.") }>
          <FileDown size={14} /> Exportar PDF
        </Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Número</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  Nenhum pedido encontrado.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((pedido, index) => (
              <TableRow key={pedido.id} className={cn(index % 2 === 0 && "bg-muted/20") }>
                <TableCell className="font-mono font-medium">{pedido.numeroPedido}</TableCell>
                <TableCell>{pedido.fornecedorNome}</TableCell>
                <TableCell>{vendedores.find((vendedor) => vendedor.id === pedido.vendedorId)?.nome ?? "—"}</TableCell>
                <TableCell>{pedido.dataPedido}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(calcularValorTotalPedido(pedido))}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-xs", statusPedidoColors[pedido.status])}>
                    {statusPedidoLabels[pedido.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => {
                      setReceivingId(pedido.id);
                      setReceiveSheetOpen(true);
                    }} title="Receber pedido">
                      <PackagePlus size={14} className="text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel(pedido.id)} title="Cancelar pedido">
                      <Trash2 size={14} className="text-rose-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full max-w-3xl flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>Novo Pedido de Compra</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Fornecedor *</Label>
                  <Input value={formData.fornecedorNome} onChange={(event) => setFormData((prev) => ({ ...prev, fornecedorNome: event.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>CNPJ</Label>
                  <Input value={formData.fornecedorCnpj} onChange={(event) => setFormData((prev) => ({ ...prev, fornecedorCnpj: event.target.value }))} placeholder="00.000.000/0000-00" />
                </div>
                <div className="space-y-1.5">
                  <Label>Vendedor</Label>
                  <Select value={formData.vendedorId} onValueChange={(value) => setFormData((prev) => ({ ...prev, vendedorId: value }))}>
                    <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sem vendedor</SelectItem>
                      {vendedores.filter((vendedor) => vendedor.ativo).map((vendedor) => (
                        <SelectItem key={vendedor.id} value={String(vendedor.id)}>{vendedor.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as StatusPedido }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.filter((option) => option.value !== "all").map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Data do pedido *</Label>
                  <Input type="date" value={formData.dataPedido} onChange={(event) => setFormData((prev) => ({ ...prev, dataPedido: event.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Previsão de entrega</Label>
                  <Input type="date" value={formData.dataPrevisaoEntrega} onChange={(event) => setFormData((prev) => ({ ...prev, dataPrevisaoEntrega: event.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Frete</Label>
                  <Input type="number" min={0} step={0.01} value={formData.frete} onChange={(event) => setFormData((prev) => ({ ...prev, frete: Number(event.target.value) || 0 }))} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Itens do pedido</Label>
                  <Button type="button" variant="outline" size="sm" className="gap-2" onClick={addItem}>
                    <Plus size={14} /> Adicionar item
                  </Button>
                </div>
                {formData.itens.map((item, index) => (
                  <div key={`${index}-${item.produtoId}`} className="grid grid-cols-1 md:grid-cols-[1.3fr_0.6fr_0.7fr_auto] gap-3 items-end rounded-lg border p-3">
                    <div className="space-y-1.5">
                      <Label>Produto</Label>
                      <Select value={item.produtoId ? String(item.produtoId) : ""} onValueChange={(value) => handleProductChange(index, value)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {produtos.filter((produto) => produto.ativo).map((produto) => (
                            <SelectItem key={produto.id} value={String(produto.id)}>
                              {produto.codigo} - {produto.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Qtd.</Label>
                      <Input type="number" min={1} value={item.quantidadePedida} onChange={(event) => updateItem(index, { quantidadePedida: Number(event.target.value) || 0 })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Preço unit.</Label>
                      <Input type="number" min={0} step={0.01} value={item.precoUnitario} onChange={(event) => updateItem(index, { precoUnitario: Number(event.target.value) || 0 })} />
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                      <Trash2 size={14} className="text-rose-500" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <Label>Observações</Label>
                <Input value={formData.observacoes} onChange={(event) => setFormData((prev) => ({ ...prev, observacoes: event.target.value }))} />
              </div>
            </div>
          </ScrollArea>
          <div className="border-t px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">Salvar pedido</Button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={receiveSheetOpen} onOpenChange={setReceiveSheetOpen}>
        <SheetContent side="right" className="w-full max-w-lg flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>Receber pedido</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {pedidosParaReceber ? `O pedido ${pedidosParaReceber.numeroPedido} será recebido integralmente.` : "Selecione um pedido."}
              </p>
              {pedidosParaReceber?.itens.map((item) => (
                <div key={item.produtoId} className="rounded-lg border p-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.produtoNome}</p>
                    <p className="text-sm text-muted-foreground">Pedido: {item.quantidadePedida} · Recebido: {item.quantidadeRecebida}</p>
                  </div>
                  <Badge variant="outline">{formatCurrency(item.precoUnitario)}</Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setReceiveSheetOpen(false)}>Cancelar</Button>
            <Button onClick={handleReceive} className="bg-primary hover:bg-primary/90">Confirmar recebimento</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
