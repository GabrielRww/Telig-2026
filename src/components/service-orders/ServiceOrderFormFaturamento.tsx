import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { calculateCustomerValue, serviceOrderBillingMarkupRate, type ServiceOrderFormPayload } from "@/data/service-orders";

type FormData = ServiceOrderFormPayload;

interface Props {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
}

export default function ServiceOrderFormFaturamento({ formData, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-foreground">Faturamento</h3>
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
            Serviços: +{Math.round(serviceOrderBillingMarkupRate * 100)}% markup
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm">Valor técnico</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={formData.valorTecnico}
            onChange={(event) => {
              const valorTecnico = event.target.value;
              onChange({ valorTecnico, valorCliente: calculateCustomerValue(valorTecnico) });
            }}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">Valor cliente</Label>
          <Input value={formData.valorCliente || "R$ 0,00"} readOnly className="bg-muted/40" />
        </div>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
        <p className="text-sm font-medium text-foreground">Regra de faturamento</p>
        <p className="text-sm text-muted-foreground">
          O valor do cliente é calculado automaticamente com {Math.round(serviceOrderBillingMarkupRate * 100)}% sobre o valor técnico.
        </p>
        <p className="text-xs text-muted-foreground">
          Exemplo: um serviço de R$ 100,00 para o técnico gera R$ 138,00 para o cliente.
        </p>
      </div>
    </div>
  );
}
