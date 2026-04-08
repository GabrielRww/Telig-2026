import { useState } from "react";
import { Search, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const mockPedidos = [
  { id: "PED-2024-3421", cliente: "Volare Segurança", data: "04/04/2026", itens: 3, total: "R$ 1.350,00", status: "Aberto" },
  { id: "PED-2024-3420", cliente: "Tracker Brasil", data: "04/04/2026", itens: 1, total: "R$ 200,00", status: "Em separação" },
  { id: "PED-2024-3419", cliente: "LogSafe", data: "03/04/2026", itens: 2, total: "R$ 640,00", status: "Faturado" },
  { id: "PED-2024-3418", cliente: "TransGuarda", data: "03/04/2026", itens: 1, total: "R$ 580,00", status: "Entregue" },
  { id: "PED-2024-3417", cliente: "FleetShield", data: "02/04/2026", itens: 4, total: "R$ 1.800,00", status: "Cancelado" },
];

const statusColor: Record<string, string> = {
  "Aberto": "border-slate-200 text-slate-700",
  "Em separação": "border-amber-200 text-amber-700",
  "Faturado": "border-slate-200 text-slate-700",
  "Entregue": "border-emerald-200 text-emerald-700",
  "Cancelado": "border-rose-200 text-rose-700",
};

const statusBadgeBase = "rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-none";

export default function Pedidos() {
  const [search, setSearch] = useState("");

  const filtered = mockPedidos.filter((p) =>
    !search || p.id.toLowerCase().includes(search.toLowerCase()) || p.cliente.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Pedidos</h1>
        <Button className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
          <Plus size={16} /> Novo Pedido
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar pedido ou cliente..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-center">Itens</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p, i) => (
              <TableRow key={p.id} className={cn("cursor-pointer hover:bg-muted/50", i % 2 === 0 && "bg-muted/20")}>
                <TableCell className="font-mono font-medium">{p.id}</TableCell>
                <TableCell>{p.cliente}</TableCell>
                <TableCell>{p.data}</TableCell>
                <TableCell className="text-center">{p.itens}</TableCell>
                <TableCell className="text-right font-medium">{p.total}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(statusBadgeBase, statusColor[p.status])}>{p.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}