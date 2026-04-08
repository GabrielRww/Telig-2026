import { cn } from "@/lib/utils";

type AlertTone = "amber" | "red" | "blue";

interface SystemAlert {
  title: string;
  description: string;
  tone: AlertTone;
}

const alerts: SystemAlert[] = [
  {
    title: "12 veículos com possível retirada não registrada",
    description: "Veículos sem equipamento ativo detectados automaticamente",
    tone: "amber",
  },
  {
    title: "3 OS em agendamento há mais de 7 dias",
    description: "Ordens de serviço aguardando designação de técnico",
    tone: "red",
  },
  {
    title: "5 equipamentos com manutenção preventiva pendente",
    description: "Verificar agendamento junto aos técnicos responsáveis",
    tone: "blue",
  },
];

const toneStyles: Record<AlertTone, { wrapper: string; dot: string }> = {
  amber: {
    wrapper: "border-amber-200 bg-amber-50/80",
    dot: "bg-amber-500",
  },
  red: {
    wrapper: "border-red-200 bg-red-50/80",
    dot: "bg-red-500",
  },
  blue: {
    wrapper: "border-blue-200 bg-blue-50/80",
    dot: "bg-blue-500",
  },
};

export function SystemAlerts() {
  return (
    <section className="w-full max-w-[560px] rounded-lg border bg-card p-5 shadow-sm animate-fade-in">
      <h3 className="mb-5 text-lg font-semibold text-card-foreground">Alertas do Sistema</h3>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.title}
            className={cn(
              "flex items-start gap-3 rounded-lg border px-4 py-3 transition-colors duration-200",
              toneStyles[alert.tone].wrapper
            )}
          >
            <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", toneStyles[alert.tone].dot)} />

            <div className="min-w-0">
              <p className="text-[15px] font-semibold leading-5 text-slate-900">
                {alert.title}
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                {alert.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}