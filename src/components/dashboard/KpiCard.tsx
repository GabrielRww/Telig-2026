import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: "blue" | "green" | "orange" | "purple" | "red" | "teal";
  description?: string;
}

const colorMap = {
  blue: "bg-kpi-blue/10 text-kpi-blue border-kpi-blue/20",
  green: "bg-kpi-green/10 text-kpi-green border-kpi-green/20",
  orange: "bg-kpi-orange/10 text-kpi-orange border-kpi-orange/20",
  purple: "bg-kpi-purple/10 text-kpi-purple border-kpi-purple/20",
  red: "bg-kpi-red/10 text-kpi-red border-kpi-red/20",
  teal: "bg-kpi-teal/10 text-kpi-teal border-kpi-teal/20",
};

const iconBgMap = {
  blue: "bg-kpi-blue",
  green: "bg-kpi-green",
  orange: "bg-kpi-orange",
  purple: "bg-kpi-purple",
  red: "bg-kpi-red",
  teal: "bg-kpi-teal",
};

export function KpiCard({ title, value, icon: Icon, color, description }: KpiCardProps) {
  return (
    <div className={cn(
      "rounded-lg border p-4 flex items-start gap-4 animate-fade-in",
      colorMap[color]
    )}>
      <div className={cn("rounded-lg p-2.5 text-primary-foreground shrink-0", iconBgMap[color])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-2xl font-bold animate-count-up">{value}</p>
        {description && <p className="text-xs opacity-60 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}
