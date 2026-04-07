import { useState } from "react";
import { Search, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const mockCategorias = [
  { id: 1, nome: "Instalador Sênior", descricao: "Profissional com 5+ anos de experiência", valorHora: "R$ 85,00", tecnicos: 2 },
  { id: 2, nome: "Instalador Pleno", descricao: "Profissional com 2-5 anos de experiência", valorHora: "R$ 65,00", tecnicos: 4 },
  { id: 3, nome: "Instalador Júnior", descricao: "Profissional em formação", valorHora: "R$ 45,00", tecnicos: 3 },
  { id: 4, nome: "Eletricista Automotivo", descricao: "Especialista em elétrica veicular", valorHora: "R$ 75,00", tecnicos: 1 },
];

export default function CategoriasTecnicos() {
  const [search, setSearch] = useState("");
  const filtered = mockCategorias.filter((c) => !search || c.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Categorias de Técnicos</h1>
        <Button className="gap-2 bg-success hover:bg-success/90 text-success-foreground"><Plus size={16} /> Incluir</Button>
      </div>
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar categoria..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader><TableRow className="bg-muted/50">
            <TableHead>Nome</TableHead><TableHead>Descrição</TableHead><TableHead>Valor/Hora</TableHead><TableHead className="text-center">Técnicos</TableHead><TableHead className="w-[60px]" />
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((c, i) => (
              <TableRow key={c.id} className={cn(i % 2 === 0 && "bg-muted/20")}>
                <TableCell className="font-medium">{c.nome}</TableCell>
                <TableCell className="text-muted-foreground">{c.descricao}</TableCell>
                <TableCell className="font-mono">{c.valorHora}</TableCell>
                <TableCell className="text-center">{c.tecnicos}</TableCell>
                <TableCell><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Edit size={14} className="text-primary" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
