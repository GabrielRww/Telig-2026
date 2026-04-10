import { useMemo, useState } from "react";
import { Search, Filter, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewServiceOrderDialog from "@/components/service-orders/NewServiceOrderDialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  serviceOrderStatusColorMap,
  serviceOrderStatusOptions,
  serviceOrderTypeLabels,
  useServiceOrders,
} from "@/data/service-orders";

export default function ServiceOrders() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const orders = useServiceOrders();

  const statusTabs = useMemo(() => {
    const countsByStatus = orders.reduce<Record<string, number>>((accumulator, order) => {
      accumulator[order.status] = (accumulator[order.status] ?? 0) + 1;
      return accumulator;
    }, {});

    return [
      { key: "all", label: "Todas", count: orders.length },
      ...serviceOrderStatusOptions.map((option) => ({
        key: option.value,
        label: option.label,
        count: countsByStatus[option.value] ?? 0,
      })),
    ];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = normalizeServiceOrderSearch(search);

    return orders.filter((order) => {
      if (activeTab !== "all" && order.status !== activeTab) {
        return false;
      }

      if (selectedType !== "all" && order.tipo !== selectedType) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchTarget = normalizeServiceOrderSearch(
        [
          order.id,
          order.pedido,
          order.tipo,
          serviceOrderTypeLabels[order.tipo] ?? order.tipo,
          order.tecnico,
          order.veiculo,
          order.cliente,
          order.empresa,
          order.abertura,
          order.realizacao,
          order.total,
          order.valorTecnico,
          order.valorCliente,
          order.status,
          order.agendamentoStatus,
          order.agendamentoData,
          order.agendamentoHora,
          order.agendamentoObservacao,
        ].join(" ")
      );

      return searchTarget.includes(normalizedSearch);
    });
  }, [activeTab, orders, search, selectedType]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Ordens de Serviço</h1>
        <NewServiceOrderDialog />
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors",
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            {tab.label}
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full",
              activeTab === tab.key ? "bg-primary-foreground/20" : "bg-foreground/10"
            )}>
              {tab.count.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, pedido, placa, técnico, cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tipo OS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(serviceOrderTypeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="default" className="gap-2">
          <Filter size={14} />
          Filtros
        </Button>
      </div>

      {/* Table */}
      <Card className="border shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[70px]">ID</TableHead>
                <TableHead>Pedido</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Emp. Faturamento</TableHead>
                <TableHead>Abertura</TableHead>
                <TableHead>Realização</TableHead>
                <TableHead className="text-right">Valor Técnico</TableHead>
                <TableHead className="text-right">Valor Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order, i) => (
                <TableRow
                  key={order.id}
                  className={cn(
                    "cursor-pointer hover:bg-muted/50 transition-colors",
                    i % 2 === 0 && "bg-muted/20"
                  )}
                >
                  <TableCell className="font-mono text-sm font-medium">{order.id}</TableCell>
                  <TableCell className="text-sm">{order.pedido}</TableCell>
                  <TableCell>
                    <span className="text-sm">{serviceOrderTypeLabels[order.tipo] || order.tipo}</span>
                  </TableCell>
                  <TableCell className="text-sm">{order.tecnico}</TableCell>
                  <TableCell className="font-mono text-sm">{order.veiculo}</TableCell>
                  <TableCell className="text-sm">{order.cliente}</TableCell>
                  <TableCell className="text-sm">{order.empresa}</TableCell>
                  <TableCell className="text-sm">{order.abertura}</TableCell>
                  <TableCell className="text-sm">{order.realizacao}</TableCell>
                  <TableCell className="text-right text-sm font-medium">{order.valorTecnico || "-"}</TableCell>
                  <TableCell className="text-right text-sm font-medium">{order.valorCliente || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs font-medium", serviceOrderStatusColorMap[order.status])}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <NewServiceOrderDialog
                      order={order}
                      trigger={(
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <PencilLine size={14} />
                        </Button>
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Exibindo {filteredOrders.length === 0 ? 0 : 1}
              {filteredOrders.length > 0 ? `-${Math.min(filteredOrders.length, 10)}` : ""}
              {" "}de {filteredOrders.length}
            </span>
            <Select defaultValue="10">
              <SelectTrigger className="w-[80px] h-8">
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
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Anterior</Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
            <Button variant="outline" size="sm">Próxima</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-card rounded-lg", className)} {...props}>{children}</div>;
}
