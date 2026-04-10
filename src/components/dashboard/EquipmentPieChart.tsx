import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { serviceOrderStatusOptions, useServiceOrders } from "@/data/service-orders";

const palette = [
  "hsl(214, 84%, 56%)",
  "hsl(142, 56%, 44%)",
  "hsl(28, 82%, 54%)",
  "hsl(260, 62%, 60%)",
  "hsl(175, 52%, 44%)",
  "hsl(0, 68%, 58%)",
  "hsl(220, 10%, 60%)",
  "hsl(44, 96%, 53%)",
  "hsl(192, 76%, 48%)",
  "hsl(334, 72%, 54%)",
  "hsl(38, 92%, 48%)",
];

export function EquipmentPieChart() {
  const orders = useServiceOrders();

  const data = useMemo(() => {
    const countsByStatus = orders.reduce<Record<string, number>>((accumulator, order) => {
      accumulator[order.status] = (accumulator[order.status] ?? 0) + 1;
      return accumulator;
    }, {});

    return serviceOrderStatusOptions
      .map((option, index) => ({
        name: option.label,
        value: countsByStatus[option.value] ?? 0,
        color: palette[index % palette.length],
      }))
      .filter((entry) => entry.value > 0);
  }, [orders]);

  return (
    <div className="bg-card rounded-lg border p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          Ordens de Serviço por Status
        </h3>
        <p className="text-xs text-muted-foreground">
          Atualização em tempo real conforme as OS são lançadas ou editadas
        </p>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`${entry.name}-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(240, 20%, 10%)",
                border: "none",
                borderRadius: "8px",
                color: "hsl(0, 0%, 90%)",
                fontSize: "13px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[320px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
          Nenhuma ordem registrada ainda.
        </div>
      )}
    </div>
  );
}
