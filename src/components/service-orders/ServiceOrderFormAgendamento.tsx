import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  serviceOrderSchedulingStatusOptions,
  type ServiceOrderFormPayload,
  type ServiceOrderSchedulingStatus,
} from "@/data/service-orders";

type FormData = ServiceOrderFormPayload;

interface Props {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
}

export default function ServiceOrderFormAgendamento({ formData, onChange }: Props) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Agendamento</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-sm">*Status</Label>
          <Select
            value={formData.agendamentoStatus}
            onValueChange={(value) => onChange({ agendamentoStatus: value as ServiceOrderSchedulingStatus | "" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Nada selecionado" />
            </SelectTrigger>
            <SelectContent>
              {serviceOrderSchedulingStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">Data</Label>
          <Input
            type="date"
            value={formData.agendamentoData}
            onChange={(event) => onChange({ agendamentoData: event.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">Hora</Label>
          <Input
            type="time"
            value={formData.agendamentoHora}
            onChange={(event) => onChange({ agendamentoHora: event.target.value })}
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-sm">Observação</Label>
          <Textarea
            value={formData.agendamentoObservacao}
            onChange={(event) => onChange({ agendamentoObservacao: event.target.value })}
            rows={4}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        Use esta aba para controlar a fila do setor de agendamento. Quando a OS ficar em
        <span className="font-medium text-foreground"> Aguardando agendamento</span>, ela volta para
        <span className="font-medium text-foreground"> Em agendamento</span> depois do horário definido,
        desde que não esteja finalizada.
      </div>
    </div>
  );
}
