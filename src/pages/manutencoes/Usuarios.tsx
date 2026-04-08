import { useState } from "react";
import { Search, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const mockUsers = [
  { id: 1, nome: "Maria Souza", email: "maria@saeggo.com.br", perfil: "Atendente", empresa: "Saeggo do Brasil", status: "Ativo" },
  { id: 2, nome: "Carlos Silva", email: "carlos@saeggo.com.br", perfil: "Técnico", empresa: "Saeggo do Brasil", status: "Ativo" },
  { id: 3, nome: "João Santos", email: "joao@saeggo.com.br", perfil: "Técnico", empresa: "Saeggo do Brasil", status: "Ativo" },
  { id: 4, nome: "Ana Costa", email: "ana@saeggo.com.br", perfil: "Atendente", empresa: "Saeggo do Brasil", status: "Ativo" },
  { id: 5, nome: "Admin Master", email: "admin@saeggo.com.br", perfil: "Administrador", empresa: "Saeggo do Brasil", status: "Ativo" },
  { id: 6, nome: "Pedro Lima", email: "pedro@saeggo.com.br", perfil: "Técnico", empresa: "Saeggo do Brasil", status: "Inativo" },
];

const perfilColor: Record<string, string> = {
  "Administrador": "border-slate-200 text-slate-700",
  "Atendente": "border-slate-200 text-slate-700",
  "Técnico": "border-emerald-200 text-emerald-700",
};

const statusBadgeBase = "rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-none";

export default function Usuarios() {
  const [search, setSearch] = useState("");
  const filtered = mockUsers.filter((u) => !search || u.nome.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
        <Button className="gap-2 bg-success hover:bg-success/90 text-success-foreground"><Plus size={16} /> Incluir</Button>
      </div>
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader><TableRow className="bg-muted/50">
            <TableHead>Nome</TableHead><TableHead>E-mail</TableHead><TableHead>Perfil</TableHead><TableHead>Empresa</TableHead><TableHead>Status</TableHead><TableHead className="w-[60px]" />
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((u, i) => (
              <TableRow key={u.id} className={cn(i % 2 === 0 && "bg-muted/20")}>
                <TableCell className="font-medium">{u.nome}</TableCell>
                <TableCell className="text-sm">{u.email}</TableCell>
                <TableCell><Badge variant="outline" className={cn(statusBadgeBase, perfilColor[u.perfil])}>{u.perfil}</Badge></TableCell>
                <TableCell>{u.empresa}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(statusBadgeBase, u.status === "Ativo" ? "border-emerald-200 text-emerald-700" : "border-rose-200 text-rose-700")}
                  >
                    {u.status}
                  </Badge>
                </TableCell>
                <TableCell><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Edit size={14} className="text-primary" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
