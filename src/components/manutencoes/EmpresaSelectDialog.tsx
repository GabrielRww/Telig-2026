import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { normalizeCompanySearch, registeredCompanies, type CompanyRecord } from "@/data/empresas";

interface Props {
  value: string;
  onSelect: (company: CompanyRecord) => void;
}

const statusBadgeClasses: Record<string, string> = {
  Ativa: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Inativa: "border-rose-200 bg-rose-50 text-rose-700",
};

export default function EmpresaSelectDialog({ value, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);

  useEffect(() => {
    if (open) {
      setSearch(value);
    }
  }, [open, value]);

  const filteredCompanies = useMemo(() => {
    const normalizedSearch = normalizeCompanySearch(search);

    if (!normalizedSearch) {
      return registeredCompanies;
    }

    return registeredCompanies.filter((company) => {
      const searchableFields = [
        company.id.toString(),
        company.nome,
        company.cnpj,
        company.cidade,
        company.contato,
        company.email,
        company.status,
      ];

      return searchableFields.some((field) => normalizeCompanySearch(field).includes(normalizedSearch));
    });
  }, [search]);

  const handleSelect = (company: CompanyRecord) => {
    onSelect(company);
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0"
        onClick={() => setOpen(true)}
        aria-label="Pesquisar empresa"
      >
        <Search size={14} />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl overflow-hidden p-0">
          <div className="border-b px-6 pb-4 pt-6">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-xl">Selecione a empresa</DialogTitle>
              <DialogDescription>
                Pesquise por nome, CNPJ, cidade, contato ou e-mail e selecione a empresa cadastrada.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 pt-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Empresas</h3>
                <p className="text-sm text-muted-foreground">
                  {filteredCompanies.length} de {registeredCompanies.length} empresas encontradas
                </p>
              </div>

              <div className="relative w-full sm:max-w-sm">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filtro"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="px-6 pb-4 pt-4">
            <div className="overflow-hidden rounded-lg border shadow-sm">
              <ScrollArea className="h-[52vh]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>ID</TableHead>
                      <TableHead>EMPRESA</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>CIDADE</TableHead>
                      <TableHead>STATUS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company, index) => (
                      <TableRow
                        key={company.id}
                        role="button"
                        tabIndex={0}
                        className={cn(
                          "cursor-pointer transition-colors hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none",
                          index % 2 === 0 && "bg-muted/20",
                        )}
                        onClick={() => handleSelect(company)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleSelect(company);
                          }
                        }}
                      >
                        <TableCell className="font-mono text-sm font-medium">{company.id}</TableCell>
                        <TableCell className="text-sm font-medium">{company.nome}</TableCell>
                        <TableCell className="font-mono text-sm">{company.cnpj}</TableCell>
                        <TableCell className="text-sm">{company.cidade}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[11px] font-medium shadow-none",
                              statusBadgeClasses[company.status] ?? "border-border bg-muted text-muted-foreground",
                            )}
                          >
                            {company.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredCompanies.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                          Nenhuma empresa encontrada.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
