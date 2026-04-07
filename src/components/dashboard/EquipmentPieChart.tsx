import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
  { name: "GolSat Rastreamento", value: 1245, color: "hsl(214, 68%, 46%)" },
  { name: "Tracker do Brasil", value: 892, color: "hsl(142, 38%, 44%)" },
  { name: "Volvo Segurança", value: 654, color: "hsl(28, 78%, 56%)" },
  { name: "Scania Monitoramento", value: 432, color: "hsl(260, 52%, 58%)" },
  { name: "Mercedes Guard", value: 321, color: "hsl(175, 46%, 44%)" },
  { name: "Iveco Protect", value: 198, color: "hsl(0, 58%, 56%)" },
  { name: "Outras", value: 567, color: "hsl(220, 10%, 60%)" },
];

export function EquipmentPieChart() {
  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">
        Equipamentos distribuídos nos clientes
      </h3>
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
              <Cell key={index} fill={entry.color} />
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
    </div>
  );
}
