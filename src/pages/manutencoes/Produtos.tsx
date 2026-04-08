import { useState } from "react";
import { Search, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const mockProdutos = [
  { id: 1, nome: "TJammer 4G", codigo: "TJM-4G", categoria: "Jammer", preco: "R$ 850,00", estoque: 42, status: "Ativo" },
  { id: 2, nome: "TBlock Pro", codigo: "TBL-PRO", categoria: "Bloqueador", preco: "R$ 320,00", estoque: 38, status: "Ativo" },
  { id: 3, nome: "Rastreador 4G", codigo: "RST-4G", categoria: "Rastreador", preco: "R$ 450,00", estoque: 85, status: "Ativo" },
  { id: 4, nome: "TBlock V1", codigo: "TBL-V1", categoria: "Bloqueador", preco: "R$ 200,00", estoque: 0, status: "Descontinuado" },
  { id: 5, nome: "Bloqueador Standard", codigo: "BLQ-STD", categoria: "Bloqueador", preco: "R$ 180,00", estoque: 30, status: "Ativo" },
  { id: 6, nome: "Antena GPS", codigo: "ANT-GPS", categoria: "Acessório", preco: "R$ 45,00", estoque: 120, status: "Ativo" },
];

export default function Produtos() {
  const [search, setSearch] = useState("");
  const filtered = mockProdutos.filter((p) => !search || p.nome.toLowerCase().includes(search.toLowerCase()) || p.codigo.toLowerCase().includes(search.toLowerCase()));

  const statusBadgeBase = "rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-none";

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Produtos</h1>
        <Button className="gap-2 bg-success hover:bg-success/90 text-success-foreground"><Plus size={16} /> Incluir</Button>
      </div>
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar produto ou código..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader><TableRow className="bg-muted/50">
            <TableHead>Código</TableHead><TableHead>Nome</TableHead><TableHead>Categoria</TableHead><TableHead className="text-right">Preço</TableHead><TableHead className="text-center">Estoque</TableHead><TableHead>Status</TableHead><TableHead className="w-[60px]" />
          </TableRow></TableHeader>
          <TableBody>
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
                <TableCell><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Edit size={14} className="text-primary" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
