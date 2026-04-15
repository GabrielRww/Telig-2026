import { useMemo, useState } from "react";
import { AlertTriangle, History, Package, Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatCurrency, useProdutos, countProdutosAbaixoMinimo } from "@/data/produtos";
import { registrarAjusteManual, useMovimentacoes, type TipoMovimentacao } from "@/data/pedidos";

const tipoOptions: Array<{ value: TipoMovimentacao | "all"; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "entrada", label: "Entrada" },
  { value: "saida", label: "Saída" },
  { value: "ajuste", label: "Ajuste" },
  { value: "devolucao", label: "Devolução" },
];

export default function Estoque() {
  const produtos = useProdutos();
  const movimentacoes = useMovimentacoes();
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState("all");
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [formData, setFormData] = useState({ produtoId: "", tipo: "entrada" as "entrada" | "saida" | "ajuste", quantidade: 1, observacao: "" });

  const filteredMovs = useMemo(() => {
    const term = search.trim().toLowerCase();
    return movimentacoes.filter((mov) => {
      const matchType = filterTipo === "all" || mov.tipo === filterTipo;
      const matchSearch = !term || mov.produtoNome.toLowerCase().includes(term) || mov.observacao.toLowerCase().includes(term) || mov.referenciaId.toLowerCase().includes(term);
      return matchType && matchSearch;
    });
  }, [filterTipo, movimentacoes, search]);

  const belowMinimum = countProdutosAbaixoMinimo();
  const totalValue = produtos.reduce((accumulator, produto) => accumulator + produto.estoqueAtual * produto.precoCusto, 0);

  const handleAdjust = () => {
    const produto = produtos.find((item) => item.id === Number(formData.produtoId));
    if (!produto) {
      toast.error("Selecione um produto.");
      return;
    }
    if (formData.observacao.trim().length < 20) {
      toast.error("A justificativa precisa ter pelo menos 20 caracteres.");
      return;
    }
    const ok = registrarAjusteManual(
      produto.id,
      produto.nome,
      formData.quantidade,
      formData.tipo,
      formData.observacao.trim()
    );
    if (!ok) {
      toast.error("Não foi possível ajustar o estoque.");
      return;
    }
    toast.success("Ajuste manual registrado.");
    setAdjustOpen(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estoque</h1>
          <p className="text-sm text-muted-foreground">Produtos críticos: {belowMinimum}</p>
        </div>
        <Button className="gap-2" onClick={() => setAdjustOpen(true)}>
          <SlidersHorizontal size={14} /> Ajuste manual
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
          <Package className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Valor total em estoque</p>
            <p className="text-lg font-semibold">{formatCurrency(totalValue)}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <div>
            <p className="text-xs text-muted-foreground">Produtos críticos</p>
            <p className="text-lg font-semibold text-amber-600">{belowMinimum}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
          <History className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-xs text-muted-foreground">Movimentações</p>
            <p className="text-lg font-semibold">{movimentacoes.length}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar produto, referência ou observação..." value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" />
        </div>
        <Select value={filterTipo} onValueChange={setFilterTipo}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            {tipoOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Produto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Qtd.</TableHead>
              <TableHead className="text-right">Antes</TableHead>
              <TableHead className="text-right">Depois</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Observação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Nenhuma movimentação encontrada.</TableCell>
              </TableRow>
            )}
            {filteredMovs.map((mov, index) => (
              <TableRow key={mov.id} className={cn(index % 2 === 0 && "bg-muted/20") }>
                <TableCell className="font-medium">{mov.produtoNome}</TableCell>
                <TableCell>
                  <Badge variant="outline">{mov.tipo}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono">{mov.quantidade}</TableCell>
                <TableCell className="text-right font-mono">{mov.estoqueAnterior}</TableCell>
                <TableCell className="text-right font-mono">{mov.estoquePosterior}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{mov.origem}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{mov.observacao || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={adjustOpen} onOpenChange={setAdjustOpen}>
        <SheetContent side="right" className="w-full max-w-md flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>Ajuste manual de estoque</SheetTitle>
          </SheetHeader>
          <div className="flex-1 px-6 py-4 space-y-4">
            <div className="space-y-1.5">
              <Label>Produto</Label>
              <Select value={formData.produtoId} onValueChange={(value) => setFormData((prev) => ({ ...prev, produtoId: value }))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {produtos.map((produto) => <SelectItem key={produto.id} value={String(produto.id)}>{produto.codigo} - {produto.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo: value as typeof formData.tipo }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                  <SelectItem value="ajuste">Ajuste</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Quantidade</Label>
              <Input type="number" min={1} value={formData.quantidade} onChange={(event) => setFormData((prev) => ({ ...prev, quantidade: Number(event.target.value) || 1 }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Justificativa</Label>
              <Input value={formData.observacao} onChange={(event) => setFormData((prev) => ({ ...prev, observacao: event.target.value }))} placeholder="Explique o motivo do ajuste" />
            </div>
          </div>
          <div className="border-t px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>Cancelar</Button>
            <Button onClick={handleAdjust}>Salvar ajuste</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
