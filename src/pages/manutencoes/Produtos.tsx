import { useState } from "react";
import { Search, Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Produto {
  id: number;
  nome: string;
  codigo: string;
  categoria: string;
  preco: string;
  estoque: number;
  status: string;
}

const categoriaOptions = ["Jammer", "Bloqueador", "Rastreador", "Acessório", "Outro"];
const statusOptions = ["Ativo", "Descontinuado"];

const statusBadgeBase = "rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-none";

const seedProdutos: Produto[] = [
  { id: 1, nome: "TJammer 4G", codigo: "TJM-4G", categoria: "Jammer", preco: "R$ 850,00", estoque: 42, status: "Ativo" },
  { id: 2, nome: "TBlock Pro", codigo: "TBL-PRO", categoria: "Bloqueador", preco: "R$ 320,00", estoque: 38, status: "Ativo" },
  { id: 3, nome: "Rastreador 4G", codigo: "RST-4G", categoria: "Rastreador", preco: "R$ 450,00", estoque: 85, status: "Ativo" },
  { id: 4, nome: "TBlock V1", codigo: "TBL-V1", categoria: "Bloqueador", preco: "R$ 200,00", estoque: 0, status: "Descontinuado" },
  { id: 5, nome: "Bloqueador Standard", codigo: "BLQ-STD", categoria: "Bloqueador", preco: "R$ 180,00", estoque: 30, status: "Ativo" },
  { id: 6, nome: "Antena GPS", codigo: "ANT-GPS", categoria: "Acessório", preco: "R$ 45,00", estoque: 120, status: "Ativo" },
];

function createEmpty() {
  return { nome: "", codigo: "", categoria: "Rastreador", preco: "", estoque: "", status: "Ativo" };
}

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>(seedProdutos);
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(createEmpty());

  const filtered = produtos.filter(
    (p) => !search || p.nome.toLowerCase().includes(search.toLowerCase()) || p.codigo.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setFormData(createEmpty());
    setSheetOpen(true);
  };

  const openEdit = (p: Produto) => {
    setEditingId(p.id);
    setFormData({ nome: p.nome, codigo: p.codigo, categoria: p.categoria, preco: p.preco, estoque: String(p.estoque), status: p.status });
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome.trim()) {
      toast.error("Informe o nome do produto.");
      return;
    }
    if (!formData.codigo.trim()) {
      toast.error("Informe o código do produto.");
      return;
    }
    const estoqueNum = parseInt(formData.estoque, 10);
    if (Number.isNaN(estoqueNum) || estoqueNum < 0) {
      toast.error("Informe um estoque válido (número inteiro ≥ 0).");
      return;
    }
    if (editingId !== null) {
      setProdutos((prev) => prev.map((p) => p.id === editingId ? { ...p, ...formData, estoque: estoqueNum } : p));
      toast.success("Produto atualizado com sucesso.");
    } else {
      const nextId = Math.max(0, ...produtos.map((p) => p.id)) + 1;
      setProdutos((prev) => [...prev, { id: nextId, ...formData, estoque: estoqueNum }]);
      toast.success("Produto incluído com sucesso.");
    }
    setSheetOpen(false);
  };

  const set = (partial: Partial<typeof formData>) => setFormData((prev) => ({ ...prev, ...partial }));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Produtos</h1>
        <Button onClick={openCreate} className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
          <Plus size={16} /> Incluir
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar produto ou código..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead className="text-center">Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum produto encontrado.</TableCell>
              </TableRow>
            )}
            {filtered.map((p, i) => (
              <TableRow key={p.id} className={cn(i % 2 === 0 && "bg-muted/20")}>
                <TableCell className="font-mono text-sm">{p.codigo}</TableCell>
                <TableCell className="font-medium">{p.nome}</TableCell>
                <TableCell>{p.categoria}</TableCell>
                <TableCell className="text-right font-mono">{p.preco}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={cn(statusBadgeBase, "font-mono", p.estoque === 0 ? "border-rose-200 text-rose-700" : "border-border/70 text-foreground/75")}
                  >
                    {p.estoque}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(statusBadgeBase, p.status === "Ativo" ? "border-emerald-200 text-emerald-700" : "border-slate-200 text-slate-700")}
                  >
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(p)}>
                    <Edit size={14} className="text-primary" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full max-w-md flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>{editingId !== null ? "Editar Produto" : "Novo Produto"}</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nome *</Label>
                <Input value={formData.nome} onChange={(e) => set({ nome: e.target.value })} placeholder="Ex: TJammer 4G" />
              </div>
              <div className="space-y-1.5">
                <Label>Código *</Label>
                <Input value={formData.codigo} onChange={(e) => set({ codigo: e.target.value.toUpperCase() })} placeholder="Ex: TJM-4G" />
              </div>
              <div className="space-y-1.5">
                <Label>Categoria</Label>
                <Select value={formData.categoria} onValueChange={(v) => set({ categoria: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categoriaOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Preço</Label>
                <Input value={formData.preco} onChange={(e) => set({ preco: e.target.value })} placeholder="Ex: R$ 850,00" />
              </div>
              <div className="space-y-1.5">
                <Label>Estoque</Label>
                <Input type="number" min="0" value={formData.estoque} onChange={(e) => set({ estoque: e.target.value })} placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => set({ status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ScrollArea>
          <div className="border-t px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">Salvar</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
