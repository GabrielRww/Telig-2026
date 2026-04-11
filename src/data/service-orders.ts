import { useSyncExternalStore } from "react";
import { normalizeSearch } from "@/lib/search";

const SERVICE_ORDERS_STORAGE_KEY = "telig.serviceOrders";

export interface ServiceOrderEquipment {
  serial: string;
  produto: string;
  acao: string;
}

export interface ServiceOrderExpense {
  descricao: string;
  valor: string;
}

export type ServiceOrderSchedulingStatus =
  | "AGUARDANDO ENVIO CONTRATO"
  | "AGUARDANDO ASSINATURA CONTRATO"
  | "AGUARDANDO AGENDAMENTO"
  | "AGUARDANDO REAGENDAMENTO"
  | "AGUARDANDO EQUIPAMENTO"
  | "AGUARDANDO CLIENTE"
  | "AGUARDANDO TÉCNICO"
  | "AGENDADA"
  | "FINALIZADA";

export type ServiceOrderStatus =
  | "Em agendamento"
  | "Agendada"
  | "Em reagendamento"
  | "Aguardando agendamento"
  | "Em atendimento"
  | "Em execução"
  | "Finalizada"
  | "Validada"
  | "Faturada"
  | "Cancelada"
  | "Estoque";

export interface ServiceOrderRecord {
  id: number;
  pedido: string;
  tipo: string;
  tecnico: string;
  veiculo: string;
  cliente: string;
  empresa: string;
  abertura: string;
  realizacao: string;
  total: string;
  valorTecnico: string;
  valorCliente: string;
  status: ServiceOrderStatus;
  defeitoRelatado: string;
  defeitoConstatado: string;
  observacao: string;
  responsavel: string;
  cargo: string;
  uf: string;
  cidade: string;
  endereco: string;
  agendamentoStatus: ServiceOrderSchedulingStatus | "";
  equipamentos: ServiceOrderEquipment[];
  despesas: ServiceOrderExpense[];
  agendamentoData: string;
  agendamentoHora: string;
  agendamentoObservacao: string;
  agendamentoRetornoAt: string;
}

export interface ServiceOrderFormPayload {
  tipo: string;
  dataAbertura: string;
  cliente: string;
  empresaFaturamento: string;
  tecnico: string;
  veiculo: string;
  dataRealizacao: string;
  valorTecnico: string;
  valorCliente: string;
  status: ServiceOrderStatus | "";
  defeitoRelatado: string;
  defeitoConstatado: string;
  observacao: string;
  responsavel: string;
  cargo: string;
  uf: string;
  cidade: string;
  endereco: string;
  agendamentoStatus: ServiceOrderSchedulingStatus | "";
  agendamentoData: string;
  agendamentoHora: string;
  agendamentoObservacao: string;
  equipamentos: ServiceOrderEquipment[];
  despesas: ServiceOrderExpense[];
}

export const serviceOrderStatusOptions: Array<{ value: ServiceOrderStatus; label: string }> = [
  { value: "Em agendamento", label: "Em agendamento" },
  { value: "Agendada", label: "Agendada" },
  { value: "Em reagendamento", label: "Em reagendamento" },
  { value: "Aguardando agendamento", label: "Aguardando agendamento" },
  { value: "Em atendimento", label: "Em atendimento" },
  { value: "Em execução", label: "Em execução" },
  { value: "Finalizada", label: "Finalizada" },
  { value: "Validada", label: "Validada" },
  { value: "Faturada", label: "Faturada" },
  { value: "Cancelada", label: "Cancelada" },
  { value: "Estoque", label: "Estoque" },
];

const serviceOrderStatusValueSet = new Set<ServiceOrderStatus>(serviceOrderStatusOptions.map((option) => option.value));

export const serviceOrderTypeLabels: Record<string, string> = {
  INSTALACAO: "Instalação",
  RETIRADA: "Retirada",
  MANUTENCAO: "Manutenção",
  REINSTALACAO: "Reinstalação",
  SOCORRO_TECNICO: "Socorro Técnico",
  TRANSFERENCIA: "Transferência",
  AGENDAMENTO_MANUTENCAO: "Agend. Manutenção",
};

