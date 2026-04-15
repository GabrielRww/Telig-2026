import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactElement } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ServiceOrderFormData from "./ServiceOrderFormData";
import ServiceOrderFormAgendamento from "./ServiceOrderFormAgendamento";
import ServiceOrderFormEquipamentos from "./ServiceOrderFormEquipamentos";
import ServiceOrderFormDespesas from "./ServiceOrderFormDespesas";
import ServiceOrderFormFaturamento from "./ServiceOrderFormFaturamento";
import { toast } from "sonner";
import { removeVehicleByPlate } from "@/data/veiculos";
import {
  calculateCustomerValue,
  createServiceOrderCode,
  currencyValueToInputValue,
  formatServiceOrderDate,
  formatCurrencyBRL,
  getNextServiceOrderId,
  parseCurrencyValue,
  type ServiceOrderRecord,
  type ServiceOrderFormPayload,
  type ServiceOrderStatus,
  upsertServiceOrder,
} from "@/data/service-orders";
import { isSAPConfigured } from "@/integrations/sap/client";
import { createSAPServiceCall, updateSAPServiceCall } from "@/integrations/sap/serviceCalls";
import { createSAPInvoice } from "@/integrations/sap/invoices";

const createBlankFormData = (): ServiceOrderFormPayload => ({
  tipo: "",
  dataAbertura: new Date().toISOString().split("T")[0],
  cliente: "",
  empresaFaturamento: "",
  tecnico: "",
  veiculo: "",
  dataRealizacao: "",
  valorTecnico: "",
  valorCliente: "",
  status: "",
  defeitoRelatado: "",
  defeitoConstatado: "",
  observacao: "",
  responsavel: "",
  cargo: "",
  uf: "",
  cidade: "",
  endereco: "",
  agendamentoStatus: "",
  agendamentoData: "",
  agendamentoHora: "",
  agendamentoObservacao: "",
  equipamentos: [],
  despesas: [],
});

const buildFormDataFromOrder = (order?: ServiceOrderRecord): ServiceOrderFormPayload => {
  if (!order) {
    return createBlankFormData();
  }

  const valorTecnico = currencyValueToInputValue(order.valorTecnico);

  return {
    tipo: order.tipo,
    dataAbertura: order.abertura.includes("/") ? order.abertura.split("/").reverse().join("-") : order.abertura,
    cliente: order.cliente,
    empresaFaturamento: order.empresa,
    tecnico: order.tecnico,
    veiculo: order.veiculo,
    dataRealizacao: order.realizacao.includes("/") ? order.realizacao.split("/").reverse().join("-") : order.realizacao,
    valorTecnico,
    valorCliente: order.valorCliente || calculateCustomerValue(valorTecnico),
    status: order.status,
    defeitoRelatado: order.defeitoRelatado,
    defeitoConstatado: order.defeitoConstatado,
    observacao: order.observacao,
    responsavel: order.responsavel,
    cargo: order.cargo,
    uf: order.uf,
    cidade: order.cidade,
    endereco: order.endereco,
    agendamentoStatus: order.agendamentoStatus,
    agendamentoData: order.agendamentoData,
    agendamentoHora: order.agendamentoHora,
    agendamentoObservacao: order.agendamentoObservacao,
    equipamentos: order.equipamentos ?? [],
    despesas: order.despesas ?? [],
  };
};

const DEFAULT_SHEET_WIDTH = 672;
const MIN_SHEET_WIDTH = 560;
const MAX_SHEET_WIDTH = 1180;
const SHEET_EDGE_GAP = 24;

interface Props {
  order?: ServiceOrderRecord;
  trigger?: ReactElement;
  onSaved?: (order: ServiceOrderRecord) => void;
}

