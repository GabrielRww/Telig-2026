import { useState } from "react";
import { Search, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const mockModelos = [
  { id: 1, marca: "Fiat", modelo: "Strada", tipo: "Pickup", observacao: "Cabine simples e dupla" },
  { id: 2, marca: "Volkswagen", modelo: "Gol", tipo: "Hatch", observacao: "" },
  { id: 3, marca: "Toyota", modelo: "Hilux", tipo: "Pickup", observacao: "4x4 e 4x2" },
  { id: 4, marca: "Chevrolet", modelo: "S10", tipo: "Pickup", observacao: "" },
  { id: 5, marca: "Ford", modelo: "Ranger", tipo: "Pickup", observacao: "Nova geração 2024+" },
  { id: 6, marca: "Fiat", modelo: "Toro", tipo: "SUV/Pickup", observacao: "" },
  { id: 7, marca: "Volkswagen", modelo: "Amarok", tipo: "Pickup", observacao: "" },
];

export default function ModelosVeiculos() {
  const [search, setSearch] = useState("");
  const filtered = mockModelos.filter((m) => !search || m.marca.toLowerCase().includes(search.toLowerCase()) || m.modelo.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Modelos de Veículos</h1>
        <Button className="gap-2 bg-success hover:bg-success/90 text-success-foreground"><Plus size={16} /> Incluir</Button>
      </div>
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar marca ou modelo..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader><TableRow className="bg-muted/50">
            <TableHead>Marca</TableHead><TableHead>Modelo</TableHead><TableHead>Tipo</TableHead><TableHead>Observação</TableHead><TableHead className="w-[60px]" />
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((m, i) => (
              <TableRow key={m.id} className={cn(i % 2 === 0 && "bg-muted/20")}>
                <TableCell className="font-medium">{m.marca}</TableCell>
                <TableCell>{m.modelo}</TableCell>
                <TableCell>{m.tipo}</TableCell>
                <TableCell className="text-muted-foreground">{m.observacao || "-"}</TableCell>
                <TableCell><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Edit size={14} className="text-primary" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
