import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import VehicleSelectDialog from "./VehicleSelectDialog";
import {
  serviceOrderStatusOptions,
  type ServiceOrderFormPayload,
  type ServiceOrderStatus,
} from "@/data/service-orders";
import { useSAPClients, useSAPVendors } from "@/hooks/useSAPBusinessPartners";
import { isSAPConfigured } from "@/integrations/sap/client";

const tipoOptions = [
  { value: "INSTALACAO", label: "Instalação" },
  { value: "RETIRADA", label: "Retirada" },
  { value: "MANUTENCAO", label: "Manutenção" },
  { value: "REINSTALACAO", label: "Reinstalação" },
  { value: "SOCORRO_TECNICO", label: "Socorro Técnico" },
  { value: "TRANSFERENCIA", label: "Transferência" },
];

const editableStatusValues = new Set<ServiceOrderStatus>([
  "Em agendamento",
  "Agendada",
  "Em reagendamento",
  "Aguardando agendamento",
  "Em atendimento",
  "Em execução",
  "Finalizada",
  "Validada",
  "Cancelada",
]);

const statusOptions = serviceOrderStatusOptions.filter((option) => editableStatusValues.has(option.value));

const staticClienteOptions = [
  "Volare Segurança",
  "Tracker Brasil",
  "LogSafe",
  "TransGuarda",
  "FleetShield",
];

const staticTecnicoOptions = [
  "Carlos Silva",
  "João Santos",
  "Pedro Lima",
  "Ana Costa",
];

type FormData = ServiceOrderFormPayload;

interface Props {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
}

export default function ServiceOrderFormData({ formData, onChange }: Props) {
  const sapEnabled = isSAPConfigured();
  const { data: sapClients, isLoading: loadingClients } = useSAPClients();
  const { data: sapVendors, isLoading: loadingVendors } = useSAPVendors();

  const [clienteFilter, setClienteFilter] = useState("");
  const [tecnicoFilter, setTecnicoFilter] = useState("");

  const clienteOptions = sapEnabled && sapClients
    ? sapClients
        .filter((c) => c.CardName.toLowerCase().includes(clienteFilter.toLowerCase()))
        .map((c) => ({ value: c.CardCode, label: c.CardName }))
    : staticClienteOptions.map((n) => ({ value: n, label: n }));

  const tecnicoOptions = sapEnabled && sapVendors
    ? sapVendors
        .filter((v) => v.CardName.toLowerCase().includes(tecnicoFilter.toLowerCase()))
        .map((v) => ({ value: v.CardCode, label: v.CardName }))
    : staticTecnicoOptions.map((n) => ({ value: n, label: n }));

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Dados</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">*Tipo</Label>
          <Select value={formData.tipo} onValueChange={(v) => onChange({ tipo: v })}>
            <SelectTrigger><SelectValue placeholder="Nada selecionado" /></SelectTrigger>
            <SelectContent>
              {tipoOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Data Abertura</Label>
          <Input type="date" value={formData.dataAbertura} onChange={(e) => onChange({ dataAbertura: e.target.value })} />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">*Cliente</Label>
          <Select value={formData.cliente} onValueChange={(v) => onChange({ cliente: v })}>
            <SelectTrigger>
              {loadingClients ? (
                <span className="flex items-center gap-1 text-muted-foreground"><Loader2 size={12} className="animate-spin" />Carregando...</span>
              ) : (
                <SelectValue placeholder="Nada selecionado" />
              )}
            </SelectTrigger>
            <SelectContent>
              {sapEnabled && (
                <div className="px-2 py-1">
                  <Input
                    placeholder="Buscar cliente..."
                    value={clienteFilter}
                    onChange={(e) => setClienteFilter(e.target.value)}
                    className="h-7 text-sm"
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              {clienteOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">*Empresa Faturamento</Label>
          <Select value={formData.empresaFaturamento} onValueChange={(v) => onChange({ empresaFaturamento: v })}>
            <SelectTrigger><SelectValue placeholder="Nada selecionado" /></SelectTrigger>
            <SelectContent>
              {clienteOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">Técnico</Label>
          <Select value={formData.tecnico} onValueChange={(v) => onChange({ tecnico: v })}>
            <SelectTrigger>
              {loadingVendors ? (
                <span className="flex items-center gap-1 text-muted-foreground"><Loader2 size={12} className="animate-spin" />Carregando...</span>
              ) : (
                <SelectValue placeholder="Nada selecionado" />
              )}
            </SelectTrigger>
            <SelectContent>
              {sapEnabled && (
                <div className="px-2 py-1">
                  <Input
                    placeholder="Buscar técnico..."
                    value={tecnicoFilter}
                    onChange={(e) => setTecnicoFilter(e.target.value)}
                    className="h-7 text-sm"
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              {tecnicoOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Veículo</Label>
          <div className="flex gap-1">
            <Input
              placeholder="Placa do veículo"
              value={formData.veiculo}
              onChange={(e) => onChange({ veiculo: e.target.value.toUpperCase() })}
              className="flex-1"
            />
            <VehicleSelectDialog
              value={formData.veiculo}
              onSelect={(vehicle) => onChange({ veiculo: vehicle.placa })}
            />
            <Button variant="outline" size="icon" className="shrink-0" onClick={() => onChange({ veiculo: "" })}><X size={14} /></Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">Data realização</Label>
          <Input type="date" value={formData.dataRealizacao} onChange={(e) => onChange({ dataRealizacao: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">*Status</Label>
          <Select value={formData.status} onValueChange={(v) => onChange({ status: v as FormData["status"] })}>
            <SelectTrigger><SelectValue placeholder="Nada selecionado" /></SelectTrigger>
            <SelectContent>
              {statusOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Defeito relatado</Label>
          <Textarea value={formData.defeitoRelatado} onChange={(e) => onChange({ defeitoRelatado: e.target.value })} rows={3} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Defeito constatado</Label>
          <Textarea value={formData.defeitoConstatado} onChange={(e) => onChange({ defeitoConstatado: e.target.value })} rows={3} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Observação</Label>
        <Textarea value={formData.observacao} onChange={(e) => onChange({ observacao: e.target.value })} rows={3} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Responsável</Label>
          <Input value={formData.responsavel} onChange={(e) => onChange({ responsavel: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Cargo</Label>
          <Input value={formData.cargo} onChange={(e) => onChange({ cargo: e.target.value })} />
        </div>
      </div>

      {/* Local da realização */}
      <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
        <h4 className="text-sm font-semibold text-foreground">» Local da realização</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm">UF</Label>
            <Input value={formData.uf} onChange={(e) => onChange({ uf: e.target.value })} className="max-w-[120px]" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Cidade</Label>
            <Input value={formData.cidade} onChange={(e) => onChange({ cidade: e.target.value })} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Endereço</Label>
          <Input value={formData.endereco} onChange={(e) => onChange({ endereco: e.target.value })} />
        </div>
      </div>
    </div>
  );
}
