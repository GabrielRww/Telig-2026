import { useState } from "react";
import { Search, Plus, Edit, Trash2, ToggleLeft, ToggleRight, TrendingUp, DollarSign, Users } from "lucide-react";
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
  useVendedores, upsertVendedor, deleteVendedor, toggleVendedorStatus,
  getNextVendedorId, cpfVendedorExiste, emailVendedorExiste, formatCurrency, Vendedor,
} from "@/data/vendedores";

const statusBadgeBase = "rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-none";

function createEmpty() {
  return {
    nome: "", cpf: "", telefone: "", email: "",
    comissaoPercentual: 0, metaMensal: 0,
    dataAdmissao: "", ativo: true, observacoes: "",
  };
}

export default function Vendedores() {
  const vendedores = useVendedores();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(createEmpty());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [cpfError, setCpfError] = useState("");
  const [emailError, setEmailError] = useState("");

  const filtered = vendedores.filter((v) => {
    const matchSearch = !search || v.nome.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || (filterStatus === "ativo" ? v.ativo : !v.ativo);
    return matchSearch && matchStatus;
  });

  const ativos = vendedores.filter(v => v.ativo).length;
  const metaTotal = vendedores.filter(v => v.ativo).reduce((acc, v) => acc + v.metaMensal, 0);

  const openCreate = () => {
    setEditingId(null);
    setFormData(createEmpty());
    setCpfError("");
    setEmailError("");
    setSheetOpen(true);
  };

  const openEdit = (v: Vendedor) => {
    setEditingId(v.id);
    setFormData({
      nome: v.nome, cpf: v.cpf, telefone: v.telefone, email: v.email,
      comissaoPercentual: v.comissaoPercentual, metaMensal: v.metaMensal,
      dataAdmissao: v.dataAdmissao, ativo: v.ativo, observacoes: v.observacoes,
    });
    setCpfError("");
    setEmailError("");
    setSheetOpen(true);
  };

  const handleCpfChange = (value: string) => {
    const masked = maskCPF(value);
    set({ cpf: masked });
    const clean = masked.replace(/\D/g, "");
    if (clean.length === 11) {
      if (!validarCPF(masked)) setCpfError("CPF inválido.");
      else if (cpfVendedorExiste(masked, editingId ?? undefined)) setCpfError("CPF já cadastrado.");
      else setCpfError("");
    } else setCpfError("");
  };

  const handleEmailChange = (email: string) => {
    set({ email });
    if (email && emailVendedorExiste(email, editingId ?? undefined)) setEmailError("E-mail já cadastrado.");
    else setEmailError("");
  };

  const handleSave = () => {
    if (!formData.nome.trim()) { toast.error("Informe o nome."); return; }
    if (!formData.cpf.trim() || !validarCPF(formData.cpf)) { toast.error("CPF inválido."); return; }
    if (cpfVendedorExiste(formData.cpf, editingId ?? undefined)) { toast.error("CPF já cadastrado."); return; }
    if (!formData.telefone.trim()) { toast.error("Informe o telefone."); return; }
    if (!formData.email.trim()) { toast.error("Informe o e-mail."); return; }
    if (emailVendedorExiste(formData.email, editingId ?? undefined)) { toast.error("E-mail já cadastrado."); return; }
    if (formData.comissaoPercentual < 0 || formData.comissaoPercentual > 100) { toast.error("Comissão deve ser entre 0% e 100%."); return; }
    if (!formData.dataAdmissao) { toast.error("Informe a data de admissão."); return; }

    const now = new Date().toISOString();
    if (editingId !== null) {
      const existing = vendedores.find(v => v.id === editingId)!;
      upsertVendedor({ ...existing, ...formData, updatedAt: now });
      toast.success("Vendedor atualizado com sucesso.");
    } else {
      upsertVendedor({ ...formData, id: getNextVendedorId(), createdAt: now, updatedAt: now });
      toast.success("Vendedor incluído com sucesso.");
    }
    setSheetOpen(false);
  };

  const handleDelete = () => {
    if (deleteId === null) return;
    deleteVendedor(deleteId);
    toast.success("Vendedor excluído.");
    setDeleteId(null);
  };

  const handleToggle = (v: Vendedor) => {
    toggleVendedorStatus(v.id);
    toast.success(v.ativo ? "Vendedor desativado." : "Vendedor ativado.");
  };

  const set = (partial: Partial<typeof formData>) => setFormData((prev) => ({ ...prev, ...partial }));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vendedores</h1>
          <p className="text-sm text-muted-foreground">{ativos} ativos · {vendedores.length} total</p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
          <Plus size={16} /> Incluir
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-lg border p-3 flex items-center gap-3">
          <Users size={20} className="text-primary" />
          <div><p className="text-xs text-muted-foreground">Vendedores ativos</p><p className="text-xl font-bold">{ativos}</p></div>
        </div>
        <div className="bg-card rounded-lg border p-3 flex items-center gap-3">
          <TrendingUp size={20} className="text-emerald-600" />
          <div>
            <p className="text-xs text-muted-foreground">Comissão média</p>
            <p className="text-xl font-bold text-emerald-600">
              {ativos > 0 ? (vendedores.filter(v => v.ativo).reduce((acc, v) => acc + v.comissaoPercentual, 0) / ativos).toFixed(1) : "0"}%
            </p>
          </div>
        </div>
        <div className="bg-card rounded-lg border p-3 flex items-center gap-3">
          <DollarSign size={20} className="text-amber-600" />
          <div><p className="text-xs text-muted-foreground">Meta total mensal</p><p className="text-lg font-bold text-amber-600">{formatCurrency(metaTotal)}</p></div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
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
              <TableHead>Telefone</TableHead>
              <TableHead className="text-center">Comissão</TableHead>
              <TableHead className="text-right">Meta Mensal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum vendedor encontrado.</TableCell>
              </TableRow>
            )}
            {filtered.map((v, i) => (
              <TableRow key={v.id} className={cn(i % 2 === 0 && "bg-muted/20")}>
                <TableCell className="font-medium">{v.nome}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{v.email}</TableCell>
                <TableCell className="font-mono text-sm">{v.telefone}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={cn("font-mono text-xs", v.comissaoPercentual > 0 ? "border-emerald-200 text-emerald-700" : "border-slate-200 text-slate-600")}>
                    {v.comissaoPercentual.toFixed(1)}%
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{v.metaMensal > 0 ? formatCurrency(v.metaMensal) : "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(statusBadgeBase, v.ativo ? "border-emerald-200 text-emerald-700" : "border-rose-200 text-rose-700")}
                  >
                    {v.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(v)}>
                      <Edit size={14} className="text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleToggle(v)}>
                      {v.ativo ? <ToggleRight size={14} className="text-emerald-600" /> : <ToggleLeft size={14} className="text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setDeleteId(v.id)}>
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
        <SheetContent side="right" className="w-full max-w-lg flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>{editingId !== null ? "Editar Vendedor" : "Novo Vendedor"}</SheetTitle>
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
                <Label>E-mail *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="vendedor@telig.com.br"
                  className={cn(emailError && "border-rose-400")}
                />
                {emailError && <p className="text-xs text-rose-500">{emailError}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Comissão (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={formData.comissaoPercentual}
                    onChange={(e) => set({ comissaoPercentual: parseFloat(e.target.value) || 0 })}
                    placeholder="0.0"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Meta Mensal (R$)</Label>
                  <Input
                    type="number"
                    min={0}
                    step={100}
                    value={formData.metaMensal}
                    onChange={(e) => set({ metaMensal: parseFloat(e.target.value) || 0 })}
                    placeholder="0,00"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Data de admissão *</Label>
                <Input type="date" value={formData.dataAdmissao} onChange={(e) => set({ dataAdmissao: e.target.value })} />
              </div>
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
            <AlertDialogTitle>Excluir vendedor?</AlertDialogTitle>
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
