import { useMemo, useState } from "react";
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  normalizeServiceOrderSearch,
  formatServiceOrderDate,
  serviceOrderSchedulingStatusColorMap,
  serviceOrderStatusColorMap,
  serviceOrderTypeLabels,
  useServiceOrders,
  type ServiceOrderRecord,
} from "@/data/service-orders";

const searchFields = [
  { value: "id", label: "ID" },
  { value: "pedido", label: "PEDIDO" },
  { value: "tipo", label: "TIPO" },
  { value: "tecnico", label: "TÉCNICO" },
  { value: "veiculo", label: "VEÍCULO" },
  { value: "cliente", label: "CLIENTE" },
  { value: "status", label: "STATUS" },
  { value: "agendamento_status", label: "STATUS AGEND." },
  { value: "abertura", label: "ABERTURA" },
  { value: "realizacao", label: "REALIZAÇÃO" },
  { value: "agendamento", label: "AGENDAMENTO" },
  { value: "total", label: "TOTAL" },
  { value: "equip_serial", label: "EQUIP. SERIAL" },
  { value: "equip_id", label: "EQUIP. ID" },
];
export default function ServiceOrderConsulta() {
  const [searchField, setSearchField] = useState("id");
  const [searchValue, setSearchValue] = useState("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const orders = useServiceOrders();

  const filteredOrders = useMemo(() => {
    const normalizedSearch = normalizeServiceOrderSearch(searchValue);

    return orders.filter((order) => {
      if (!normalizedSearch) {
        return true;
      }

      switch (searchField) {
        case "id":
          return normalizeServiceOrderSearch(order.id.toString()).includes(normalizedSearch);
        case "pedido":
          return normalizeServiceOrderSearch(order.pedido).includes(normalizedSearch);
        case "tipo":
          return normalizeServiceOrderSearch(serviceOrderTypeLabels[order.tipo] || order.tipo).includes(normalizedSearch);
        case "tecnico":
          return normalizeServiceOrderSearch(order.tecnico).includes(normalizedSearch);
        case "veiculo":
          return normalizeServiceOrderSearch(order.veiculo).includes(normalizedSearch);
        case "cliente":
          return normalizeServiceOrderSearch(order.cliente).includes(normalizedSearch);
        case "status":
          return normalizeServiceOrderSearch(order.status).includes(normalizedSearch);
        case "agendamento_status":
          return normalizeServiceOrderSearch(order.agendamentoStatus).includes(normalizedSearch);
        case "abertura":
          return normalizeServiceOrderSearch(order.abertura).includes(normalizedSearch);
        case "realizacao":
          return normalizeServiceOrderSearch(order.realizacao).includes(normalizedSearch);
        case "agendamento":
          return normalizeServiceOrderSearch([
            order.agendamentoData,
            order.agendamentoHora,
            order.agendamentoObservacao,
          ].join(" ")).includes(normalizedSearch);
        case "total":
          return normalizeServiceOrderSearch(order.total).includes(normalizedSearch);
        case "equip_serial":
          return order.equipamentos.some((equipment) => normalizeServiceOrderSearch(equipment.serial).includes(normalizedSearch));
        case "equip_id":
          return order.equipamentos.some((equipment) => normalizeServiceOrderSearch(equipment.serial).includes(normalizedSearch));
        default:
          return true;
      }
    });
  }, [orders, searchField, searchValue]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / perPage));
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">OS Consulta</h1>

      {/* Search bar */}
      <div className="flex items-center gap-2 justify-end">
        <Select value={searchField} onValueChange={setSearchField}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {searchFields.map((f) => (
              <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar..."
            value={searchValue}
            onChange={(e) => { setSearchValue(e.target.value); setCurrentPage(1); }}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="w-[50px] p-3"></th>
                <th className="p-3 text-left font-semibold text-primary">ID ↓</th>
                <th className="p-3 text-left font-semibold text-primary">PEDIDO</th>
                <th className="p-3 text-left font-semibold text-primary">TIPO</th>
                <th className="p-3 text-left font-semibold text-primary">TÉCNICO</th>
                <th className="p-3 text-left font-semibold text-primary">VEÍCULO</th>
                <th className="p-3 text-left font-semibold text-primary">CLIENTE</th>
                <th className="p-3 text-left font-semibold text-primary">STATUS</th>
                <th className="p-3 text-left font-semibold text-primary">REALIZAÇÃO</th>
                <th className="p-3 text-right font-semibold text-primary">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order, i) => (
                <>
                  <tr
                    key={order.id}
                    className={cn(
                      "border-b transition-colors",
                      i % 2 === 0 ? "bg-card" : "bg-muted/20"
                    )}
                  >
                    <td className="p-3">
                      <Button
                        variant="default"
                        size="icon"
                        className="h-7 w-7 rounded bg-primary hover:bg-primary/90"
                        onClick={() => toggleRow(order.id)}
                      >
                        {expandedRow === order.id ? <ChevronUp size={14} className="text-primary-foreground" /> : <ChevronDown size={14} className="text-primary-foreground" />}
                      </Button>
                    </td>
                    <td className="p-3 font-mono font-medium">{order.id}</td>
                    <td className="p-3">{order.pedido}</td>
                    <td className="p-3">{serviceOrderTypeLabels[order.tipo] || order.tipo}</td>
                    <td className="p-3">{order.tecnico}</td>
                    <td className="p-3 font-mono">{order.veiculo}</td>
                    <td className="p-3">{order.cliente}</td>
                    <td className="p-3">
                      <Badge variant="secondary" className={cn("text-xs font-medium", serviceOrderStatusColorMap[order.status])}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-3">{order.realizacao}</td>
                    <td className="p-3 text-right font-medium">{order.total}</td>
                  </tr>
                  {expandedRow === order.id && (
                    <tr key={`${order.id}-detail`} className="bg-muted/10">
                      <td colSpan={10} className="p-0">
                        <OrderDetail order={order} />
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-muted-foreground">
                    Nenhuma ordem encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center gap-1">
            <Button variant="default" size="icon" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
              <ChevronsLeft size={14} />
            </Button>
            <Button variant="default" size="icon" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              <ChevronLeft size={14} />
            </Button>
            <div className="flex items-center gap-1 mx-2 text-sm">
              <Input
                className="w-12 h-8 text-center p-1"
                value={currentPage}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (v >= 1 && v <= totalPages) setCurrentPage(v);
                }}
              />
              <span className="text-muted-foreground">de {totalPages}</span>
            </div>
            <Button variant="default" size="icon" className="h-8 w-8" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              <ChevronRight size={14} />
            </Button>
            <Button variant="default" size="icon" className="h-8 w-8" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
              <ChevronsRight size={14} />
            </Button>
            <Button variant="default" size="icon" className="h-8 w-8 ml-1" onClick={() => setCurrentPage(1)}>
              <RefreshCw size={14} />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Mostrar</span>
            <Input
              className="w-14 h-8 text-center p-1"
              type="number"
              value={perPage}
              onChange={(e) => { setPerPage(Math.max(1, parseInt(e.target.value) || 10)); setCurrentPage(1); }}
            />
            <span>por página</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderDetail({ order }: { order: ServiceOrderRecord }) {
  return (
    <div className="p-6 space-y-4 border-l-4 border-primary">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ReadOnlyField label="ID" value={order.id.toString()} />
        <ReadOnlyField label="Pedido" value={order.pedido} />
        <ReadOnlyField label="Tipo" value={serviceOrderTypeLabels[order.tipo] || order.tipo} />
        <ReadOnlyField label="Status" value={order.status} />
        <ReadOnlyField label="Técnico" value={order.tecnico} />
        <ReadOnlyField label="Veículo" value={order.veiculo} />
        <ReadOnlyField label="Cliente" value={order.cliente} />
        <ReadOnlyField label="Empresa Faturamento" value={order.empresa} />
        <ReadOnlyField
          label="Status do agendamento"
          value={order.agendamentoStatus}
          badgeClassName={serviceOrderSchedulingStatusColorMap[order.agendamentoStatus]}
        />
        <ReadOnlyField label="Data Abertura" value={order.abertura} />
        <ReadOnlyField label="Data Realização" value={order.realizacao} />
        <ReadOnlyField label="Valor Técnico" value={order.valorTecnico || "-"} />
        <ReadOnlyField label="Valor Cliente" value={order.valorCliente || "-"} />
        <ReadOnlyField label="Total" value={order.total} />
        <ReadOnlyField label="Data de retorno" value={formatServiceOrderDate(order.agendamentoData)} />
        <ReadOnlyField label="Hora de retorno" value={order.agendamentoHora} />
        <ReadOnlyField label="Observação do retorno" value={order.agendamentoObservacao} fullWidth />
        <ReadOnlyField label="Responsável" value={order.responsavel} />
        <ReadOnlyField label="Cargo" value={order.cargo} />
        <ReadOnlyField label="UF" value={order.uf} />
        <ReadOnlyField label="Cidade" value={order.cidade} />
        <ReadOnlyField label="Endereço" value={order.endereco} fullWidth />
      </div>

      {order.defeitoRelatado && (
        <ReadOnlyField label="Defeito Relatado" value={order.defeitoRelatado} fullWidth />
      )}
      {order.defeitoConstatado && (
        <ReadOnlyField label="Defeito Constatado" value={order.defeitoConstatado} fullWidth />
      )}
      {order.observacao && (
        <ReadOnlyField label="Observação" value={order.observacao} fullWidth />
      )}

      {order.equipamentos.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Equipamentos</h4>
          <div className="bg-card rounded border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="p-2 text-left font-medium text-muted-foreground">Serial</th>
                  <th className="p-2 text-left font-medium text-muted-foreground">Produto</th>
                  <th className="p-2 text-left font-medium text-muted-foreground">Ação</th>
                </tr>
              </thead>
              <tbody>
                {order.equipamentos.map((eq, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="p-2 font-mono">{eq.serial}</td>
                    <td className="p-2">{eq.produto}</td>
                    <td className="p-2">
                      <Badge variant="secondary" className="text-xs">{eq.acao}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {order.despesas.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Despesas</h4>
          <div className="bg-card rounded border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="p-2 text-left font-medium text-muted-foreground">Descrição</th>
                  <th className="p-2 text-right font-medium text-muted-foreground">Valor</th>
                </tr>
              </thead>
              <tbody>
                {order.despesas.map((d, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="p-2">{d.descricao}</td>
                    <td className="p-2 text-right font-medium">{d.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ReadOnlyField({ label, value, fullWidth, badgeClassName }: { label: string; value: string; fullWidth?: boolean; badgeClassName?: string }) {
  return (
    <div className={fullWidth ? "col-span-full" : ""}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <p className={cn(
        "text-sm font-medium text-foreground mt-0.5 rounded px-3 py-1.5 border",
        badgeClassName ?? "bg-muted/30"
      )}>
        {value || "-"}
      </p>
    </div>
  );
}
