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
  blue: "border-primary/15 bg-primary/5 text-primary",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  orange: "border-amber-200 bg-amber-50 text-amber-700",
  purple: "border-violet-200 bg-violet-50 text-violet-700",
  red: "border-rose-200 bg-rose-50 text-rose-700",
  teal: "border-cyan-200 bg-cyan-50 text-cyan-700",
};

const iconBgMap = {
  blue: "border-primary/15 bg-primary/10 text-primary",
  green: "border-emerald-200 bg-emerald-100 text-emerald-700",
  orange: "border-amber-200 bg-amber-100 text-amber-700",
  purple: "border-violet-200 bg-violet-100 text-violet-700",
  red: "border-rose-200 bg-rose-100 text-rose-700",
  teal: "border-cyan-200 bg-cyan-100 text-cyan-700",
};

export function KpiCard({ title, value, icon: Icon, color, description }: KpiCardProps) {
  return (
    <div className={cn(
      "rounded-xl border bg-card p-4 flex items-start gap-4 shadow-sm animate-fade-in",
      colorMap[color]
    )}>
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border shrink-0", iconBgMap[color])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground/70">{title}</p>
        <p className="text-2xl font-semibold tracking-tight text-foreground animate-count-up">{value}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </div>
  );
}
