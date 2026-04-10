import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { normalizeVehicleSearch, useRegisteredVehicles, type VehicleRecord } from "@/data/veiculos";

interface Props {
  value: string;
  onSelect: (vehicle: VehicleRecord) => void;
}

const pageSize = 4;

export default function VehicleSelectDialog({ value, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const [page, setPage] = useState(1);
  const vehicles = useRegisteredVehicles();

  useEffect(() => {
    if (open) {
      setSearch(value);
      setPage(1);
    }
  }, [open, value]);

  const filteredVehicles = useMemo(() => {
    const normalizedSearch = normalizeVehicleSearch(search);

    if (!normalizedSearch) {
      return vehicles;
    }

    return vehicles.filter((vehicle) => {
      const searchableFields = [vehicle.id.toString(), vehicle.placa, vehicle.modelo, vehicle.empresa];
      return searchableFields.some((field) => normalizeVehicleSearch(field).includes(normalizedSearch));
    });
  }, [search, vehicles]);

  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleVehicles = filteredVehicles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearchChange = (nextValue: string) => {
    setSearch(nextValue);
    setPage(1);
  };

  const handleSelect = (vehicle: VehicleRecord) => {
    onSelect(vehicle);
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
        aria-label="Pesquisar veículo"
      >
        <Search size={14} />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl overflow-hidden p-0">
          <div className="border-b px-6 pb-4 pt-6">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-xl">Selecione o veículo</DialogTitle>
              <DialogDescription>
                Pesquise pela placa, modelo, empresa ou ID e selecione um veículo cadastrado.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 pt-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Veículos</h3>
                <p className="text-sm text-muted-foreground">
                  {filteredVehicles.length} de {vehicles.length} veículos encontrados
                </p>
              </div>

              <div className="relative w-full sm:max-w-sm">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filtro"
                  value={search}
                  onChange={(event) => handleSearchChange(event.target.value)}
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
                      <TableHead>PLACA</TableHead>
                      <TableHead>EMPRESA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleVehicles.map((vehicle, index) => (
                      <TableRow
                        key={vehicle.id}
                        role="button"
                        tabIndex={0}
                        className={cn(
                          "cursor-pointer transition-colors hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none",
                          index % 2 === 0 && "bg-muted/20",
                        )}
                        onClick={() => handleSelect(vehicle)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleSelect(vehicle);
                          }
                        }}
                      >
                        <TableCell className="font-mono text-sm font-medium">{vehicle.id}</TableCell>
                        <TableCell className="font-mono text-sm">{vehicle.placa}</TableCell>
                        <TableCell className="text-sm">{vehicle.empresa}</TableCell>
                      </TableRow>
                    ))}

                    {visibleVehicles.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                          Nenhum veículo encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t px-6 py-4 text-sm text-muted-foreground">
            <span>
              Exibindo {filteredVehicles.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredVehicles.length)} de {filteredVehicles.length}
            </span>

            <div className="flex items-center gap-1">
              <Button type="button" variant="outline" size="sm" onClick={() => setPage(1)} disabled={currentPage === 1}>
                &lt;&lt;
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </Button>
              <span className="min-w-20 text-center font-medium text-foreground">
                {currentPage} / {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={currentPage === totalPages}
              >
                &gt;
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages}>
                &gt;&gt;
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}