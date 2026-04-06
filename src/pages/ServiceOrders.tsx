import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_TABS = [
  { label: "Em agendamento", count: 45 },
  { label: "Em reagendamento", count: 12 },
  { label: "Agendada", count: 89 },
  { label: "Em Atendimento", count: 23 },
  { label: "Em Execução", count: 34 },
  { label: "Finalizada", count: 156 },
  { label: "Validada", count: 78 },
  { label: "Estoque", count: 15 },
  { label: "Faturada", count: 1203 },
  { label: "Cancelada", count: 42 },
];

const MOCK_OS = Array.from({ length: 10 }, (_, i) => ({
  id: 188432 - i,
  pedido: `PED-${2024000 + i}`,
  tipo: ["INSTALAÇÃO", "RETIRADA", "MANUTENÇÃO", "REINSTALAÇÃO"][i % 4],
  tecnico: ["Carlos Silva", "Roberto Lima", "Ana Costa", "Pedro Santos"][i % 4],
  veiculo: `ABC-${1000 + i}`,
  cliente: ["GolSat", "Tracker BR", "Volvo Seg.", "Scania Mon."][i % 4],
  empresaFat: ["GolSat Rastreamento", "Tracker do Brasil", "Volvo Segurança", "Scania Mon."][i % 4],
  abertura: new Date(2024, 11, 20 - i).toLocaleDateString("pt-BR"),
  realizacao: i < 5 ? new Date(2024, 11, 21 - i).toLocaleDateString("pt-BR") : "—",
  total: `R$ ${(Math.random() * 500 + 100).toFixed(2)}`,
}));

const ServiceOrders = () => {
  const [activeTab, setActiveTab] = useState("Agendada");
  const [searchField, setSearchField] = useState("id");

  return (
    <div>
      <Breadcrumb items={[{ label: "Ordem de Serviço" }]} />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground">Ordens de Serviço</h1>
        <Button variant="success" className="gap-2">
          <Plus className="h-4 w-4" />
          Incluir
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-1 mb-4 border-b border-border pb-px">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-3 py-2 text-xs font-medium rounded-t-md transition-colors border-b-2 ${
              activeTab === tab.label
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px]">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <Select value={searchField} onValueChange={setSearchField}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="pedido">Pedido</SelectItem>
            <SelectItem value="tipo">Tipo</SelectItem>
            <SelectItem value="tecnico">Técnico</SelectItem>
            <SelectItem value="veiculo">Veículo</SelectItem>
            <SelectItem value="cliente">Cliente</SelectItem>
            <SelectItem value="serial">Equip. Serial</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar..." className="pl-9" />
        </div>
        <Button variant="default" size="sm">
          Filtrar
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-striped">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">ID</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Pedido</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Tipo</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Técnico</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Veículo</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Cliente</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Emp. Faturamento</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Abertura</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Realização</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_OS.map((os) => (
                <tr key={os.id} className="border-b border-border/50 cursor-pointer">
                  <td className="p-3 font-mono font-medium text-primary">#{os.id}</td>
                  <td className="p-3">{os.pedido}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                      {os.tipo}
                    </span>
                  </td>
                  <td className="p-3">{os.tecnico}</td>
                  <td className="p-3 font-mono">{os.veiculo}</td>
                  <td className="p-3">{os.cliente}</td>
                  <td className="p-3 text-muted-foreground">{os.empresaFat}</td>
                  <td className="p-3">{os.abertura}</td>
                  <td className="p-3">{os.realizacao}</td>
                  <td className="p-3 text-right font-medium">{os.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Exibir</span>
            <Select defaultValue="10">
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>por página</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground mr-3">1-10 de 89</span>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceOrders;
