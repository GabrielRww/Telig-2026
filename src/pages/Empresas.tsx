import { useState } from "react";
import { Search, Plus, Edit, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const mockEmpresas = [
  { id: 1, nome: "Volare Segurança", cnpj: "12.345.678/0001-90", cidade: "Passo Fundo/RS", contato: "(54) 3311-1234", email: "contato@volare.com.br", status: "Ativa" },
  { id: 2, nome: "Tracker Brasil", cnpj: "23.456.789/0001-01", cidade: "Porto Alegre/RS", contato: "(51) 3222-5678", email: "contato@tracker.com.br", status: "Ativa" },
  { id: 3, nome: "LogSafe", cnpj: "34.567.890/0001-12", cidade: "Caxias do Sul/RS", contato: "(54) 3221-9012", email: "contato@logsafe.com.br", status: "Ativa" },
  { id: 4, nome: "TransGuarda", cnpj: "45.678.901/0001-23", cidade: "Passo Fundo/RS", contato: "(54) 3311-3456", email: "contato@transguarda.com.br", status: "Inativa" },
  { id: 5, nome: "FleetShield", cnpj: "56.789.012/0001-34", cidade: "Erechim/RS", contato: "(54) 3321-7890", email: "contato@fleetshield.com.br", status: "Ativa" },
];

const statusBadgeBase = "rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-none";

export default function Empresas() {
  const [search, setSearch] = useState("");
  const filtered = mockEmpresas.filter((e) => !search || e.nome.toLowerCase().includes(search.toLowerCase()) || e.cnpj.includes(search));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Empresas</h1>
        <Button className="gap-2 bg-success hover:bg-success/90 text-success-foreground"><Plus size={16} /> Incluir</Button>
      </div>
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar empresa ou CNPJ..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader><TableRow className="bg-muted/50">
            <TableHead>Nome</TableHead><TableHead>CNPJ</TableHead><TableHead>Cidade</TableHead><TableHead>Contato</TableHead><TableHead>Status</TableHead><TableHead className="w-[60px]" />
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((e, i) => (
              <TableRow key={e.id} className={cn(i % 2 === 0 && "bg-muted/20")}>
                <TableCell className="font-medium">{e.nome}</TableCell>
                <TableCell className="font-mono text-sm">{e.cnpj}</TableCell>
                <TableCell>{e.cidade}</TableCell>
                <TableCell>{e.contato}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(statusBadgeBase, e.status === "Ativa" ? "border-emerald-200 text-emerald-700" : "border-rose-200 text-rose-700")}
                  >
                    {e.status}
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
