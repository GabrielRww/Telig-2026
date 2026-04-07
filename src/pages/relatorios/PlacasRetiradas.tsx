import { AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const mockPlacas = [
  { placa: "RST1234", modelo: "Fiat Strada", cliente: "Volare Segurança", ultimoSinal: "01/04/2026", diasSemSinal: 6, equipamento: "TJ-2022-155", risco: "Alto" },
  { placa: "UVW5678", modelo: "VW Saveiro", cliente: "Tracker Brasil", ultimoSinal: "02/04/2026", diasSemSinal: 5, equipamento: "TJ-2023-044", risco: "Alto" },
  { placa: "XYZ9012", modelo: "Toyota Corolla", cliente: "LogSafe", ultimoSinal: "03/04/2026", diasSemSinal: 4, equipamento: "TJ-2023-078", risco: "Médio" },
  { placa: "ABC3456", modelo: "Chevrolet Onix", cliente: "TransGuarda", ultimoSinal: "03/04/2026", diasSemSinal: 4, equipamento: "TJ-2024-002", risco: "Médio" },
  { placa: "DEF7890", modelo: "Ford Ka", cliente: "Volare Segurança", ultimoSinal: "04/04/2026", diasSemSinal: 3, equipamento: "TJ-2022-190", risco: "Baixo" },
];

const riscoColor: Record<string, string> = {
  "Alto": "bg-red-100 text-red-800",
  "Médio": "bg-yellow-100 text-yellow-800",
  "Baixo": "bg-blue-100 text-blue-800",
};

export default function PlacasRetiradas() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Placas com Possível Retirada</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Download size={14} /> PDF</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download size={14} /> Excel</Button>
        </div>
      </div>

      <Card className="border shadow-sm border-warning/30 bg-warning/5">
        <CardContent className="p-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-warning flex-shrink-0" />
          <p className="text-sm text-foreground">
            <strong>{mockPlacas.length} veículos</strong> detectados com possível retirada não registrada. Equipamentos sem sinal há mais de 3 dias.
          </p>
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader><TableRow className="bg-muted/50">
            <TableHead>Placa</TableHead><TableHead>Modelo</TableHead><TableHead>Cliente</TableHead><TableHead>Equipamento</TableHead><TableHead>Último Sinal</TableHead><TableHead className="text-center">Dias sem Sinal</TableHead><TableHead>Risco</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {mockPlacas.map((p, i) => (
              <TableRow key={p.placa} className={cn(i % 2 === 0 && "bg-muted/20")}>
                <TableCell className="font-mono font-medium">{p.placa}</TableCell>
                <TableCell>{p.modelo}</TableCell>
                <TableCell>{p.cliente}</TableCell>
                <TableCell className="font-mono text-sm">{p.equipamento}</TableCell>
                <TableCell>{p.ultimoSinal}</TableCell>
                <TableCell className="text-center font-bold">{p.diasSemSinal}</TableCell>
                <TableCell><Badge variant="secondary" className={cn("text-xs", riscoColor[p.risco])}>{p.risco}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
