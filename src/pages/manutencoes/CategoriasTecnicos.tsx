import { useState } from "react";
import { Search, Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  valorHora: string;
  tecnicos: number;
}

const seedCategorias: Categoria[] = [
  { id: 1, nome: "Instalador Sênior", descricao: "Profissional com 5+ anos de experiência", valorHora: "R$ 85,00", tecnicos: 2 },
  { id: 2, nome: "Instalador Pleno", descricao: "Profissional com 2-5 anos de experiência", valorHora: "R$ 65,00", tecnicos: 4 },
  { id: 3, nome: "Instalador Júnior", descricao: "Profissional em formação", valorHora: "R$ 45,00", tecnicos: 3 },
  { id: 4, nome: "Eletricista Automotivo", descricao: "Especialista em elétrica veicular", valorHora: "R$ 75,00", tecnicos: 1 },
];

function createEmpty() {
  return { nome: "", descricao: "", valorHora: "" };
}

export default function CategoriasTecnicos() {
  const [categorias, setCategorias] = useState<Categoria[]>(seedCategorias);
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(createEmpty());

  const filtered = categorias.filter((c) => !search || c.nome.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => {
    setEditingId(null);
    setFormData(createEmpty());
    setSheetOpen(true);
  };

  const openEdit = (c: Categoria) => {
    setEditingId(c.id);
    setFormData({ nome: c.nome, descricao: c.descricao, valorHora: c.valorHora });
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome.trim()) {
      toast.error("Informe o nome da categoria.");
      return;
    }
    if (editingId !== null) {
      setCategorias((prev) => prev.map((c) => c.id === editingId ? { ...c, ...formData } : c));
      toast.success("Categoria atualizada com sucesso.");
    } else {
      const nextId = Math.max(0, ...categorias.map((c) => c.id)) + 1;
      setCategorias((prev) => [...prev, { id: nextId, tecnicos: 0, ...formData }]);
      toast.success("Categoria incluída com sucesso.");
    }
    setSheetOpen(false);
  };

  const set = (partial: Partial<typeof formData>) => setFormData((prev) => ({ ...prev, ...partial }));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Categorias de Técnicos</h1>
        <Button onClick={openCreate} className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
          <Plus size={16} /> Incluir
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar categoria..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor/Hora</TableHead>
              <TableHead className="text-center">Técnicos</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhuma categoria encontrada.</TableCell>
              </TableRow>
            )}
            {filtered.map((c, i) => (
              <TableRow key={c.id} className={cn(i % 2 === 0 && "bg-muted/20")}>
                <TableCell className="font-medium">{c.nome}</TableCell>
                <TableCell className="text-muted-foreground">{c.descricao}</TableCell>
                <TableCell className="font-mono">{c.valorHora}</TableCell>
                <TableCell className="text-center">{c.tecnicos}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(c)}>
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
            <SheetTitle>{editingId !== null ? "Editar Categoria" : "Nova Categoria"}</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nome *</Label>
                <Input value={formData.nome} onChange={(e) => set({ nome: e.target.value })} placeholder="Ex: Instalador Sênior" />
              </div>
              <div className="space-y-1.5">
                <Label>Descrição</Label>
                <Textarea value={formData.descricao} onChange={(e) => set({ descricao: e.target.value })} rows={3} placeholder="Descreva o perfil desta categoria" />
              </div>
              <div className="space-y-1.5">
                <Label>Valor/Hora</Label>
                <Input value={formData.valorHora} onChange={(e) => set({ valorHora: e.target.value })} placeholder="Ex: R$ 85,00" />
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
