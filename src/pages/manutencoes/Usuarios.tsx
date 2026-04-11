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

interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  empresa: string;
  status: string;
}

const perfilOptions = ["Administrador", "Atendente", "Técnico"];
const statusOptions = ["Ativo", "Inativo"];

const perfilColor: Record<string, string> = {
  "Administrador": "border-slate-200 text-slate-700",
  "Atendente": "border-slate-200 text-slate-700",
  "Técnico": "border-emerald-200 text-emerald-700",
};

const statusBadgeBase = "rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-none";

const seedUsuarios: Usuario[] = [
  { id: 1, nome: "Maria Souza", email: "maria@saeggo.com.br", perfil: "Atendente", empresa: "Saeggo do Brasil", status: "Ativo" },
  { id: 2, nome: "Carlos Silva", email: "carlos@saeggo.com.br", perfil: "Técnico", empresa: "Saeggo do Brasil", status: "Ativo" },
  { id: 3, nome: "João Santos", email: "joao@saeggo.com.br", perfil: "Técnico", empresa: "Saeggo do Brasil", status: "Ativo" },
  { id: 4, nome: "Ana Costa", email: "ana@saeggo.com.br", perfil: "Atendente", empresa: "Saeggo do Brasil", status: "Ativo" },
  { id: 5, nome: "Admin Master", email: "admin@saeggo.com.br", perfil: "Administrador", empresa: "Saeggo do Brasil", status: "Ativo" },
  { id: 6, nome: "Pedro Lima", email: "pedro@saeggo.com.br", perfil: "Técnico", empresa: "Saeggo do Brasil", status: "Inativo" },
];

function createEmpty() {
  return { nome: "", email: "", perfil: "Atendente", empresa: "Saeggo do Brasil", status: "Ativo" };
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(seedUsuarios);
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(createEmpty());

  const filtered = usuarios.filter(
    (u) => !search || u.nome.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setFormData(createEmpty());
    setSheetOpen(true);
  };

  const openEdit = (u: Usuario) => {
    setEditingId(u.id);
    setFormData({ nome: u.nome, email: u.email, perfil: u.perfil, empresa: u.empresa, status: u.status });
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome.trim()) {
      toast.error("Informe o nome do usuário.");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Informe o e-mail do usuário.");
      return;
    }
    if (editingId !== null) {
      setUsuarios((prev) => prev.map((u) => u.id === editingId ? { ...u, ...formData } : u));
      toast.success("Usuário atualizado com sucesso.");
    } else {
      const nextId = Math.max(0, ...usuarios.map((u) => u.id)) + 1;
      setUsuarios((prev) => [...prev, { id: nextId, ...formData }]);
      toast.success("Usuário incluído com sucesso.");
    }
    setSheetOpen(false);
  };

  const set = (partial: Partial<typeof formData>) => setFormData((prev) => ({ ...prev, ...partial }));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
        <Button onClick={openCreate} className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
          <Plus size={16} /> Incluir
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]" />
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
                <TableCell className="text-sm">{u.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(statusBadgeBase, perfilColor[u.perfil])}>{u.perfil}</Badge>
                </TableCell>
                <TableCell>{u.empresa}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(statusBadgeBase, u.status === "Ativo" ? "border-emerald-200 text-emerald-700" : "border-rose-200 text-rose-700")}
                  >
                    {u.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(u)}>
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
                <Input type="email" value={formData.email} onChange={(e) => set({ email: e.target.value })} placeholder="usuario@exemplo.com.br" />
              </div>
              <div className="space-y-1.5">
                <Label>Perfil</Label>
                <Select value={formData.perfil} onValueChange={(v) => set({ perfil: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {perfilOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Empresa</Label>
                <Input value={formData.empresa} onChange={(e) => set({ empresa: e.target.value })} placeholder="Nome da empresa" />
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
