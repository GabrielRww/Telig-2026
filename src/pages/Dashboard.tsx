import {
  FileText, CheckCircle, Wrench, Users, Cpu, ClipboardList, RefreshCw,
} from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { EquipmentPieChart } from "@/components/dashboard/EquipmentPieChart";
import { SystemAlerts } from "@/components/dashboard/SystemAlerts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  serviceOrderStatusColorMap,
  serviceOrderTypeLabels,
  useServiceOrders,
} from "@/data/service-orders";

const Dashboard = () => {
  const orders = useServiceOrders();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const previousOrdersRef = useRef(orders);

  const metrics = useMemo(() => {
    const today = new Date();
    const uniqueTechnicians = new Set<string>();
    let openToday = 0;
    let attendimentosHoje = 0;
    let installationsCompleted = 0;
    let maintenancesInProgress = 0;
    let activeEquipment = 0;

    orders.forEach((order) => {
      if (order.tecnico) {
        uniqueTechnicians.add(order.tecnico);
      }

      activeEquipment += order.equipamentos.length;

      if (isSameDay(parseBrazilianDate(order.abertura), today)) {
        openToday += 1;
      }

      if (["Em atendimento", "Em execução"].includes(order.status)) {
        attendimentosHoje += 1;
      }

      if (order.tipo === "INSTALACAO" && ["Finalizada", "Validada"].includes(order.status)) {
        installationsCompleted += 1;
      }

      if (order.tipo === "MANUTENCAO" && ["Em atendimento", "Em execução"].includes(order.status)) {
        maintenancesInProgress += 1;
      }
    });

    return {
      openToday,
      attendimentosHoje,
      installationsCompleted,
      maintenancesInProgress,
      techniciansOnOs: uniqueTechnicians.size,
      activeEquipment,
    };
  }, [orders]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const handleRefresh = () => setLastUpdate(new Date());

  useEffect(() => {
    if (previousOrdersRef.current === orders) {
      return;
    }

    const previousCount = previousOrdersRef.current.length;
    const nextCount = orders.length;

    if (nextCount > previousCount) {
      toast.success(`Nova ordem de serviço lançada. Total agora: ${nextCount}`);
    } else if (nextCount < previousCount) {
      toast.info(`Uma ordem de serviço foi removida. Total agora: ${nextCount}`);
    } else {
      toast.info("Ordem de serviço atualizada em tempo real");
    }

    setLastUpdate(new Date());
    previousOrdersRef.current = orders;
  }, [orders]);

  return (
    <div>
      <Breadcrumb items={[{ label: "Dashboard" }]} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Atualizado: {lastUpdate.toLocaleTimeString("pt-BR")}
          </span>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard title="OS Abertas Hoje" value={metrics.openToday} icon={FileText} color="blue" />
        <KpiCard title="Atendimentos Hoje" value={metrics.attendimentosHoje} icon={ClipboardList} color="green" />
        <KpiCard title="Instalações Concluídas" value={metrics.installationsCompleted} icon={CheckCircle} color="teal" />
        <KpiCard title="Manutenções em Andamento" value={metrics.maintenancesInProgress} icon={Wrench} color="orange" />
        <KpiCard title="Técnicos em OS" value={metrics.techniciansOnOs} icon={Users} color="purple" />
        <KpiCard title="Equipamentos Ativos" value={metrics.activeEquipment} icon={Cpu} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EquipmentPieChart />
        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">
            Últimas Ordens de Serviço
          </h3>
          <div className="space-y-3">
            {recentOrders.map((os) => (
              <div key={os.id} className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
                <div className="min-w-0 flex items-center gap-3">
                  <span className="text-sm font-mono font-medium text-primary shrink-0">#{os.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium shrink-0">{serviceOrderTypeLabels[os.tipo] || os.tipo}</span>
                  <span className="text-sm text-foreground truncate">{os.cliente}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">{os.abertura}</span>
                  <Badge variant="secondary" className={serviceOrderStatusColorMap[os.status]}>
                    {os.status}
                  </Badge>
                  <span className="text-xs font-medium text-foreground">{os.valorCliente || "-"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <SystemAlerts />
      </div>
    </div>
  );
};

function parseBrazilianDate(value: string) {
  if (!value || !value.includes("/")) {
    return null;
  }

  const [day, month, year] = value.split("/").map((part) => Number.parseInt(part, 10));
  if (!day || !month || !year) {
    return null;
  }

  const parsedDate = new Date(year, month - 1, day);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function isSameDay(dateValue: Date | null, referenceDate: Date) {
  if (!dateValue) {
    return false;
  }

  return (
    dateValue.getFullYear() === referenceDate.getFullYear()
    && dateValue.getMonth() === referenceDate.getMonth()
    && dateValue.getDate() === referenceDate.getDate()
  );
}

export default Dashboard;
