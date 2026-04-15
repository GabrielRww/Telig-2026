import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ServiceOrderEquipment } from "@/data/service-orders";

const produtoOptions = [
  "TJammer 4G",
  "TBlock Pro",
  "TBlock",
  "Rastreador 4G",
  "Bloqueador Standard",
  "Antena GPS",
];

const acaoOptions = [
  "Instalação",
  "Retirada",
  "Manutenção",
  "Reinstalação",
  "Transferência",
  "Substituição",
];

interface Props {
  equipamentos: ServiceOrderEquipment[];
  onChange: (equipamentos: ServiceOrderEquipment[]) => void;
}

function createEmpty(): ServiceOrderEquipment {
  return { serial: "", produto: "", acao: "" };
}

export default function ServiceOrderFormEquipamentos({ equipamentos, onChange }: Props) {
  const [newItem, setNewItem] = useState<ServiceOrderEquipment>(createEmpty());
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!newItem.serial.trim()) {
      setError("Informe o número de série.");
      return;
    }
    if (!newItem.produto) {
      setError("Selecione o produto.");
      return;
    }
    if (!newItem.acao) {
      setError("Selecione a ação.");
      return;
    }
    const alreadyExists = equipamentos.some(
      (e) => e.serial.trim().toUpperCase() === newItem.serial.trim().toUpperCase()
    );
    if (alreadyExists) {
      setError("Já existe um equipamento com esse número de série nesta OS.");
      return;
    }
    setError("");
    onChange([
      ...equipamentos,
      { serial: newItem.serial.trim().toUpperCase(), produto: newItem.produto, acao: newItem.acao },
    ]);
    setNewItem(createEmpty());
  };

  const handleRemove = (index: number) => {
    onChange(equipamentos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Equipamentos</h3>

      {/* Formulário de adição */}
      <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
        <p className="text-sm font-medium text-foreground">Adicionar equipamento</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Nº Série *</Label>
            <Input
              placeholder="Ex: TJ-2024-001"
              value={newItem.serial}
              onChange={(e) => {
                setError("");
                setNewItem((prev) => ({ ...prev, serial: e.target.value }));
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Produto *</Label>
            <Select
              value={newItem.produto}
              onValueChange={(v) => {
                setError("");
                setNewItem((prev) => ({ ...prev, produto: v }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {produtoOptions.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Ação *</Label>
            <Select
              value={newItem.acao}
              onValueChange={(v) => {
                setError("");
                setNewItem((prev) => ({ ...prev, acao: v }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {acaoOptions.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button
          type="button"
          size="sm"
          onClick={handleAdd}
          className="gap-1.5 bg-success hover:bg-success/90 text-success-foreground"
        >
          <Plus size={14} /> Adicionar
        </Button>
      </div>

      {/* Tabela de equipamentos */}
      {equipamentos.length > 0 ? (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Nº Série</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipamentos.map((equip, index) => (
                <TableRow key={`${equip.serial}-${index}`} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                  <TableCell className="font-mono text-sm font-medium">{equip.serial}</TableCell>
                  <TableCell className="text-sm">{equip.produto}</TableCell>
                  <TableCell className="text-sm">{equip.acao}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(index)}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhum equipamento adicionado a esta OS.
        </p>
      )}
    </div>
  );
}