export default function NewServiceOrderDialog({ order, trigger, onSaved }: Props) {
  const isEditing = Boolean(order);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(buildFormDataFromOrder(order));
  const [sheetWidth, setSheetWidth] = useState(DEFAULT_SHEET_WIDTH);
  const resizeOriginRef = useRef<{ startX: number; startWidth: number } | null>(null);

  useEffect(() => {
    if (!open || typeof window === "undefined") {
      return;
    }

    const clampToViewport = () => {
      const viewportLimit = Math.max(MIN_SHEET_WIDTH, window.innerWidth - SHEET_EDGE_GAP);
      setSheetWidth(Math.min(DEFAULT_SHEET_WIDTH, Math.min(MAX_SHEET_WIDTH, viewportLimit)));
    };

    clampToViewport();
    window.addEventListener("resize", clampToViewport);

    return () => window.removeEventListener("resize", clampToViewport);
  }, [open]);

  useEffect(() => {
    if (open) {
      setFormData(buildFormDataFromOrder(order));
    }
  }, [open, order]);

  const handleChange = (partial: Partial<ServiceOrderFormPayload>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const handleResizePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const startWidth = sheetWidth;
    const startX = event.clientX;

    resizeOriginRef.current = { startX, startWidth };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!resizeOriginRef.current) {
        return;
      }

      const viewportLimit = typeof window !== "undefined"
        ? Math.max(MIN_SHEET_WIDTH, window.innerWidth - SHEET_EDGE_GAP)
        : MAX_SHEET_WIDTH;
      const delta = resizeOriginRef.current.startX - moveEvent.clientX;
      const nextWidth = resizeOriginRef.current.startWidth + delta;

      setSheetWidth(Math.min(Math.max(nextWidth, MIN_SHEET_WIDTH), Math.min(MAX_SHEET_WIDTH, viewportLimit)));
    };

    const handlePointerUp = () => {
      resizeOriginRef.current = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
  };

  const handleSave = () => {
    if (!formData.tipo || !formData.cliente || !formData.empresaFaturamento || !formData.status) {
      toast.error("Preencha os campos obrigatórios: Tipo, Cliente, Empresa Faturamento e Status");
      return;
    }

    const selectedStatus = formData.status as ServiceOrderStatus;
    const requiresSchedule = ["Em reagendamento", "Aguardando agendamento"].includes(selectedStatus);

    if (requiresSchedule && (!formData.agendamentoData || !formData.agendamentoHora)) {
      toast.error("Informe a data e a hora do agendamento para esse status");
      return;
    }

    if (formData.tipo === "RETIRADA" && !formData.veiculo.trim()) {
      toast.error("Informe o veículo para registrar a ordem de retirada");
      return;
    }

    const requiresSchedulingFields = Boolean(
      formData.agendamentoStatus || formData.agendamentoData || formData.agendamentoHora || formData.agendamentoObservacao
    ) || ["Em reagendamento", "Aguardando agendamento"].includes(selectedStatus);

    if (requiresSchedulingFields && (!formData.agendamentoStatus || !formData.agendamentoData || !formData.agendamentoHora)) {
      toast.error("Preencha o status, a data e a hora do agendamento");
      return;
    }

    const orderId = order?.id ?? getNextServiceOrderId();
    const savedOrder = upsertServiceOrder({
      id: orderId,
      pedido: order?.pedido ?? createServiceOrderCode(orderId),
      tipo: formData.tipo,
      tecnico: formData.tecnico,
      veiculo: formData.veiculo.trim().toUpperCase(),
      cliente: formData.cliente,
      empresa: formData.empresaFaturamento,
      abertura: formatServiceOrderDate(formData.dataAbertura),
      realizacao: formatServiceOrderDate(formData.dataRealizacao) || "-",
      total: calculateCustomerValue(formData.valorTecnico) || "R$ 0,00",
      valorTecnico: formData.valorTecnico ? formatCurrencyBRL(parseCurrencyValue(formData.valorTecnico)) : "",
      valorCliente: calculateCustomerValue(formData.valorTecnico) || formData.valorCliente || "R$ 0,00",
      status: selectedStatus,
      defeitoRelatado: formData.defeitoRelatado,
      defeitoConstatado: formData.defeitoConstatado,
      observacao: formData.observacao,
      responsavel: formData.responsavel,
      cargo: formData.cargo,
      uf: formData.uf,
      cidade: formData.cidade,
      endereco: formData.endereco,
      agendamentoStatus: formData.agendamentoStatus,
      equipamentos: formData.equipamentos,
      despesas: formData.despesas,
      agendamentoData: formData.agendamentoData,
      agendamentoHora: formData.agendamentoHora,
      agendamentoObservacao: formData.agendamentoObservacao,
      agendamentoRetornoAt: "",
      sapServiceCallId: order?.sapServiceCallId,
    });

    // Sincronizar com SAP B1 (assíncrono, sem bloquear o fluxo)
    if (isSAPConfigured()) {
      (async () => {
        try {
          if (order?.sapServiceCallId) {
            await updateSAPServiceCall(order.sapServiceCallId, savedOrder);
          } else {
            const sapCallId = await createSAPServiceCall(savedOrder);
            upsertServiceOrder({ ...savedOrder, sapServiceCallId: sapCallId });
          }

          if (savedOrder.status === "Faturada") {
            await createSAPInvoice(savedOrder);
          }

          toast.success("OS sincronizada com SAP B1");
        } catch (err) {
          console.error("Erro ao sincronizar com SAP:", err);
          toast.warning("OS salva localmente. Sincronização com SAP pendente.");
        }
      })();
    }

    const vehicleWasRemoved = formData.tipo === "RETIRADA"
      ? removeVehicleByPlate(formData.veiculo, { osType: formData.tipo })
      : false;

    const actionLabel = isEditing ? "atualizada" : "criada";

    if (formData.tipo === "RETIRADA" && vehicleWasRemoved) {
      toast.success(`Ordem ${savedOrder.pedido} ${actionLabel} e veículo ${formData.veiculo} removido do sistema.`);
    } else if (formData.tipo === "RETIRADA") {
      toast.success(`Ordem ${savedOrder.pedido} ${actionLabel}, mas o veículo informado não estava no cadastro ativo.`);
    } else {
      toast.success(`Ordem ${savedOrder.pedido} ${actionLabel} com sucesso.`);
    }

    onSaved?.(savedOrder);
    setFormData(buildFormDataFromOrder(order));
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
            <Plus size={16} /> Incluir
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full max-w-none p-0 flex flex-col overflow-hidden"
        style={{ width: `${sheetWidth}px`, maxWidth: "none" }}
      >
        <div
          className="absolute left-0 top-0 z-20 h-full w-6 cursor-col-resize touch-none select-none border-r border-border/70 bg-muted/10 hover:bg-muted/25"
          onPointerDown={handleResizePointerDown}
          title="Arraste para redimensionar"
          aria-hidden="true"
        >
          <span className="absolute inset-y-0 right-0 w-px bg-border/70" />
          <span className="absolute left-1/2 top-1/2 h-16 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border/80" />
        </div>
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle className="text-xl">{isEditing ? "Editar ordem de serviço" : "Nova ordem de serviço"}</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="dados" className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-6 justify-start bg-muted/50">
            <TabsTrigger value="dados">Dados</TabsTrigger>
            <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
            <TabsTrigger value="despesas">Despesas</TabsTrigger>
            <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
            <TabsTrigger value="agendamento">Agendamento</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 px-6 pb-4">
            <div className="py-4">
              <TabsContent value="dados" className="mt-0">
                <ServiceOrderFormData formData={formData} onChange={handleChange} />
              </TabsContent>
              <TabsContent value="equipamentos" className="mt-0">
                <ServiceOrderFormEquipamentos
                  equipamentos={formData.equipamentos}
                  onChange={(equipamentos) => handleChange({ equipamentos })}
                />
              </TabsContent>
              <TabsContent value="despesas" className="mt-0">
                <ServiceOrderFormDespesas
                  despesas={formData.despesas}
                  onChange={(despesas) => handleChange({ despesas })}
                />
              </TabsContent>
              <TabsContent value="faturamento" className="mt-0">
                <ServiceOrderFormFaturamento formData={formData} onChange={handleChange} />
              </TabsContent>
              <TabsContent value="agendamento" className="mt-0">
                <ServiceOrderFormAgendamento formData={formData} onChange={handleChange} />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>

        <div className="border-t px-6 py-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">Salvar</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
