import { useState } from "react";
import { Search, Plus, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  useCategoriasTecnicos, upsertCategoriaTecnico, deleteCategoriaTecnico,
  toggleCategoriaTecnicoStatus, getNextCategoriaTecnicoId, CategoriaTecnico,
} from "@/data/categorias-tecnicos";
import { countTecnicosByCategoria } from "@/data/tecnicos";

const statusBadgeBase = "rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-none";

const defaultColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

function createEmpty(): Omit<CategoriaTecnico, "id" | "createdAt" | "updatedAt"> {
  return { nome: "", descricao: "", cor: "#3b82f6", ativo: true };
}

export default function CategoriasTecnicos() {
  const categorias = useCategoriasTecnicos();
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(createEmpty());
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = categorias.filter(
    (c) => !search || c.nome.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setFormData(createEmpty());
    setSheetOpen(true);
  };

  const openEdit = (c: CategoriaTecnico) => {
    setEditingId(c.id);
    setFormData({ nome: c.nome, descricao: c.descricao, cor: c.cor, ativo: c.ativo });
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome.trim()) {
      toast.error("Informe o nome da categoria.");
      return;
    }
    const now = new Date().toISOString();
    if (editingId !== null) {
      upsertCategoriaTecnico({ ...formData, id: editingId, createdAt: now, updatedAt: now });
      toast.success("Categoria atualizada com sucesso.");
    } else {
      const id = getNextCategoriaTecnicoId();
      upsertCategoriaTecnico({ ...formData, id, createdAt: now, updatedAt: now });
      toast.success("Categoria incluída com sucesso.");
    }
    setSheetOpen(false);
  };

  const handleDelete = () => {
    if (deleteId === null) return;
    const count = countTecnicosByCategoria(deleteId);
    if (count > 0) {
      toast.error(`Não é possível excluir: ${count} técnico(s) ativo(s) vinculado(s).`);
      setDeleteId(null);
      return;
    }
    deleteCategoriaTecnico(deleteId);
    toast.success("Categoria excluída.");
    setDeleteId(null);
  };

  const handleToggle = (c: CategoriaTecnico) => {
    if (c.ativo) {
      const count = countTecnicosByCategoria(c.id);
      if (count > 0) {
        toast.warning(`Atenção: ${count} técnico(s) ativo(s) ficará(ão) sem categoria ao desativar.`);
      }
    }
    toggleCategoriaTecnicoStatus(c.id);
    toast.success(c.ativo ? "Categoria desativada." : "Categoria ativada.");
  };

  const set = (partial: Partial<typeof formData>) => setFormData((prev) => ({ ...prev, ...partial }));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categorias de Técnicos</h1>
          <p className="text-sm text-muted-foreground">{categorias.filter(c => c.ativo).length} ativas · {categorias.length} total</p>
        </div>
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
              <TableHead className="text-center">Técnicos ativos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhuma categoria encontrada.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((c, i) => {
              const tecnicosCount = countTecnicosByCategoria(c.id);
              return (
                <TableRow key={c.id} className={cn(i % 2 === 0 && "bg-muted/20")}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.cor }} />
                      {c.nome}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{c.descricao || "—"}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-mono">{tecnicosCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(statusBadgeBase, c.ativo ? "border-emerald-200 text-emerald-700" : "border-rose-200 text-rose-700")}
                    >
                      {c.ativo ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(c)} title="Editar">
                        <Edit size={14} className="text-primary" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleToggle(c)} title={c.ativo ? "Desativar" : "Ativar"}>
                        {c.ativo
                          ? <ToggleRight size={14} className="text-emerald-600" />
                          : <ToggleLeft size={14} className="text-muted-foreground" />}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setDeleteId(c.id)} title="Excluir">
                        <Trash2 size={14} className="text-rose-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Sheet de criação/edição */}
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
                <Label>Cor do badge</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.cor}
                    onChange={(e) => set({ cor: e.target.value })}
                    className="h-9 w-14 rounded border border-input cursor-pointer"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {defaultColors.map((cor) => (
                      <button
                        key={cor}
                        type="button"
                        onClick={() => set({ cor })}
                        className={cn("w-6 h-6 rounded-full border-2 transition-all", formData.cor === cor ? "border-foreground scale-110" : "border-transparent")}
                        style={{ backgroundColor: cor }}
                        title={cor}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: formData.cor }}>
                    {formData.nome || "Pré-visualização"}
                  </span>
                </div>
              </div>
            </div>
          </ScrollArea>
          <div className="border-t px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">Salvar</Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialog de exclusão */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Técnicos vinculados a esta categoria precisarão ser atualizados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
