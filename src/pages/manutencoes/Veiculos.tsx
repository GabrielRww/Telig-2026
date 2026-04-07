import { useState } from "react";
import { Search, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const mockVeiculos = [
  { id: 1, placa: "ABC1234", modelo: "Fiat Strada", ano: 2023, cor: "Branca", chassi: "9BFAB12E3X1234567", cliente: "Volare Segurança" },
  { id: 2, placa: "XYZ5678", modelo: "VW Gol", ano: 2022, cor: "Prata", chassi: "9BWAB12E3X2345678", cliente: "Tracker Brasil" },
  { id: 3, placa: "DEF9012", modelo: "Toyota Hilux", ano: 2024, cor: "Preta", chassi: "9BFAB12E3X3456789", cliente: "LogSafe" },
  { id: 4, placa: "GHI3456", modelo: "Chevrolet S10", ano: 2023, cor: "Vermelha", chassi: "9BFAB12E3X4567890", cliente: "TransGuarda" },
  { id: 5, placa: "JKL7890", modelo: "Ford Ranger", ano: 2024, cor: "Azul", chassi: "9BFAB12E3X5678901", cliente: "FleetShield" },
];

export default function Veiculos() {
  const [search, setSearch] = useState("");
  const filtered = mockVeiculos.filter((v) => !search || v.placa.toLowerCase().includes(search.toLowerCase()) || v.modelo.toLowerCase().includes(search.toLowerCase()) || v.cliente.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Veículos</h1>
        <Button className="gap-2 bg-success hover:bg-success/90 text-success-foreground"><Plus size={16} /> Incluir</Button>
      </div>
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar placa, modelo ou cliente..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader><TableRow className="bg-muted/50">
            <TableHead>Placa</TableHead><TableHead>Modelo</TableHead><TableHead>Ano</TableHead><TableHead>Cor</TableHead><TableHead>Chassi</TableHead><TableHead>Cliente</TableHead><TableHead className="w-[60px]" />
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((v, i) => (
              <TableRow key={v.id} className={cn(i % 2 === 0 && "bg-muted/20")}>
                <TableCell className="font-mono font-medium">{v.placa}</TableCell>
                <TableCell>{v.modelo}</TableCell>
                <TableCell>{v.ano}</TableCell>
                <TableCell>{v.cor}</TableCell>
                <TableCell className="font-mono text-sm">{v.chassi}</TableCell>
                <TableCell>{v.cliente}</TableCell>
                <TableCell><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Edit size={14} className="text-primary" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
