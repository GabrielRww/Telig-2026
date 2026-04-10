import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ServiceOrderFormEquipamentos() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Equipamentos</h3>
        <p className="text-sm text-muted-foreground">Selecione os equipamentos</p>
        <Input placeholder="Nenhum equipamento encontrado" readOnly className="bg-muted/30" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Equipamentos Retirada</h3>
        <p className="text-sm text-muted-foreground">Selecione os equipamentos</p>
        <Input placeholder="Nenhum equipamento encontrado" readOnly className="bg-muted/30" />
      </div>
    </div>
  );
}
