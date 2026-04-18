import { useState, useMemo } from "react";
import { Download, TrendingUp, TrendingDown, DollarSign, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { useServiceOrders, parseCurrencyValue, formatCurrencyBRL, serviceOrderTypeLabels } from "@/data/service-orders";
import { useNotasFiscais } from "@/data/financeiro";

const CORES = ["#2563eb", "#16a34a", "#dc2626", "#d97706", "#7c3aed", "#0891b2"];

function getMonthKey(dateStr: string) {
  if (!dateStr || dateStr === "-") return null;
  const parts = dateStr.includes("/") ? dateStr.split("/").reverse() : dateStr.split("-");
  return `${parts[0]}-${parts[1]}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-");
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${months[parseInt(m) - 1]}/${y.slice(2)}`;
}

export default function RelatorioFinanceiro() {
  const orders = useServiceOrders();
  const nfs = useNotasFiscais();
  const [periodo, setPeriodo] = useState("6");
  const [breakdown, setBreakdown] = useState<"cliente" | "tipo" | "tecnico">("cliente");

  const osFinalizadas = orders.filter((o) =>
    ["Finalizada", "Validada", "Faturada"].includes(o.status)
  );

  // Últimos N meses
  const cutoff = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - parseInt(periodo));
    return d.toISOString().slice(0, 7);
  }, [periodo]);

  const osPeriodo = osFinalizadas.filter((o) => {
    const mk = getMonthKey(o.realizacao || o.abertura);
    return mk && mk >= cutoff;
  });

  // Métricas gerais
  const receitaBruta = osPeriodo.reduce((s, o) => s + parseCurrencyValue(o.valorCliente), 0);
  const custoTecnicos = osPeriodo.reduce((s, o) => s + parseCurrencyValue(o.valorTecnico), 0);
  const custoDespesas = osPeriodo.reduce((s, o) => s + o.despesas.reduce((d, e) => d + parseCurrencyValue(e.valor), 0), 0);
  const custoTotal = custoTecnicos + custoDespesas;
  const margem = receitaBruta > 0 ? ((receitaBruta - custoTotal) / receitaBruta) * 100 : 0;
  const inadimplencia = nfs.filter((n) => n.status === "Emitida" && n.statusPagamento === "Vencido").reduce((s, n) => s + (n.valor - n.valorPago), 0);

  // Gráfico por mês
  const mesesMap: Record<string, { receita: number; custo: number }> = {};
  osPeriodo.forEach((o) => {
    const mk = getMonthKey(o.realizacao || o.abertura);
    if (!mk) return;
    if (!mesesMap[mk]) mesesMap[mk] = { receita: 0, custo: 0 };
    mesesMap[mk].receita += parseCurrencyValue(o.valorCliente);
    mesesMap[mk].custo += parseCurrencyValue(o.valorTecnico) + o.despesas.reduce((d, e) => d + parseCurrencyValue(e.valor), 0);
  });
  const dadosMensais = Object.entries(mesesMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => ({ mes: monthLabel(k), receita: v.receita, custo: v.custo, margem: v.receita - v.custo }));

  // Breakdown
  const breakdownMap: Record<string, number> = {};
  osPeriodo.forEach((o) => {
    const key = breakdown === "cliente" ? o.cliente : breakdown === "tipo" ? (serviceOrderTypeLabels[o.tipo] || o.tipo) : o.tecnico;
    if (!key) return;
    breakdownMap[key] = (breakdownMap[key] || 0) + parseCurrencyValue(o.valorCliente);
  });
  const dadosBreakdown = Object.entries(breakdownMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  const handleExportCSV = () => {
    const linhas = [
      ["OS", "Cliente", "Técnico", "Tipo", "Status", "Abertura", "Realização", "Valor Cliente", "Valor Técnico"].join(";"),
      ...osPeriodo.map((o) => [o.pedido, o.cliente, o.tecnico, o.tipo, o.status, o.abertura, o.realizacao, o.valorCliente, o.valorTecnico].join(";")),
    ];
    const blob = new Blob([linhas.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-financeiro-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Relatório Financeiro</h1>
        <div className="flex items-center gap-2">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[160px] h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Últimos 3 meses</SelectItem>
              <SelectItem value="6">Últimos 6 meses</SelectItem>
              <SelectItem value="12">Últimos 12 meses</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCSV}>
            <Download size={14} /> Exportar CSV
          </Button>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp size={14} /><span className="text-xs">Receita Bruta</span>
            </div>
            <p className="text-xl font-bold text-green-600">{formatCurrencyBRL(receitaBruta)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingDown size={14} /><span className="text-xs">Custos</span>
            </div>
            <p className="text-xl font-bold text-red-600">{formatCurrencyBRL(custoTotal)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign size={14} /><span className="text-xs">Margem</span>
            </div>
            <p className="text-xl font-bold text-blue-600">{margem.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">{formatCurrencyBRL(receitaBruta - custoTotal)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <AlertTriangle size={14} /><span className="text-xs">Inadimplência</span>
            </div>
            <p className="text-xl font-bold text-yellow-600">{formatCurrencyBRL(inadimplencia)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico mensal */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Receita × Custo × Margem por Mês</CardTitle></CardHeader>
        <CardContent>
          {dadosMensais.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Sem OS finalizadas no período selecionado.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dadosMensais} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatCurrencyBRL(v)} />
                <Legend />
                <Bar dataKey="receita" name="Receita" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="custo" name="Custo" fill="#dc2626" radius={[4, 4, 0, 0]} />
                <Bar dataKey="margem" name="Margem" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Receita por</CardTitle>
              <Select value={breakdown} onValueChange={(v) => setBreakdown(v as typeof breakdown)}>
                <SelectTrigger className="w-[130px] h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="tipo">Tipo de OS</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {dadosBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Sem dados.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={dadosBreakdown} cx="50%" cy="50%" outerRadius={90} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {dadosBreakdown.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrencyBRL(v)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Ranking — Top receita</CardTitle></CardHeader>
          <CardContent>
            {dadosBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Sem dados.</p>
            ) : (
              <div className="space-y-2">
                {dadosBreakdown.map((item, i) => {
                  const pct = receitaBruta > 0 ? (item.value / receitaBruta) * 100 : 0;
                  return (
                    <div key={item.name}>
                      <div className="flex justify-between text-sm mb-0.5">
                        <span className="truncate max-w-[60%]">{item.name}</span>
                        <span className="font-mono text-xs">{formatCurrencyBRL(item.value)}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: CORES[i % CORES.length] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
