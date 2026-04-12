import { useState } from "react";
import { Search, Plus, Edit, Trash2, ToggleLeft, ToggleRight, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  useUsuarios, upsertUsuario, deleteUsuario, toggleUsuarioStatus,
  getNextUsuarioId, emailExiste, PerfilUsuario, perfilLabels, perfilColors,
} from "@/data/usuarios";

const statusBadgeBase = "rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-none";
const perfisOptions: PerfilUsuario[] = ["admin", "gerente", "atendente", "tecnico", "vendedor"];

function createEmpty() {
  return { nome: "", email: "", perfil: "atendente" as PerfilUsuario, ativo: true, telefone: "" };
}

export default function Usuarios() {
  const usuarios = useUsuarios();
  const [search, setSearch] = useState("");
  const [filterPerfil, setFilterPerfil] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(createEmpty());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [emailError, setEmailError] = useState("");

  const filtered = usuarios.filter((u) => {
    const matchSearch = !search || u.nome.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchPerfil = filterPerfil === "all" || u.perfil === filterPerfil;
    const matchStatus = filterStatus === "all" || (filterStatus === "ativo" ? u.ativo : !u.ativo);
    return matchSearch && matchPerfil && matchStatus;
  });

  const openCreate = () => {
    setEditingId(null);
    setFormData(createEmpty());
    setEmailError("");
    setSheetOpen(true);
  };

  const openEdit = (u: typeof usuarios[0]) => {
    setEditingId(u.id);
    setFormData({ nome: u.nome, email: u.email, perfil: u.perfil, ativo: u.ativo, telefone: u.telefone });
    setEmailError("");
    setSheetOpen(true);
  };

  const handleEmailChange = (email: string) => {
    set({ email });
    if (email && emailExiste(email, editingId ?? undefined)) {
      setEmailError("Este e-mail já está em uso.");
    } else {
      setEmailError("");
    }
  };

  const handleSave = () => {
    if (!formData.nome.trim()) { toast.error("Informe o nome do usuário."); return; }
    if (!formData.email.trim()) { toast.error("Informe o e-mail."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { toast.error("E-mail inválido."); return; }
    if (emailExiste(formData.email, editingId ?? undefined)) { toast.error("E-mail já cadastrado."); return; }

    const now = new Date().toISOString();
    if (editingId !== null) {
      const existing = usuarios.find(u => u.id === editingId)!;
      upsertUsuario({ ...existing, ...formData, updatedAt: now });
      toast.success("Usuário atualizado com sucesso.");
    } else {
      upsertUsuario({ ...formData, id: getNextUsuarioId(), createdAt: now, updatedAt: now });
      toast.success("Usuário incluído com sucesso.");
    }
    setSheetOpen(false);
  };

  const handleDelete = () => {
    if (deleteId === null) return;
    deleteUsuario(deleteId);
    toast.success("Usuário excluído.");
    setDeleteId(null);
  };

  const handleToggle = (u: typeof usuarios[0]) => {
    toggleUsuarioStatus(u.id);
    toast.success(u.ativo ? "Usuário desativado." : "Usuário ativado.");
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

  const set = (partial: Partial<typeof formData>) => setFormData((prev) => ({ ...prev, ...partial }));

  const ativos = usuarios.filter(u => u.ativo).length;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
          <p className="text-sm text-muted-foreground">{ativos} ativos · {usuarios.length} total</p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
          <Plus size={16} /> Incluir
        </Button>
      </div>

      {/* Cards KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {perfisOptions.map((p) => (
          <div key={p} className="bg-card rounded-lg border p-3 flex items-center gap-3">
            <span className={cn("flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border", perfilColors[p])}>
              <Users size={14} />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{perfilLabels[p]}</p>
              <p className="text-lg font-bold">{usuarios.filter(u => u.perfil === p).length}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterPerfil} onValueChange={setFilterPerfil}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Perfil" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os perfis</SelectItem>
            {perfisOptions.map(p => <SelectItem key={p} value={p}>{perfilLabels[p]}</SelectItem>)}
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
              <TableHead>E-mail</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum usuário encontrado.</TableCell>
              </TableRow>
            )}
            {filtered.map((u, i) => (
              <TableRow key={u.id} className={cn(i % 2 === 0 && "bg-muted/20")}>
                <TableCell className="font-medium">{u.nome}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(statusBadgeBase, perfilColors[u.perfil])}>
                    {perfilLabels[u.perfil]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(statusBadgeBase, u.ativo ? "border-emerald-200 text-emerald-700" : "border-rose-200 text-rose-700")}
                  >
                    {u.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(u)} title="Editar">
                      <Edit size={14} className="text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleToggle(u)} title={u.ativo ? "Desativar" : "Ativar"}>
                      {u.ativo
                        ? <ToggleRight size={14} className="text-emerald-600" />
                        : <ToggleLeft size={14} className="text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setDeleteId(u.id)} title="Excluir">
                      <Trash2 size={14} className="text-rose-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full max-w-md flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>{editingId !== null ? "Editar Usuário" : "Novo Usuário"}</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nome *</Label>
                <Input value={formData.nome} onChange={(e) => set({ nome: e.target.value })} placeholder="Nome completo" />
              </div>
              <div className="space-y-1.5">
                <Label>E-mail *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="usuario@telig.com.br"
                  className={cn(emailError && "border-rose-400")}
                />
                {emailError && <p className="text-xs text-rose-500">{emailError}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Telefone</Label>
                <Input value={formData.telefone} onChange={(e) => set({ telefone: e.target.value })} placeholder="(00) 00000-0000" />
              </div>
              <div className="space-y-1.5">
                <Label>Perfil *</Label>
                <Select value={formData.perfil} onValueChange={(v) => set({ perfil: v as PerfilUsuario })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {perfisOptions.map(p => <SelectItem key={p} value={p}>{perfilLabels[p]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {editingId === null && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-700">
                  A senha inicial será definida pelo usuário no primeiro acesso.
                </div>
              )}
              {editingId !== null && (
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={formData.ativo ? "ativo" : "inativo"} onValueChange={(v) => set({ ativo: v === "ativo" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="border-t px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">Salvar</Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialog exclusão */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O histórico do usuário será perdido.
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
