import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Car } from "lucide-react";
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

const mockVeiculos = [
  { id: 1, placa: "ABC1234", modelo: "Fiat Strada", ano: 2023, cor: "Branca", cliente: "Volare Segurança", equipamentos: [{ serial: "TJ-2024-001", produto: "TJammer 4G", status: "Ativo" }, { serial: "TB-2024-010", produto: "TBlock Pro", status: "Ativo" }], ultimaOS: 188432, statusEquip: "Equipado" },
  { id: 2, placa: "XYZ5678", modelo: "VW Gol", ano: 2022, cor: "Prata", cliente: "Tracker Brasil", equipamentos: [{ serial: "TJ-2023-145", produto: "TBlock", status: "Ativo" }], ultimaOS: 188431, statusEquip: "Equipado" },
  { id: 3, placa: "DEF9012", modelo: "Toyota Hilux", ano: 2024, cor: "Preta", cliente: "LogSafe", equipamentos: [{ serial: "TJ-2023-089", produto: "Rastreador 4G", status: "Manutenção" }], ultimaOS: 188430, statusEquip: "Em Manutenção" },
  { id: 4, placa: "GHI3456", modelo: "Chevrolet S10", ano: 2023, cor: "Vermelha", cliente: "TransGuarda", equipamentos: [], ultimaOS: 188429, statusEquip: "Sem equipamento" },
  { id: 5, placa: "JKL7890", modelo: "Ford Ranger", ano: 2024, cor: "Azul", cliente: "FleetShield", equipamentos: [{ serial: "TJ-2024-055", produto: "TBlock", status: "Ativo" }, { serial: "TJ-2024-056", produto: "Rastreador 4G", status: "Ativo" }], ultimaOS: 188428, statusEquip: "Equipado" },
  { id: 6, placa: "MNO1234", modelo: "Fiat Toro", ano: 2022, cor: "Cinza", cliente: "Volare Segurança", equipamentos: [{ serial: "TJ-2022-200", produto: "TJammer 4G", status: "Ativo" }], ultimaOS: 188427, statusEquip: "Equipado" },
];

const statusEquipColor: Record<string, string> = {
  "Equipado": "border-slate-200 text-slate-700",
  "Em Manutenção": "border-amber-200 text-amber-700",
  "Sem equipamento": "border-rose-200 text-rose-700",
};

const statusBadgeBase = "rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-none";

export default function VeiculosConsulta() {
  const [searchField, setSearchField] = useState("placa");
  const [searchValue, setSearchValue] = useState("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const filtered = mockVeiculos.filter((v) => {
    if (!searchValue) return true;
    const val = searchValue.toLowerCase();
    switch (searchField) {
      case "placa": return v.placa.toLowerCase().includes(val);
      case "modelo": return v.modelo.toLowerCase().includes(val);
      case "cliente": return v.cliente.toLowerCase().includes(val);
      case "serial": return v.equipamentos.some(e => e.serial.toLowerCase().includes(val));
      default: return true;
    }
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Consulta de Veículos</h1>

      <div className="flex items-center gap-2 justify-end">
        <Select value={searchField} onValueChange={setSearchField}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placa">Placa</SelectItem>
            <SelectItem value="modelo">Modelo</SelectItem>
            <SelectItem value="cliente">Cliente</SelectItem>
            <SelectItem value="serial">Serial Equip.</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Pesquisar..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="w-[50px] p-3"></th>
              <th className="p-3 text-left font-semibold text-primary">PLACA</th>
              <th className="p-3 text-left font-semibold text-primary">MODELO</th>
              <th className="p-3 text-left font-semibold text-primary">ANO</th>
              <th className="p-3 text-left font-semibold text-primary">COR</th>
              <th className="p-3 text-left font-semibold text-primary">CLIENTE</th>
              <th className="p-3 text-left font-semibold text-primary">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, i) => (
              <>
                <tr key={v.id} className={cn("border-b transition-colors", i % 2 === 0 ? "bg-card" : "bg-muted/20")}>
                  <td className="p-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg border-border/70 bg-background text-primary shadow-sm hover:bg-primary hover:text-primary-foreground"
                      onClick={() => setExpandedRow(expandedRow === v.id ? null : v.id)}
                    >
                      {expandedRow === v.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </Button>
                  </td>
                  <td className="p-3 font-mono font-medium">{v.placa}</td>
                  <td className="p-3">{v.modelo}</td>
                  <td className="p-3">{v.ano}</td>
                  <td className="p-3">{v.cor}</td>
                  <td className="p-3">{v.cliente}</td>
                  <td className="p-3">
                    <Badge variant="outline" className={cn(statusBadgeBase, statusEquipColor[v.statusEquip])}>{v.statusEquip}</Badge>
                  </td>
                </tr>
                {expandedRow === v.id && (
                  <tr key={`${v.id}-detail`} className="bg-muted/10">
                    <td colSpan={7} className="p-0">
                      <div className="p-6 border-l-4 border-primary space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <ReadField label="Placa" value={v.placa} />
                          <ReadField label="Modelo" value={v.modelo} />
                          <ReadField label="Ano" value={v.ano.toString()} />
                          <ReadField label="Cor" value={v.cor} />
                          <ReadField label="Cliente" value={v.cliente} />
                          <ReadField label="Última OS" value={`#${v.ultimaOS}`} />
                        </div>
                        {v.equipamentos.length > 0 ? (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Equipamentos Instalados</h4>
                            <div className="bg-card rounded border overflow-hidden">
                              <table className="w-full text-sm">
                                <thead><tr className="bg-muted/50 border-b">
                                  <th className="p-2 text-left font-medium text-muted-foreground">Serial</th>
                                  <th className="p-2 text-left font-medium text-muted-foreground">Produto</th>
                                  <th className="p-2 text-left font-medium text-muted-foreground">Status</th>
                                </tr></thead>
                                <tbody>
                                  {v.equipamentos.map((eq, j) => (
                                    <tr key={j} className="border-b last:border-0">
                                      <td className="p-2 font-mono">{eq.serial}</td>
                                      <td className="p-2">{eq.produto}</td>
                                      <td className="p-2"><Badge variant="outline" className="rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-none">{eq.status}</Badge></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Car size={14} /> Nenhum equipamento instalado neste veículo.
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Nenhum veículo encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <p className="text-sm font-medium text-foreground mt-0.5 bg-muted/30 rounded px-3 py-1.5 border">{value || "-"}</p>
    </div>
  );
}
