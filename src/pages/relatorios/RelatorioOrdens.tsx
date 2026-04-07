import { useState } from "react";
import { Download, Filter, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const mockRelatorio = [
  { id: 188432, tipo: "Instalação", tecnico: "Carlos Silva", cliente: "Volare Segurança", abertura: "04/04/2026", realizacao: "05/04/2026", total: "R$ 450,00", status: "Validada" },
  { id: 188431, tipo: "Retirada", tecnico: "João Santos", cliente: "Tracker Brasil", abertura: "04/04/2026", realizacao: "-", total: "R$ 200,00", status: "Agendada" },
  { id: 188430, tipo: "Manutenção", tecnico: "Pedro Lima", cliente: "LogSafe", abertura: "03/04/2026", realizacao: "04/04/2026", total: "R$ 320,00", status: "Finalizada" },
  { id: 188429, tipo: "Reinstalação", tecnico: "Ana Costa", cliente: "TransGuarda", abertura: "03/04/2026", realizacao: "04/04/2026", total: "R$ 580,00", status: "Faturada" },
];

export default function RelatorioOrdens() {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Relatório de Ordens de Serviço</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Download size={14} /> PDF</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download size={14} /> Excel</Button>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Filter size={16} className="text-primary" /> Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap items-end">
            <div className="space-y-1">
              <Label className="text-xs">Data Início</Label>
              <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="w-[160px]" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Data Fim</Label>
              <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="w-[160px]" />
            </div>
            <Select><SelectTrigger className="w-[160px]"><SelectValue placeholder="Tipo OS" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="inst">Instalação</SelectItem><SelectItem value="ret">Retirada</SelectItem><SelectItem value="man">Manutenção</SelectItem></SelectContent>
            </Select>
            <Select><SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="fin">Finalizada</SelectItem><SelectItem value="fat">Faturada</SelectItem><SelectItem value="can">Cancelada</SelectItem></SelectContent>
            </Select>
            <Button className="gap-2"><BarChart3 size={14} /> Gerar Relatório</Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader><TableRow className="bg-muted/50">
            <TableHead>ID</TableHead><TableHead>Tipo</TableHead><TableHead>Técnico</TableHead><TableHead>Cliente</TableHead><TableHead>Abertura</TableHead><TableHead>Realização</TableHead><TableHead className="text-right">Total</TableHead><TableHead>Status</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {mockRelatorio.map((r, i) => (
              <TableRow key={r.id} className={cn(i % 2 === 0 && "bg-muted/20")}>
                <TableCell className="font-mono">{r.id}</TableCell>
                <TableCell>{r.tipo}</TableCell>
                <TableCell>{r.tecnico}</TableCell>
                <TableCell>{r.cliente}</TableCell>
                <TableCell>{r.abertura}</TableCell>
                <TableCell>{r.realizacao}</TableCell>
                <TableCell className="text-right font-mono">{r.total}</TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{r.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
