import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatCurrencyBRL,
  parseCurrencyValue,
  type ServiceOrderExpense,
} from "@/data/service-orders";

interface Props {
  despesas: ServiceOrderExpense[];
  onChange: (despesas: ServiceOrderExpense[]) => void;
}

export default function ServiceOrderFormDespesas({ despesas, onChange }: Props) {
  const [newDescricao, setNewDescricao] = useState("");
  const [newValor, setNewValor] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!newDescricao.trim()) {
      setError("Informe a descrição da despesa.");
      return;
    }
    const parsedValor = parseCurrencyValue(newValor);
    if (!parsedValor || parsedValor <= 0) {
      setError("Informe um valor válido maior que zero.");
      return;
    }
    setError("");
    onChange([
      ...despesas,
      { descricao: newDescricao.trim(), valor: formatCurrencyBRL(parsedValor) },
    ]);
    setNewDescricao("");
    setNewValor("");
  };

  const handleRemove = (index: number) => {
    onChange(despesas.filter((_, i) => i !== index));
  };

  const total = despesas.reduce((sum, d) => sum + parseCurrencyValue(d.valor), 0);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Despesas</h3>

      {/* Formulário de adição */}
      <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
        <p className="text-sm font-medium text-foreground">Adicionar despesa</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Descrição *</Label>
            <Input
              placeholder="Ex: Deslocamento, Material extra…"
              value={newDescricao}
              onChange={(e) => {
                setError("");
                setNewDescricao(e.target.value);
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Valor (R$) *</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={newValor}
              onChange={(e) => {
                setError("");
                setNewValor(e.target.value);
              }}
            />
          </div>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button
          type="button"
          size="sm"
          onClick={handleAdd}
          className="gap-1.5 bg-success hover:bg-success/90 text-success-foreground"
        >
          <Plus size={14} /> Adicionar Despesa
        </Button>
      </div>

      {/* Tabela de despesas */}
      {despesas.length > 0 ? (
        <>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[150px] text-right">Valor</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {despesas.map((d, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                    <TableCell className="text-sm">{d.descricao}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{d.valor}</TableCell>
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
          <div className="text-right text-sm font-semibold text-foreground">
            Total: {formatCurrencyBRL(total)}
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhuma despesa adicionada a esta OS.
        </p>
      )}
    </div>
  );
}
