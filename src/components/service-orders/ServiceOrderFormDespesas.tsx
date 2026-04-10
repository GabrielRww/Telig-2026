import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Despesa {
  id: number;
  descricao: string;
  valor: string;
}

export default function ServiceOrderFormDespesas() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);

  const addDespesa = () => {
    setDespesas((prev) => [...prev, { id: Date.now(), descricao: "", valor: "" }]);
  };

  const removeDespesa = (id: number) => {
    setDespesas((prev) => prev.filter((d) => d.id !== id));
  };

  const updateDespesa = (id: number, field: keyof Despesa, value: string) => {
    setDespesas((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const total = despesas.reduce((sum, d) => sum + (parseFloat(d.valor) || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Despesas</h3>
        <Button onClick={addDespesa} size="sm" className="gap-1 bg-success hover:bg-success/90 text-success-foreground">
          <Plus size={14} /> Adicionar Despesa
        </Button>
      </div>

      {despesas.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[150px]">Valor (R$)</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {despesas.map((d) => (
              <TableRow key={d.id}>
                <TableCell>
                  <Input value={d.descricao} onChange={(e) => updateDespesa(d.id, "descricao", e.target.value)} placeholder="Descrição da despesa" />
                </TableCell>
                <TableCell>
                  <Input type="number" step="0.01" value={d.valor} onChange={(e) => updateDespesa(d.id, "valor", e.target.value)} placeholder="0,00" />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => removeDespesa(d.id)} className="h-7 w-7 p-0 text-destructive">
                    <Trash2 size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma despesa adicionada</p>
      )}

      {despesas.length > 0 && (
        <div className="text-right text-sm font-medium text-foreground">
          Total: R$ {total.toFixed(2).replace(".", ",")}
        </div>
      )}
    </div>
  );
}
