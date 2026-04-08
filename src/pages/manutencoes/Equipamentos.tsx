import { useState } from "react";
import { Search, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const mockEquipamentos = [
  { id: 1, serial: "TJ-2024-001", produto: "TJammer 4G", cliente: "Volare Segurança", veiculo: "ABC1234", status: "Instalado", dataInstalacao: "05/04/2026" },
  { id: 2, serial: "TJ-2023-145", produto: "TBlock", cliente: "Tracker Brasil", veiculo: "XYZ5678", status: "Instalado", dataInstalacao: "15/03/2026" },
  { id: 3, serial: "TJ-2023-089", produto: "Rastreador 4G", cliente: "LogSafe", veiculo: "DEF9012", status: "Em Manutenção", dataInstalacao: "10/01/2026" },
  { id: 4, serial: "TJ-2024-012", produto: "TJammer 4G", cliente: "TransGuarda", veiculo: "GHI3456", status: "Instalado", dataInstalacao: "04/04/2026" },
  { id: 5, serial: "TJ-2024-055", produto: "TBlock", cliente: "FleetShield", veiculo: "JKL7890", status: "Instalado", dataInstalacao: "03/04/2026" },
  { id: 6, serial: "TJ-2024-056", produto: "Rastreador 4G", cliente: "FleetShield", veiculo: "JKL7890", status: "Instalado", dataInstalacao: "03/04/2026" },
  { id: 7, serial: "TJ-2024-070", produto: "TJammer 4G", cliente: "-", veiculo: "-", status: "Em estoque", dataInstalacao: "-" },
  { id: 8, serial: "TJ-2024-071", produto: "TBlock Pro", cliente: "-", veiculo: "-", status: "Em estoque", dataInstalacao: "-" },
];

const statusColor: Record<string, string> = {
  "Instalado": "border-slate-200 text-slate-700",
  "Em Manutenção": "border-amber-200 text-amber-700",
  "Em estoque": "border-slate-200 text-slate-700",
  "Retirado": "border-rose-200 text-rose-700",
};

const statusBadgeBase = "rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-none";

export default function Equipamentos() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockEquipamentos.filter((e) => {
    const matchSearch = !search || e.serial.toLowerCase().includes(search.toLowerCase()) || e.produto.toLowerCase().includes(search.toLowerCase()) || e.cliente.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Equipamentos</h1>
        <Button className="gap-2 bg-success hover:bg-success/90 text-success-foreground"><Plus size={16} /> Incluir</Button>
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar serial, produto ou cliente..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Instalado">Instalado</SelectItem>
            <SelectItem value="Em estoque">Em estoque</SelectItem>
            <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
            <SelectItem value="Retirado">Retirado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader><TableRow className="bg-muted/50">
            <TableHead>Serial</TableHead><TableHead>Produto</TableHead><TableHead>Cliente</TableHead><TableHead>Veículo</TableHead><TableHead>Data Instalação</TableHead><TableHead>Status</TableHead><TableHead className="w-[60px]" />
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((e, i) => (
              <TableRow key={e.id} className={cn(i % 2 === 0 && "bg-muted/20")}>
                <TableCell className="font-mono font-medium">{e.serial}</TableCell>
                <TableCell>{e.produto}</TableCell>
                <TableCell>{e.cliente}</TableCell>
                <TableCell className="font-mono">{e.veiculo}</TableCell>
                <TableCell>{e.dataInstalacao}</TableCell>
                <TableCell><Badge variant="outline" className={cn(statusBadgeBase, statusColor[e.status])}>{e.status}</Badge></TableCell>
                <TableCell><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Edit size={14} className="text-primary" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