export const serviceOrderStatusColorMap: Record<string, string> = {
  "Em agendamento": "bg-yellow-100 text-yellow-800",
  "Agendada": "bg-sky-100 text-sky-800",
  "Em reagendamento": "bg-amber-100 text-amber-800",
  "Aguardando agendamento": "bg-orange-100 text-orange-800",
  "Em atendimento": "bg-purple-100 text-purple-800",
  "Em execução": "bg-indigo-100 text-indigo-800",
  "Finalizada": "bg-green-100 text-green-800",
  "Validada": "bg-emerald-100 text-emerald-800",
  "Faturada": "bg-gray-100 text-gray-800",
  "Cancelada": "bg-red-100 text-red-800",
  "Estoque": "bg-slate-100 text-slate-700",
};

export const serviceOrderBillingMarkupRate = 0.38;

export function formatCurrencyBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(value) ? value : 0);
}

export function parseCurrencyValue(value: string) {
  const normalizedValue = value.replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const parsedValue = Number.parseFloat(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function calculateCustomerValue(technicalValue: string) {
  const parsedTechnicalValue = parseCurrencyValue(technicalValue);
  if (!parsedTechnicalValue) {
    return "";
  }

  return formatCurrencyBRL(parsedTechnicalValue * (1 + serviceOrderBillingMarkupRate));
}

export function currencyValueToInputValue(value: string) {
  if (!value) {
    return "";
  }

  return parseCurrencyValue(value).toFixed(2);
}

function makeFinancialValues(technicalValue: number) {
  return {
    valorTecnico: formatCurrencyBRL(technicalValue),
    valorCliente: formatCurrencyBRL(technicalValue * (1 + serviceOrderBillingMarkupRate)),
  };
}

export const serviceOrderSchedulingStatusOptions: Array<{ value: ServiceOrderSchedulingStatus; label: string }> = [
  { value: "AGUARDANDO ENVIO CONTRATO", label: "AGUARDANDO ENVIO CONTRATO" },
  { value: "AGUARDANDO ASSINATURA CONTRATO", label: "AGUARDANDO ASSINATURA CONTRATO" },
  { value: "AGUARDANDO AGENDAMENTO", label: "AGUARDANDO AGENDAMENTO" },
  { value: "AGUARDANDO REAGENDAMENTO", label: "AGUARDANDO REAGENDAMENTO" },
  { value: "AGUARDANDO EQUIPAMENTO", label: "AGUARDANDO EQUIPAMENTO" },
  { value: "AGUARDANDO CLIENTE", label: "AGUARDANDO CLIENTE" },
  { value: "AGUARDANDO TÉCNICO", label: "AGUARDANDO TÉCNICO" },
  { value: "AGENDADA", label: "AGENDADA" },
  { value: "FINALIZADA", label: "FINALIZADA" },
];

const serviceOrderSchedulingStatusValueSet = new Set<ServiceOrderSchedulingStatus>(
  serviceOrderSchedulingStatusOptions.map((option) => option.value)
);

export const serviceOrderSchedulingStatusColorMap: Record<string, string> = {
  "AGUARDANDO ENVIO CONTRATO": "bg-slate-100 text-slate-800",
  "AGUARDANDO ASSINATURA CONTRATO": "bg-slate-100 text-slate-800",
  "AGUARDANDO AGENDAMENTO": "bg-amber-100 text-amber-800",
  "AGUARDANDO REAGENDAMENTO": "bg-orange-100 text-orange-800",
  "AGUARDANDO EQUIPAMENTO": "bg-yellow-100 text-yellow-800",
  "AGUARDANDO CLIENTE": "bg-cyan-100 text-cyan-800",
  "AGUARDANDO TÉCNICO": "bg-purple-100 text-purple-800",
  "AGENDADA": "bg-blue-100 text-blue-800",
  "FINALIZADA": "bg-green-100 text-green-800",
};

const seedOrders: ServiceOrderRecord[] = [
  {
    id: 188432,
    pedido: "PED-2024-3421",
    tipo: "INSTALACAO",
    tecnico: "Carlos Silva",
    veiculo: "ABC1234",
    cliente: "Volare Segurança",
    empresa: "Volare Segurança",
    abertura: "04/04/2026",
    realizacao: "05/04/2026",
    total: "R$ 450,00",
    ...makeFinancialValues(326.09),
    status: "Em agendamento",
    defeitoRelatado: "Instalação de rastreador 4G",
    defeitoConstatado: "N/A",
    observacao: "Cliente solicitou instalação urgente",
    responsavel: "",
    cargo: "",
    uf: "",
    cidade: "",
    endereco: "",
    agendamentoStatus: "AGENDADA",
    equipamentos: [{ serial: "TJ-2024-001", produto: "TJammer 4G", acao: "Instalação" }],
    despesas: [{ descricao: "Deslocamento", valor: "R$ 50,00" }],
    agendamentoData: "",
    agendamentoHora: "",
    agendamentoObservacao: "",
    agendamentoRetornoAt: "",
  },
  {
    id: 188431,
    pedido: "PED-2024-3420",
    tipo: "RETIRADA",
    tecnico: "João Santos",
    veiculo: "XYZ5678",
    cliente: "Tracker Brasil",
    empresa: "Tracker Brasil",
    abertura: "04/04/2026",
    realizacao: "-",
    total: "R$ 200,00",
    ...makeFinancialValues(144.93),
    status: "Aguardando agendamento",
    defeitoRelatado: "Retirada por cancelamento",
    defeitoConstatado: "Equipamento em bom estado",
    observacao: "Aguardando retorno do cliente para confirmação.",
    responsavel: "",
    cargo: "",
    uf: "",
    cidade: "",
    endereco: "",
    agendamentoStatus: "AGUARDANDO AGENDAMENTO",
    equipamentos: [{ serial: "TJ-2023-145", produto: "TBlock", acao: "Retirada" }],
    despesas: [],
    agendamentoData: "2026-04-12",
    agendamentoHora: "09:30",
    agendamentoObservacao: "Retornar contato com o cliente para confirmar a retirada.",
    agendamentoRetornoAt: toIsoLocal("2026-04-12", "09:30"),
  },
  {
    id: 188430,
    pedido: "PED-2024-3419",
    tipo: "MANUTENCAO",
    tecnico: "Pedro Lima",
    veiculo: "DEF9012",
    cliente: "LogSafe",
    empresa: "LogSafe",
    abertura: "03/04/2026",
    realizacao: "04/04/2026",
    total: "R$ 320,00",
    ...makeFinancialValues(231.88),
    status: "Em execução",
    defeitoRelatado: "Equipamento sem sinal",
    defeitoConstatado: "Antena danificada",
    observacao: "Substituição de antena realizada",
    responsavel: "",
    cargo: "",
    uf: "",
    cidade: "",
    endereco: "",
    agendamentoStatus: "AGENDADA",
    equipamentos: [{ serial: "TJ-2023-089", produto: "Rastreador 4G", acao: "Manutenção" }],
    despesas: [{ descricao: "Antena substituta", valor: "R$ 45,00" }],
    agendamentoData: "",
    agendamentoHora: "",
    agendamentoObservacao: "",
    agendamentoRetornoAt: "",
  },
  {
    id: 188429,
    pedido: "PED-2024-3418",
    tipo: "REINSTALACAO",
    tecnico: "Ana Costa",
    veiculo: "GHI3456",
    cliente: "TransGuarda",
    empresa: "TransGuarda",
    abertura: "03/04/2026",
    realizacao: "04/04/2026",
    total: "R$ 580,00",
    ...makeFinancialValues(420.29),
    status: "Finalizada",
    defeitoRelatado: "Reinstalação após troca de veículo",
    defeitoConstatado: "N/A",
    observacao: "",
    responsavel: "",
    cargo: "",
    uf: "",
    cidade: "",
    endereco: "",
    agendamentoStatus: "FINALIZADA",
    equipamentos: [{ serial: "TJ-2024-012", produto: "TJammer 4G", acao: "Reinstalação" }],
    despesas: [],
    agendamentoData: "",
    agendamentoHora: "",
    agendamentoObservacao: "",
    agendamentoRetornoAt: "",
  },
  {
    id: 188428,
    pedido: "PED-2024-3417",
    tipo: "INSTALACAO",
    tecnico: "Carlos Silva",
    veiculo: "JKL7890",
    cliente: "FleetShield",
    empresa: "FleetShield",
    abertura: "02/04/2026",
    realizacao: "03/04/2026",
    total: "R$ 450,00",
    ...makeFinancialValues(326.09),
    status: "Validada",
    defeitoRelatado: "Instalação padrão",
    defeitoConstatado: "N/A",
    observacao: "Instalação concluída sem problemas",
    responsavel: "",
    cargo: "",
    uf: "",
    cidade: "",
    endereco: "",
    agendamentoStatus: "AGUARDANDO TÉCNICO",
    equipamentos: [
      { serial: "TJ-2024-055", produto: "TBlock", acao: "Instalação" },
      { serial: "TJ-2024-056", produto: "Rastreador 4G", acao: "Instalação" },
    ],
    despesas: [{ descricao: "Material extra", valor: "R$ 30,00" }],
    agendamentoData: "",
    agendamentoHora: "",
    agendamentoObservacao: "",
    agendamentoRetornoAt: "",
  },
  {
    id: 188427,
    pedido: "PED-2024-3416",
    tipo: "SOCORRO_TECNICO",
    tecnico: "João Santos",
    veiculo: "MNO1234",
    cliente: "Volare Segurança",
    empresa: "Volare Segurança",
    abertura: "02/04/2026",
    realizacao: "02/04/2026",
    total: "R$ 150,00",
    ...makeFinancialValues(108.70),
    status: "Em atendimento",
    defeitoRelatado: "Veículo não responde ao comando",
    defeitoConstatado: "Falha na comunicação do módulo",
    observacao: "Reset do módulo realizado",
    responsavel: "",
    cargo: "",
    uf: "",
    cidade: "",
    endereco: "",
    agendamentoStatus: "AGUARDANDO CLIENTE",
    equipamentos: [{ serial: "TJ-2022-200", produto: "TJammer 4G", acao: "Manutenção" }],
    despesas: [],
    agendamentoData: "",
    agendamentoHora: "",
    agendamentoObservacao: "",
    agendamentoRetornoAt: "",
  },
  {
    id: 188426,
    pedido: "PED-2024-3415",
    tipo: "RETIRADA",
    tecnico: "Pedro Lima",
    veiculo: "PQR-5678",
    cliente: "Tracker Brasil",
    empresa: "Tracker Brasil",
    abertura: "01/04/2026",
    realizacao: "-",
    total: "R$ 200,00",
    ...makeFinancialValues(144.93),
    status: "Cancelada",
    defeitoRelatado: "Retirada não autorizada",
    defeitoConstatado: "Solicitação cancelada pelo cliente",
    observacao: "Cancelada em definitivo.",
    responsavel: "",
    cargo: "",
    uf: "",
    cidade: "",
    endereco: "",
    agendamentoStatus: "AGUARDANDO ENVIO CONTRATO",
    equipamentos: [],
    despesas: [],
    agendamentoData: "",
    agendamentoHora: "",
    agendamentoObservacao: "",
    agendamentoRetornoAt: "",
  },
  {
    id: 188425,
    pedido: "PED-2024-3414",
    tipo: "TRANSFERENCIA",
    tecnico: "Ana Costa",
    veiculo: "STU-9012",
    cliente: "LogSafe",
    empresa: "LogSafe",
    abertura: "01/04/2026",
    realizacao: "02/04/2026",
    total: "R$ 380,00",
    ...makeFinancialValues(275.36),
    status: "Aguardando agendamento",
    defeitoRelatado: "Transferência entre veículos",
    defeitoConstatado: "Aguardando retorno do cliente",
    observacao: "Pendente confirmação final.",
    responsavel: "",
    cargo: "",
    uf: "",
    cidade: "",
    endereco: "",
    agendamentoStatus: "AGUARDANDO REAGENDAMENTO",
    equipamentos: [{ serial: "TJ-2024-070", produto: "TBlock Pro", acao: "Transferência" }],
    despesas: [],
    agendamentoData: "2026-04-13",
    agendamentoHora: "14:00",
    agendamentoObservacao: "Retornar com o cliente para confirmar a agenda.",
    agendamentoRetornoAt: toIsoLocal("2026-04-13", "14:00"),
  },
];

let serviceOrders: ServiceOrderRecord[] = readStoredOrders(SERVICE_ORDERS_STORAGE_KEY, seedOrders).map((order) =>
  sanitizeOrder(syncSchedulingFields(order as ServiceOrderRecord))
);
const listeners = new Set<() => void>();
let schedulerStarted = false;

function readStoredOrders<T>(storageKey: string, fallbackValue: T): T {
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey);
    if (!storedValue) {
      return fallbackValue;
    }

    const parsedValue = JSON.parse(storedValue) as T;
    return Array.isArray(parsedValue) ? parsedValue : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function toIsoLocal(dateValue: string, timeValue: string) {
  if (!dateValue || !timeValue) {
    return "";
  }

  const nextDate = new Date(`${dateValue}T${timeValue}:00`);
  return Number.isNaN(nextDate.getTime()) ? "" : nextDate.toISOString();
}

function normalizeServiceOrderStatus(value: string | undefined) {
  return value && serviceOrderStatusValueSet.has(value as ServiceOrderStatus)
    ? (value as ServiceOrderStatus)
    : "Em agendamento";
}

function normalizeServiceOrderSchedulingStatus(value: string | undefined) {
  return value && serviceOrderSchedulingStatusValueSet.has(value as ServiceOrderSchedulingStatus)
    ? (value as ServiceOrderSchedulingStatus)
    : "";
}

function syncSchedulingFields(order: Partial<ServiceOrderRecord>): ServiceOrderRecord {
  const agendamentoRetornoAt = toIsoLocal(order.agendamentoData ?? "", order.agendamentoHora ?? "");

  return {
    ...order,
    id: order.id ?? 0,
    pedido: order.pedido ?? "",
    tipo: order.tipo ?? "",
    tecnico: order.tecnico ?? "",
    veiculo: order.veiculo ?? "",
    cliente: order.cliente ?? "",
    empresa: order.empresa ?? "",
    abertura: order.abertura ?? "",
    realizacao: order.realizacao ?? "",
    total: order.total ?? "",
    valorTecnico: order.valorTecnico ?? "",
    valorCliente: order.valorCliente ?? "",
    status: normalizeServiceOrderStatus(order.status),
    defeitoRelatado: order.defeitoRelatado ?? "",
    defeitoConstatado: order.defeitoConstatado ?? "",
    observacao: order.observacao ?? "",
    responsavel: order.responsavel ?? "",
    cargo: order.cargo ?? "",
    uf: order.uf ?? "",
    cidade: order.cidade ?? "",
    endereco: order.endereco ?? "",
    agendamentoStatus: normalizeServiceOrderSchedulingStatus(order.agendamentoStatus),
    equipamentos: order.equipamentos ?? [],
    despesas: order.despesas ?? [],
    agendamentoData: order.agendamentoData ?? "",
    agendamentoHora: order.agendamentoHora ?? "",
    agendamentoObservacao: order.agendamentoObservacao ?? "",
    agendamentoRetornoAt,
  };
}

function sanitizeOrder(order: ServiceOrderRecord): ServiceOrderRecord {
  return {
    ...order,
    pedido: (order.pedido ?? "").trim(),
    tipo: (order.tipo ?? "").trim(),
    tecnico: (order.tecnico ?? "").trim(),
    veiculo: (order.veiculo ?? "").replace(/\s+/g, "").toUpperCase(),
    cliente: (order.cliente ?? "").trim(),
    empresa: (order.empresa ?? "").trim(),
    abertura: (order.abertura ?? "").trim(),
    realizacao: (order.realizacao ?? "").trim(),
    total: (order.total ?? "").trim(),
    valorTecnico: (order.valorTecnico ?? "").trim(),
    valorCliente: (order.valorCliente ?? "").trim(),
    status: normalizeServiceOrderStatus(order.status),
    defeitoRelatado: (order.defeitoRelatado ?? "").trim(),
    defeitoConstatado: (order.defeitoConstatado ?? "").trim(),
    observacao: (order.observacao ?? "").trim(),
    responsavel: (order.responsavel ?? "").trim(),
    cargo: (order.cargo ?? "").trim(),
    uf: (order.uf ?? "").trim(),
    cidade: (order.cidade ?? "").trim(),
    endereco: (order.endereco ?? "").trim(),
    agendamentoStatus: normalizeServiceOrderSchedulingStatus(order.agendamentoStatus),
    agendamentoData: (order.agendamentoData ?? "").trim(),
    agendamentoHora: (order.agendamentoHora ?? "").trim(),
    agendamentoObservacao: (order.agendamentoObservacao ?? "").trim(),
    equipamentos: (order.equipamentos ?? []).map((equipment) => ({
      serial: (equipment.serial ?? "").trim(),
      produto: (equipment.produto ?? "").trim(),
      acao: (equipment.acao ?? "").trim(),
    })),
    despesas: (order.despesas ?? []).map((expense) => ({
      descricao: (expense.descricao ?? "").trim(),
      valor: (expense.valor ?? "").trim(),
    })),
    agendamentoRetornoAt: (order.agendamentoRetornoAt ?? "") || toIsoLocal(order.agendamentoData ?? "", order.agendamentoHora ?? ""),
  };
}

function persistServiceOrders() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SERVICE_ORDERS_STORAGE_KEY, JSON.stringify(serviceOrders));
}

