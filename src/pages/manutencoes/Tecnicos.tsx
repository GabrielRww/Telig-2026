import { useState } from "react";
import { Search, Plus, Edit, X } from "lucide-react";
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

interface Tecnico {
  id: number;
  nome: string;
  categoria: string;
  telefone: string;
  regiao: string;
  osAtivas: number;
  status: string;
}

const categoriaOptions = [
  "Instalador Sênior",
  "Instalador Pleno",
  "Instalador Júnior",
  "Eletricista Automotivo",
];

const statusOptions = ["Disponível", "Em atendimento", "Indisponível"];

const statusColor: Record<string, string> = {
  "Disponível": "border-slate-200 text-slate-700",
  "Em atendimento": "border-amber-200 text-amber-700",
  "Indisponível": "border-rose-200 text-rose-700",
};

const statusBadgeBase = "rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-none";

const seedTecnicos: Tecnico[] = [
  { id: 1, nome: "Carlos Silva", categoria: "Instalador Sênior", telefone: "(54) 99911-1111", regiao: "Passo Fundo", osAtivas: 3, status: "Disponível" },
  { id: 2, nome: "João Santos", categoria: "Instalador Pleno", telefone: "(54) 99922-2222", regiao: "Passo Fundo", osAtivas: 2, status: "Em atendimento" },
  { id: 3, nome: "Pedro Lima", categoria: "Instalador Júnior", telefone: "(54) 99933-3333", regiao: "Erechim", osAtivas: 0, status: "Indisponível" },
  { id: 4, nome: "Ana Costa", categoria: "Instalador Pleno", telefone: "(54) 99944-4444", regiao: "Caxias do Sul", osAtivas: 1, status: "Disponível" },
];

function createEmpty() {
  return { nome: "", categoria: categoriaOptions[0], telefone: "", regiao: "", status: "Disponível" };
}

export default function Tecnicos() {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>(seedTecnicos);
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(createEmpty());

  const filtered = tecnicos.filter(
    (t) => !search || t.nome.toLowerCase().includes(search.toLowerCase()) || t.regiao.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setFormData(createEmpty());
    setSheetOpen(true);
  };

  const openEdit = (t: Tecnico) => {
    setEditingId(t.id);
    setFormData({ nome: t.nome, categoria: t.categoria, telefone: t.telefone, regiao: t.regiao, status: t.status });
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome.trim()) {
      toast.error("Informe o nome do técnico.");
      return;
    }
    if (editingId !== null) {
      setTecnicos((prev) => prev.map((t) => t.id === editingId ? { ...t, ...formData } : t));
      toast.success("Técnico atualizado com sucesso.");
    } else {
      const nextId = Math.max(0, ...tecnicos.map((t) => t.id)) + 1;
      setTecnicos((prev) => [...prev, { id: nextId, osAtivas: 0, ...formData }]);
      toast.success("Técnico incluído com sucesso.");
    }
    setSheetOpen(false);
  };

  const set = (partial: Partial<typeof formData>) => setFormData((prev) => ({ ...prev, ...partial }));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Técnicos</h1>
        <Button onClick={openCreate} className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
          <Plus size={16} /> Incluir
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar técnico..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Região</TableHead>
              <TableHead className="text-center">OS Ativas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum técnico encontrado.</TableCell>
              </TableRow>
            )}
            {filtered.map((t, i) => (
              <TableRow key={t.id} className={cn(i % 2 === 0 && "bg-muted/20")}>
                <TableCell className="font-medium">{t.nome}</TableCell>
                <TableCell>{t.categoria}</TableCell>
                <TableCell className="font-mono text-sm">{t.telefone}</TableCell>
                <TableCell>{t.regiao}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="font-mono">{t.osAtivas}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(statusBadgeBase, statusColor[t.status])}>{t.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(t)}>
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
            <SheetTitle>{editingId !== null ? "Editar Técnico" : "Novo Técnico"}</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nome *</Label>
                <Input value={formData.nome} onChange={(e) => set({ nome: e.target.value })} placeholder="Nome completo" />
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
                <Label>Telefone</Label>
                <Input value={formData.telefone} onChange={(e) => set({ telefone: e.target.value })} placeholder="(00) 00000-0000" />
              </div>
              <div className="space-y-1.5">
                <Label>Região</Label>
                <Input value={formData.regiao} onChange={(e) => set({ regiao: e.target.value })} placeholder="Ex: Passo Fundo" />
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
