import { useState } from "react";
import { Search, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { normalizeCompanySearch, registeredCompanies } from "@/data/empresas";

const statusBadgeBase = "rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-none";

export default function Empresas() {
  const [search, setSearch] = useState("");
  const normalizedSearch = normalizeCompanySearch(search);

  const filtered = registeredCompanies.filter((company) => {
    if (!normalizedSearch) {
      return true;
    }

    return [company.nome, company.cnpj, company.cidade, company.contato, company.email, company.status].some((field) =>
      normalizeCompanySearch(field).includes(normalizedSearch),
    );
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Empresas</h1>
          <p className="text-sm text-muted-foreground">
            {registeredCompanies.length} empresas cadastradas e disponíveis para vínculo.
          </p>
        </div>
        <Button className="gap-2 bg-success hover:bg-success/90 text-success-foreground"><Plus size={16} /> Incluir</Button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar empresa, CNPJ, cidade ou contato..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((company, index) => (
              <TableRow key={company.id} className={cn(index % 2 === 0 && "bg-muted/20")}>
                <TableCell className="font-medium">{company.nome}</TableCell>
                <TableCell className="font-mono text-sm">{company.cnpj}</TableCell>
                <TableCell>{company.cidade}</TableCell>
                <TableCell>{company.contato}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(statusBadgeBase, company.status === "Ativa" ? "border-emerald-200 text-emerald-700" : "border-rose-200 text-rose-700")}
                  >
                    {company.status}
                  </Badge>
                </TableCell>
                <TableCell><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Edit size={14} className="text-primary" /></Button></TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  Nenhuma empresa encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
