import { useState } from "react";
import { Search, Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Equipamento {
  id: number;
  serial: string;
  produto: string;
  cliente: string;
  veiculo: string;
  status: string;
  dataInstalacao: string;
}

const produtoOptions = [
  "TJammer 4G",
  "TBlock Pro",
  "TBlock",
  "Rastreador 4G",
  "Bloqueador Standard",
  "Antena GPS",
];

const statusOptions = ["Instalado", "Em Manutenção", "Em estoque", "Retirado"];

const statusColor: Record<string, string> = {
  "Instalado": "border-slate-200 text-slate-700",
  "Em Manutenção": "border-amber-200 text-amber-700",
  "Em estoque": "border-slate-200 text-slate-700",
  "Retirado": "border-rose-200 text-rose-700",
};

const statusBadgeBase = "rounded-full bg-background px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-none";

const seedEquipamentos: Equipamento[] = [
  { id: 1, serial: "TJ-2024-001", produto: "TJammer 4G", cliente: "Volare Segurança", veiculo: "ABC1234", status: "Instalado", dataInstalacao: "05/04/2026" },
  { id: 2, serial: "TJ-2023-145", produto: "TBlock", cliente: "Tracker Brasil", veiculo: "XYZ5678", status: "Instalado", dataInstalacao: "15/03/2026" },
  { id: 3, serial: "TJ-2023-089", produto: "Rastreador 4G", cliente: "LogSafe", veiculo: "DEF9012", status: "Em Manutenção", dataInstalacao: "10/01/2026" },
  { id: 4, serial: "TJ-2024-012", produto: "TJammer 4G", cliente: "TransGuarda", veiculo: "GHI3456", status: "Instalado", dataInstalacao: "04/04/2026" },
  { id: 5, serial: "TJ-2024-055", produto: "TBlock", cliente: "FleetShield", veiculo: "JKL7890", status: "Instalado", dataInstalacao: "03/04/2026" },
  { id: 6, serial: "TJ-2024-056", produto: "Rastreador 4G", cliente: "FleetShield", veiculo: "JKL7890", status: "Instalado", dataInstalacao: "03/04/2026" },
  { id: 7, serial: "TJ-2024-070", produto: "TJammer 4G", cliente: "-", veiculo: "-", status: "Em estoque", dataInstalacao: "-" },
  { id: 8, serial: "TJ-2024-071", produto: "TBlock Pro", cliente: "-", veiculo: "-", status: "Em estoque", dataInstalacao: "-" },
];

function createEmpty() {
  return { serial: "", produto: produtoOptions[0], cliente: "", veiculo: "", status: "Em estoque", dataInstalacao: "" };
}

function todayStr() {
  return new Date().toLocaleDateString("pt-BR");
}

export default function Equipamentos() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>(seedEquipamentos);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(createEmpty());

  const filtered = equipamentos.filter((e) => {
    const matchSearch = !search || e.serial.toLowerCase().includes(search.toLowerCase()) || e.produto.toLowerCase().includes(search.toLowerCase()) || e.cliente.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCreate = () => {
    setEditingId(null);
    setFormData(createEmpty());
    setSheetOpen(true);
  };

  const openEdit = (e: Equipamento) => {
    setEditingId(e.id);
    setFormData({ serial: e.serial, produto: e.produto, cliente: e.cliente, veiculo: e.veiculo, status: e.status, dataInstalacao: e.dataInstalacao });
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (!formData.serial.trim()) {
      toast.error("Informe o número de série do equipamento.");
      return;
    }
    const serialUp = formData.serial.trim().toUpperCase();
    if (editingId === null) {
      const exists = equipamentos.some((e) => e.serial.toUpperCase() === serialUp);
      if (exists) {
        toast.error("Já existe um equipamento com esse número de série.");
        return;
      }
    }
    const isInstalado = formData.status === "Instalado";
    const dataInst = isInstalado
      ? (formData.dataInstalacao || todayStr())
      : formData.dataInstalacao || "-";
    const clienteVal = formData.cliente.trim() || "-";
    const veiculoVal = formData.veiculo.trim().toUpperCase() || "-";

    if (editingId !== null) {
      setEquipamentos((prev) => prev.map((e) => e.id === editingId ? { ...e, ...formData, serial: serialUp, cliente: clienteVal, veiculo: veiculoVal, dataInstalacao: dataInst } : e));
      toast.success("Equipamento atualizado com sucesso.");
    } else {
      const nextId = Math.max(0, ...equipamentos.map((e) => e.id)) + 1;
      setEquipamentos((prev) => [...prev, { id: nextId, ...formData, serial: serialUp, cliente: clienteVal, veiculo: veiculoVal, dataInstalacao: dataInst }]);
      toast.success("Equipamento incluído com sucesso.");
    }
    setSheetOpen(false);
  };

  const set = (partial: Partial<typeof formData>) => setFormData((prev) => ({ ...prev, ...partial }));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Equipamentos</h1>
        <Button onClick={openCreate} className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
          <Plus size={16} /> Incluir
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar serial, produto ou cliente..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {statusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Serial</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Data Instalação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum equipamento encontrado.</TableCell>
              </TableRow>
            )}
            {filtered.map((e, i) => (
              <TableRow key={e.id} className={cn(i % 2 === 0 && "bg-muted/20")}>
                <TableCell className="font-mono font-medium">{e.serial}</TableCell>
                <TableCell>{e.produto}</TableCell>
                <TableCell>{e.cliente}</TableCell>
                <TableCell className="font-mono">{e.veiculo}</TableCell>
                <TableCell>{e.dataInstalacao}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(statusBadgeBase, statusColor[e.status])}>{e.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(e)}>
                    <Edit size={14} className="text-primary" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full max-w-md flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>{editingId !== null ? "Editar Equipamento" : "Novo Equipamento"}</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nº Série *</Label>
                <Input
                  value={formData.serial}
                  onChange={(e) => set({ serial: e.target.value })}
                  placeholder="Ex: TJ-2024-099"
                  disabled={editingId !== null}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Produto</Label>
                <Select value={formData.produto} onValueChange={(v) => set({ produto: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {produtoOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => set({ status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Cliente</Label>
                <Input value={formData.cliente === "-" ? "" : formData.cliente} onChange={(e) => set({ cliente: e.target.value })} placeholder="Nome do cliente" />
              </div>
              <div className="space-y-1.5">
                <Label>Veículo (placa)</Label>
                <Input value={formData.veiculo === "-" ? "" : formData.veiculo} onChange={(e) => set({ veiculo: e.target.value.toUpperCase() })} placeholder="Ex: ABC1234" />
              </div>
              <div className="space-y-1.5">
                <Label>Data de Instalação</Label>
                <Input type="date" value={formData.dataInstalacao && formData.dataInstalacao !== "-" ? formData.dataInstalacao.split("/").reverse().join("-") : ""} onChange={(e) => {
                  if (!e.target.value) { set({ dataInstalacao: "" }); return; }
                  const [y, m, d] = e.target.value.split("-");
                  set({ dataInstalacao: `${d}/${m}/${y}` });
                }} />
              </div>
            </div>
          </ScrollArea>
          <div className="border-t px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">Salvar</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
