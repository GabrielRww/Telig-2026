import { useMemo, useState } from "react";
import { Search, Plus, Edit, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import EmpresaSelectDialog from "@/components/manutencoes/EmpresaSelectDialog";
import {
  createVehicleId,
  normalizeVehicleSearch,
  upsertVehicle,
  vehicleStatusOptions,
  vehicleTypeOptions,
  useRegisteredVehicles,
  type VehicleRecord,
} from "@/data/veiculos";

interface VehicleFormData {
  tipo: string;
  placa: string;
  modelo: string;
  ano: string;
  cor: string;
  chassi: string;
  empresa: string;
  statusEquip: string;
  observacao: string;
}

const statusBadgeClasses: Record<string, string> = {
  Ativo: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Em manutenção": "border-amber-200 bg-amber-50 text-amber-700",
  Reserva: "border-blue-200 bg-blue-50 text-blue-700",
  Inativo: "border-rose-200 bg-rose-50 text-rose-700",
};

const typeBadgeClasses = "rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium shadow-none";

function createEmptyForm(): VehicleFormData {
  return {
    tipo: vehicleTypeOptions[1]?.value ?? "Caminhonete",
    placa: "",
    modelo: "",
    ano: "",
    cor: "",
    chassi: "",
    empresa: "",
    statusEquip: vehicleStatusOptions[0]?.value ?? "Ativo",
    observacao: "",
  };
}

export default function Veiculos() {
  const [search, setSearch] = useState("");
  const vehicles = useRegisteredVehicles();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null);
  const [formData, setFormData] = useState<VehicleFormData>(createEmptyForm());

  const normalizedSearch = normalizeVehicleSearch(search);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      if (!normalizedSearch) {
        return true;
      }

      return [
        vehicle.tipo,
        vehicle.placa,
        vehicle.modelo,
        vehicle.empresa,
        vehicle.chassi,
        vehicle.statusEquip,
        vehicle.observacao,
      ].some((field) => normalizeVehicleSearch(field).includes(normalizedSearch));
    });
  }, [normalizedSearch, vehicles]);

  const openCreateSheet = () => {
    setEditingVehicleId(null);
    setFormData(createEmptyForm());
    setSheetOpen(true);
  };

  const openEditSheet = (vehicle: VehicleRecord) => {
    setEditingVehicleId(vehicle.id);
    setFormData({
      tipo: vehicle.tipo,
      placa: vehicle.placa,
      modelo: vehicle.modelo,
      ano: vehicle.ano.toString(),
      cor: vehicle.cor,
      chassi: vehicle.chassi,
      empresa: vehicle.empresa,
      statusEquip: vehicle.statusEquip,
      observacao: vehicle.observacao,
    });
    setSheetOpen(true);
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setEditingVehicleId(null);
    setFormData(createEmptyForm());
  };

  const handleSave = () => {
    const requiredFields = [
      formData.tipo,
      formData.placa,
      formData.modelo,
      formData.ano,
      formData.chassi,
      formData.empresa,
      formData.statusEquip,
    ];

    if (requiredFields.some((field) => !field.trim())) {
      toast.error("Preencha os campos obrigatórios: Tipo, Placa, Modelo, Ano, Chassi, Empresa e Status");
      return;
    }

    const existingVehicle = editingVehicleId !== null
      ? vehicles.find((vehicle) => vehicle.id === editingVehicleId)
      : undefined;

    const nextVehicle: VehicleRecord = {
      id: editingVehicleId ?? createVehicleId(),
      tipo: formData.tipo,
      placa: formData.placa.replace(/\s+/g, "").toUpperCase(),
      modelo: formData.modelo.trim(),
      ano: Number(formData.ano),
      cor: formData.cor.trim(),
      chassi: formData.chassi.replace(/\s+/g, "").toUpperCase(),
      empresa: formData.empresa.trim(),
      cliente: formData.empresa.trim(),
      statusEquip: formData.statusEquip,
      observacao: formData.observacao.trim(),
      equipamentos: existingVehicle?.equipamentos ?? [],
    };

    upsertVehicle(nextVehicle);

    toast.success(editingVehicleId === null ? "Veículo cadastrado com sucesso!" : "Veículo atualizado com sucesso!");
    closeSheet();
  };

  return (
    <>
      <div className="space-y-4 animate-fade-in">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Veículos</h1>
            <p className="text-sm text-muted-foreground">
              {vehicles.length} veículos cadastrados. Busque por placa, tipo, modelo, empresa, status ou chassi.
            </p>
          </div>
          <Button className="gap-2 bg-success text-success-foreground hover:bg-success/90" onClick={openCreateSheet}>
            <Plus size={16} /> Incluir
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar placa, tipo, modelo, empresa, status ou chassi..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>

        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Placa</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Chassi</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle, index) => (
                  <TableRow key={vehicle.id} className={cn(index % 2 === 0 && "bg-muted/20")}>
                    <TableCell className="font-mono font-medium">{vehicle.placa}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={typeBadgeClasses}>
                        {vehicle.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>{vehicle.modelo}</TableCell>
                    <TableCell>{vehicle.ano}</TableCell>
                    <TableCell>{vehicle.cor}</TableCell>
                    <TableCell>{vehicle.empresa}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[11px] font-medium shadow-none",
                          statusBadgeClasses[vehicle.statusEquip] ?? "border-border bg-muted text-muted-foreground",
                        )}
                      >
                        {vehicle.statusEquip}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{vehicle.chassi}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => openEditSheet(vehicle)}
                        aria-label={`Editar veículo ${vehicle.placa}`}
                      >
                        <Edit size={14} className="text-primary" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredVehicles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                      Nenhum veículo encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Sheet
        open={sheetOpen}
        onOpenChange={(nextOpen) => {
          setSheetOpen(nextOpen);
          if (!nextOpen) {
            setEditingVehicleId(null);
            setFormData(createEmptyForm());
          }
        }}
      >
        <SheetContent side="right" className="w-full p-0 sm:max-w-2xl flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-2 border-b">
            <SheetTitle className="text-xl">
              {editingVehicleId === null ? "Novo veículo" : "Editar veículo"}
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6 pb-4">
            <div className="py-4 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Cadastro do veículo</h3>
                <p className="text-sm text-muted-foreground">
                  Preencha os dados e vincule a empresa já cadastrada no sistema.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm">*Tipo</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData((current) => ({ ...current, tipo: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm">*Placa</Label>
                  <Input
                    placeholder="ABC1234"
                    value={formData.placa}
                    onChange={(event) => setFormData((current) => ({ ...current, placa: event.target.value.toUpperCase() }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm">*Modelo</Label>
                  <Input
                    placeholder="Strada, Gol, Hilux..."
                    value={formData.modelo}
                    onChange={(event) => setFormData((current) => ({ ...current, modelo: event.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm">*Ano</Label>
                  <Input
                    type="number"
                    placeholder="2026"
                    value={formData.ano}
                    onChange={(event) => setFormData((current) => ({ ...current, ano: event.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm">Cor</Label>
                  <Input
                    placeholder="Branca"
                    value={formData.cor}
                    onChange={(event) => setFormData((current) => ({ ...current, cor: event.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm">*Status</Label>
                  <Select value={formData.statusEquip} onValueChange={(value) => setFormData((current) => ({ ...current, statusEquip: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-sm">*Empresa</Label>
                  <div className="flex gap-1">
                    <Input
                      placeholder="Selecione uma empresa cadastrada"
                      value={formData.empresa}
                      readOnly
                      className="flex-1 bg-muted/30"
                    />
                    <EmpresaSelectDialog
                      value={formData.empresa}
                      onSelect={(company) => setFormData((current) => ({ ...current, empresa: company.nome }))}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => setFormData((current) => ({ ...current, empresa: "" }))}
                      aria-label="Limpar empresa"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-sm">*Chassi</Label>
                  <Input
                    placeholder="9BFAB12E3X1234567"
                    value={formData.chassi}
                    onChange={(event) => setFormData((current) => ({ ...current, chassi: event.target.value.toUpperCase() }))}
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-sm">Observação</Label>
                  <Textarea
                    rows={4}
                    placeholder="Informações complementares do veículo"
                    value={formData.observacao}
                    onChange={(event) => setFormData((current) => ({ ...current, observacao: event.target.value }))}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="border-t px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={closeSheet}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">Salvar</Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
