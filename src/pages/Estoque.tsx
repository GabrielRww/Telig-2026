import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Package, Info } from "lucide-react";

const MOCK_ESTOQUE = [
  { empresa: "GolSat Rastreamento", produto: "Rastreador 4G", total: 145 },
  { empresa: "GolSat Rastreamento", produto: "TBlock", total: 67 },
  { empresa: "GolSat Rastreamento", produto: "TJammer", total: 23 },
  { empresa: "Tracker do Brasil", produto: "Rastreador 4G", total: 89 },
  { empresa: "Tracker do Brasil", produto: "TBlock", total: 34 },
  { empresa: "Volvo Segurança", produto: "Rastreador 4G", total: 56 },
  { empresa: "Volvo Segurança", produto: "TJammer", total: 12 },
  { empresa: "Scania Monitoramento", produto: "Rastreador 4G", total: 78 },
];

const Estoque = () => {
  return (
    <div>
      <Breadcrumb items={[{ label: "Estoque" }]} />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground">Estoque</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Exportar PDF</Button>
          <Button variant="outline" size="sm">Exportar Excel</Button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar empresa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="golsat">GolSat Rastreamento</SelectItem>
            <SelectItem value="tracker">Tracker do Brasil</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar produto..." className="pl-9" />
        </div>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full text-sm table-striped">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Empresa</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Produto</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Total</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ESTOQUE.map((item, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="p-3">{item.empresa}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    {item.produto}
                  </div>
                </td>
                <td className="p-3 text-right font-medium">{item.total}</td>
                <td className="p-3 text-center">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Estoque;
