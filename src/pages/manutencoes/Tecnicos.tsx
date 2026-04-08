import { useState } from "react";
import { Search, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const mockTecnicos = [
  { id: 1, nome: "Carlos Silva", categoria: "Instalador Sênior", telefone: "(54) 99911-1111", regiao: "Passo Fundo", osAtivas: 3, status: "Disponível" },
  { id: 2, nome: "João Santos", categoria: "Instalador Pleno", telefone: "(54) 99922-2222", regiao: "Passo Fundo", osAtivas: 2, status: "Em atendimento" },
  { id: 3, nome: "Pedro Lima", categoria: "Instalador Júnior", telefone: "(54) 99933-3333", regiao: "Erechim", osAtivas: 0, status: "Indisponível" },
  { id: 4, nome: "Ana Costa", categoria: "Instalador Pleno", telefone: "(54) 99944-4444", regiao: "Caxias do Sul", osAtivas: 1, status: "Disponível" },
];

const statusColor: Record<string, string> = {
  "Disponível": "border-slate-200 text-slate-700",
  "Em atendimento": "border-amber-200 text-amber-700",
  "Indisponível": "border-rose-200 text-rose-700",
};

const statusBadgeBase = "rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-none";

export default function Tecnicos() {
  const [search, setSearch] = useState("");
  const filtered = mockTecnicos.filter((t) => !search || t.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Técnicos</h1>
        <Button className="gap-2 bg-success hover:bg-success/90 text-success-foreground"><Plus size={16} /> Incluir</Button>
      </div>
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar técnico..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader><TableRow className="bg-muted/50">
            <TableHead>Nome</TableHead><TableHead>Categoria</TableHead><TableHead>Telefone</TableHead><TableHead>Região</TableHead><TableHead className="text-center">OS Ativas</TableHead><TableHead>Status</TableHead><TableHead className="w-[60px]" />
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((t, i) => (
              <TableRow key={t.id} className={cn(i % 2 === 0 && "bg-muted/20")}>
                <TableCell className="font-medium">{t.nome}</TableCell>
                <TableCell>{t.categoria}</TableCell>
                <TableCell className="font-mono text-sm">{t.telefone}</TableCell>
                <TableCell>{t.regiao}</TableCell>
                <TableCell className="text-center"><Badge variant="secondary" className="font-mono">{t.osAtivas}</Badge></TableCell>
                <TableCell><Badge variant="outline" className={cn(statusBadgeBase, statusColor[t.status])}>{t.status}</Badge></TableCell>
                <TableCell><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Edit size={14} className="text-primary" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