function emitServiceOrderChange() {
  persistServiceOrders();
  listeners.forEach((listener) => listener());
}

function parseFollowUpTimestamp(order: ServiceOrderRecord) {
  if (order.agendamentoRetornoAt) {
    const parsedValue = new Date(order.agendamentoRetornoAt).getTime();
    return Number.isNaN(parsedValue) ? null : parsedValue;
  }

  if (!order.agendamentoData || !order.agendamentoHora) {
    return null;
  }

  const parsedValue = new Date(`${order.agendamentoData}T${order.agendamentoHora}:00`).getTime();
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function shouldAutoReopen(order: ServiceOrderRecord) {
  if (order.status !== "Aguardando agendamento") {
    return false;
  }

  if (["Finalizada", "Validada", "Cancelada"].includes(order.status)) {
    return false;
  }

  const followUpAt = parseFollowUpTimestamp(order);
  return followUpAt !== null && Date.now() >= followUpAt;
}

function reconcileServiceOrders() {
  let changed = false;

  serviceOrders = serviceOrders.map((order) => {
    if (!shouldAutoReopen(order)) {
      return order;
    }

    changed = true;
    return {
      ...order,
      status: "Em agendamento",
    };
  });

  if (changed) {
    emitServiceOrderChange();
  }
}

function ensureScheduler() {
  if (typeof window === "undefined" || schedulerStarted) {
    return;
  }

  schedulerStarted = true;
  window.setInterval(reconcileServiceOrders, 30000);
}

ensureScheduler();

function normalizeOrderSearch(value: string) {
  return normalizeSearch(value);
}

function getHighestServiceOrderId() {
  return Math.max(0, ...serviceOrders.map((order) => order.id));
}

export function subscribeServiceOrderStore(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useServiceOrders() {
  return useSyncExternalStore(subscribeServiceOrderStore, () => serviceOrders, () => serviceOrders);
}

export function getServiceOrders() {
  return serviceOrders;
}

export function getNextServiceOrderId() {
  return getHighestServiceOrderId() + 1;
}

export function createServiceOrderCode(orderId: number) {
  const year = new Date().getFullYear();
  return `PED-${year}-${String(orderId).padStart(4, "0")}`;
}

export function formatServiceOrderDate(value: string) {
  if (!value) {
    return "";
  }

  if (value.includes("/")) {
    return value;
  }

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

export function upsertServiceOrder(order: ServiceOrderRecord) {
  const nextOrder = sanitizeOrder(syncSchedulingFields(order));
  const existingIndex = serviceOrders.findIndex((currentOrder) => currentOrder.id === nextOrder.id || currentOrder.pedido === nextOrder.pedido);

  if (existingIndex >= 0) {
    const nextOrders = [...serviceOrders];
    nextOrders[existingIndex] = nextOrder;
    serviceOrders = nextOrders;
  } else {
    serviceOrders = [nextOrder, ...serviceOrders];
  }

  emitServiceOrderChange();
  return nextOrder;
}

export function normalizeServiceOrderSearch(value: string) {
  return normalizeOrderSearch(value);
}
