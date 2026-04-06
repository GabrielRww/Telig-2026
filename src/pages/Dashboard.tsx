import {
  FileText, CheckCircle, Wrench, Users, Cpu, ClipboardList, RefreshCw,
} from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { EquipmentPieChart } from "@/components/dashboard/EquipmentPieChart";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Dashboard = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const handleRefresh = () => setLastUpdate(new Date());

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
        <KpiCard title="OS Abertas Hoje" value={23} icon={FileText} color="blue" />
        <KpiCard title="Atendimentos Hoje" value={18} icon={ClipboardList} color="green" />
        <KpiCard title="Instalações Concluídas" value={12} icon={CheckCircle} color="teal" />
        <KpiCard title="Manutenções em Andamento" value={7} icon={Wrench} color="orange" />
        <KpiCard title="Técnicos Disponíveis" value={5} icon={Users} color="purple" />
        <KpiCard title="Equipamentos Ativos" value="4.309" icon={Cpu} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EquipmentPieChart />
        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">
            Últimas Ordens de Serviço
          </h3>
          <div className="space-y-3">
            {[
              { id: "188432", type: "INSTALAÇÃO", client: "GolSat Rastreamento", status: "Em Execução", time: "14:32" },
              { id: "188431", type: "RETIRADA", client: "Tracker do Brasil", status: "Finalizada", time: "13:15" },
              { id: "188430", type: "MANUTENÇÃO", client: "Volvo Segurança", status: "Agendada", time: "11:45" },
              { id: "188429", type: "REINSTALAÇÃO", client: "Scania Monitoramento", status: "Em Atendimento", time: "10:20" },
              { id: "188428", type: "INSTALAÇÃO", client: "Mercedes Guard", status: "Validada", time: "09:05" },
            ].map((os) => (
              <div key={os.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-medium text-primary">#{os.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{os.type}</span>
                  <span className="text-sm text-foreground">{os.client}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{os.time}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{os.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
