import { useState } from "react";
import { Search, Plus, Edit, Trash2, ToggleLeft, ToggleRight, X, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
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
import { maskCPF, maskPhone, validarCPF } from "@/lib/cpf";
import {
  useTecnicos, upsertTecnico, deleteTecnico, toggleTecnicoStatus,
  getNextTecnicoId, cpfTecnicoExiste, Tecnico,
} from "@/data/tecnicos";
import { useCategoriasTecnicos } from "@/data/categorias-tecnicos";

const statusBadgeBase = "rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-none";

const especialidadesSugeridas = ["Instalação", "Elétrica", "Rastreamento", "Manutenção", "Fibra", "TI", "Refrigeração", "Hidráulica"];

function createEmpty() {
  return {
    nome: "", cpf: "", telefone: "", email: "", categoriaId: 0,
    especialidades: [] as string[], dataAdmissao: "", ativo: true, observacoes: "",
  };
}

export default function Tecnicos() {
  const tecnicos = useTecnicos();
  const categorias = useCategoriasTecnicos();
  const [search, setSearch] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(createEmpty());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [novaEspecialidade, setNovaEspecialidade] = useState("");
  const [cpfError, setCpfError] = useState("");

  const filtered = tecnicos.filter((t) => {
    const matchSearch = !search || t.nome.toLowerCase().includes(search.toLowerCase()) || t.cpf.includes(search);
    const matchCategoria = filterCategoria === "all" || String(t.categoriaId) === filterCategoria;
    const matchStatus = filterStatus === "all" || (filterStatus === "ativo" ? t.ativo : !t.ativo);
    return matchSearch && matchCategoria && matchStatus;
  });

  const openCreate = () => {
    setEditingId(null);
    setFormData(createEmpty());
    setCpfError("");
    setSheetOpen(true);
  };

  const openEdit = (t: Tecnico) => {
    setEditingId(t.id);
    setFormData({
      nome: t.nome, cpf: t.cpf, telefone: t.telefone, email: t.email,
      categoriaId: t.categoriaId, especialidades: [...t.especialidades],
      dataAdmissao: t.dataAdmissao, ativo: t.ativo, observacoes: t.observacoes,
    });
    setCpfError("");
    setSheetOpen(true);
  };

  const handleCpfChange = (value: string) => {
    const masked = maskCPF(value);
    set({ cpf: masked });
    const clean = masked.replace(/\D/g, "");
    if (clean.length === 11) {
      if (!validarCPF(masked)) {
        setCpfError("CPF inválido.");
      } else if (cpfTecnicoExiste(masked, editingId ?? undefined)) {
        setCpfError("CPF já cadastrado.");
      } else {
        setCpfError("");
      }
    } else {
      setCpfError("");
    }
  };

  const addEspecialidade = (esp: string) => {
    const trimmed = esp.trim();
    if (!trimmed || formData.especialidades.includes(trimmed)) return;
    set({ especialidades: [...formData.especialidades, trimmed] });
    setNovaEspecialidade("");
  };

  const removeEspecialidade = (esp: string) => {
    set({ especialidades: formData.especialidades.filter(e => e !== esp) });
  };

  const handleSave = () => {
    if (!formData.nome.trim()) { toast.error("Informe o nome do técnico."); return; }
    if (!formData.cpf.trim()) { toast.error("Informe o CPF."); return; }
    if (!validarCPF(formData.cpf)) { toast.error("CPF inválido."); return; }
    if (cpfTecnicoExiste(formData.cpf, editingId ?? undefined)) { toast.error("CPF já cadastrado."); return; }
    if (!formData.telefone.trim()) { toast.error("Informe o telefone."); return; }
    if (!formData.categoriaId) { toast.error("Selecione a categoria."); return; }
    if (!formData.dataAdmissao) { toast.error("Informe a data de admissão."); return; }

    const now = new Date().toISOString();
    if (editingId !== null) {
      const existing = tecnicos.find(t => t.id === editingId)!;
      upsertTecnico({ ...existing, ...formData, updatedAt: now });
      toast.success("Técnico atualizado com sucesso.");
    } else {
      upsertTecnico({ ...formData, id: getNextTecnicoId(), createdAt: now, updatedAt: now });
      toast.success("Técnico incluído com sucesso.");
    }
    setSheetOpen(false);
  };

  const handleDelete = () => {
    if (deleteId === null) return;
    deleteTecnico(deleteId);
    toast.success("Técnico excluído.");
    setDeleteId(null);
  };

  const handleToggle = (t: Tecnico) => {
    toggleTecnicoStatus(t.id);
    toast.success(t.ativo ? "Técnico desativado." : "Técnico ativado.");
  };

  const set = (partial: Partial<typeof formData>) => setFormData((prev) => ({ ...prev, ...partial }));

  const ativos = tecnicos.filter(t => t.ativo).length;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Técnicos</h1>
          <p className="text-sm text-muted-foreground">{ativos} ativos · {tecnicos.length} total</p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
          <Plus size={16} /> Incluir
        </Button>
      </div>

      {/* Cards KPI */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-lg border p-3 flex items-center gap-3">
          <UserCog size={20} className="text-primary" />
          <div><p className="text-xs text-muted-foreground">Total</p><p className="text-xl font-bold">{tecnicos.length}</p></div>
        </div>
        <div className="bg-card rounded-lg border p-3 flex items-center gap-3">
          <UserCog size={20} className="text-emerald-600" />
          <div><p className="text-xs text-muted-foreground">Ativos</p><p className="text-xl font-bold text-emerald-600">{ativos}</p></div>
        </div>
        <div className="bg-card rounded-lg border p-3 flex items-center gap-3">
          <UserCog size={20} className="text-rose-500" />
          <div><p className="text-xs text-muted-foreground">Inativos</p><p className="text-xl font-bold text-rose-500">{tecnicos.length - ativos}</p></div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou CPF..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterCategoria} onValueChange={setFilterCategoria}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Categoria" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categorias.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ativo">Ativos</SelectItem>
            <SelectItem value="inativo">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Especialidades</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum técnico encontrado.</TableCell>
              </TableRow>
            )}
            {filtered.map((t, i) => {
              const cat = categorias.find(c => c.id === t.categoriaId);
              return (
                <TableRow key={t.id} className={cn(i % 2 === 0 && "bg-muted/20")}>
                  <TableCell className="font-medium">{t.nome}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {t.cpf.replace(/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/, "***.$2.$3-**")}
                  </TableCell>
                  <TableCell>
                    {cat ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: cat.cor }}>
                        {cat.nome}
                      </span>
                    ) : <span className="text-muted-foreground text-xs">—</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {t.especialidades.slice(0, 3).map(e => (
                        <Badge key={e} variant="secondary" className="text-xs py-0">{e}</Badge>
                      ))}
                      {t.especialidades.length > 3 && (
                        <Badge variant="outline" className="text-xs py-0">+{t.especialidades.length - 3}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{t.telefone}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(statusBadgeBase, t.ativo ? "border-emerald-200 text-emerald-700" : "border-rose-200 text-rose-700")}
                    >
                      {t.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(t)}>
                        <Edit size={14} className="text-primary" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleToggle(t)}>
                        {t.ativo ? <ToggleRight size={14} className="text-emerald-600" /> : <ToggleLeft size={14} className="text-muted-foreground" />}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setDeleteId(t.id)}>
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

      {/* Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full max-w-lg flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>{editingId !== null ? "Editar Técnico" : "Novo Técnico"}</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nome *</Label>
                <Input value={formData.nome} onChange={(e) => set({ nome: e.target.value })} placeholder="Nome completo" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>CPF *</Label>
                  <Input
                    value={formData.cpf}
                    onChange={(e) => handleCpfChange(e.target.value)}
                    placeholder="000.000.000-00"
                    className={cn(cpfError && "border-rose-400")}
                  />
                  {cpfError && <p className="text-xs text-rose-500">{cpfError}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Telefone *</Label>
                  <Input
                    value={formData.telefone}
                    onChange={(e) => set({ telefone: maskPhone(e.target.value) })}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>E-mail</Label>
                <Input type="email" value={formData.email} onChange={(e) => set({ email: e.target.value })} placeholder="tecnico@telig.com.br" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Categoria *</Label>
                  <Select value={String(formData.categoriaId || "")} onValueChange={(v) => set({ categoriaId: Number(v) })}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {categorias.filter(c => c.ativo).map(c => <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Data de admissão *</Label>
                  <Input type="date" value={formData.dataAdmissao} onChange={(e) => set({ dataAdmissao: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Especialidades</Label>
                <div className="flex gap-2">
                  <Input
                    value={novaEspecialidade}
                    onChange={(e) => setNovaEspecialidade(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addEspecialidade(novaEspecialidade); } }}
                    placeholder="Adicionar especialidade..."
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => addEspecialidade(novaEspecialidade)}>
                    <Plus size={14} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {especialidadesSugeridas.filter(e => !formData.especialidades.includes(e)).map(e => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => addEspecialidade(e)}
                      className="text-xs px-2 py-0.5 rounded-full border border-dashed border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      + {e}
                    </button>
                  ))}
                </div>
                {formData.especialidades.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {formData.especialidades.map(e => (
                      <span key={e} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {e}
                        <button type="button" onClick={() => removeEspecialidade(e)} className="hover:text-rose-500">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Observações</Label>
                <Textarea value={formData.observacoes} onChange={(e) => set({ observacoes: e.target.value })} rows={3} placeholder="Observações adicionais..." />
              </div>
            </div>
          </ScrollArea>
          <div className="border-t px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">Salvar</Button>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir técnico?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
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
