import { useSyncExternalStore } from "react";
import { parseCurrencyValue, formatCurrencyBRL, type ServiceOrderRecord } from "./service-orders";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type NFStatus = "Pendente" | "Emitida" | "Cancelada";
export type ContaReceberStatus = "Em aberto" | "Pago parcial" | "Pago total" | "Vencido";
export type ContaPagarStatus = "Pendente" | "Aprovado" | "Pago";

export interface NotaFiscal {
  id: string;
  osId: number;
  osPedido: string;
  cliente: string;
  dataEmissao: string;
  dataVencimento: string;
  valor: number;
  discriminacao: string;
  status: NFStatus;
  statusPagamento: ContaReceberStatus;
  valorPago: number;
  dataPagamento: string;
  observacao: string;
}

export interface ContaPagar {
  id: string;
  osId: number;
  osPedido: string;
  tecnico: string;
  descricao: string;
  valor: number;
  tipo: "tecnico" | "despesa";
  status: ContaPagarStatus;
  dataPagamento: string;
  observacao: string;
  criadoEm: string;
}

// ─── Store NFs ────────────────────────────────────────────────────────────────

const NF_STORAGE_KEY = "telig.notasFiscais";
const CP_STORAGE_KEY = "telig.contasPagar";

function readStorage<T>(key: string, fallback: T): T {
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

let notasFiscais: NotaFiscal[] = readStorage<NotaFiscal[]>(NF_STORAGE_KEY, []);
let contasPagar: ContaPagar[] = readStorage<ContaPagar[]>(CP_STORAGE_KEY, []);
const nfListeners = new Set<() => void>();
const cpListeners = new Set<() => void>();

function persistNFs() { window.localStorage.setItem(NF_STORAGE_KEY, JSON.stringify(notasFiscais)); }
function persistCPs() { window.localStorage.setItem(CP_STORAGE_KEY, JSON.stringify(contasPagar)); }

function emitNF() { persistNFs(); nfListeners.forEach((l) => l()); }
function emitCP() { persistCPs(); cpListeners.forEach((l) => l()); }

// ─── NFs ─────────────────────────────────────────────────────────────────────

export function subscribeNFs(l: () => void) { nfListeners.add(l); return () => nfListeners.delete(l); }
export function useNotasFiscais() {
  return useSyncExternalStore(subscribeNFs, () => notasFiscais, () => notasFiscais);
}

export function criarNFdaOS(order: ServiceOrderRecord): NotaFiscal {
  const hoje = new Date().toISOString().split("T")[0];
  const vencimento = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const nf: NotaFiscal = {
    id: `NF-${Date.now()}`,
    osId: order.id,
    osPedido: order.pedido,
    cliente: order.cliente,
    dataEmissao: hoje,
    dataVencimento: vencimento,
    valor: parseCurrencyValue(order.valorCliente),
    discriminacao: `OS ${order.pedido} — ${order.tipo} — ${order.defeitoRelatado || "Serviço técnico"}`,
    status: "Pendente",
    statusPagamento: "Em aberto",
    valorPago: 0,
    dataPagamento: "",
    observacao: "",
  };
  notasFiscais = [nf, ...notasFiscais];
  emitNF();
  return nf;
}

export function atualizarNF(id: string, partial: Partial<NotaFiscal>) {
  notasFiscais = notasFiscais.map((nf) => nf.id === id ? { ...nf, ...partial } : nf);
  emitNF();
}

export function getNFporOS(osId: number) {
  return notasFiscais.find((nf) => nf.osId === osId);
}

// ─── Contas a Pagar ───────────────────────────────────────────────────────────

export function subscribeCPs(l: () => void) { cpListeners.add(l); return () => cpListeners.delete(l); }
export function useContasPagar() {
  return useSyncExternalStore(subscribeCPs, () => contasPagar, () => contasPagar);
}

export function gerarContasPagarDaOS(order: ServiceOrderRecord) {
  const jaExiste = contasPagar.some((cp) => cp.osId === order.id && cp.tipo === "tecnico");
  if (jaExiste) return;

  const hoje = new Date().toISOString().split("T")[0];
  const valorTecnico = parseCurrencyValue(order.valorTecnico);

  const novas: ContaPagar[] = [];

  if (valorTecnico > 0 && order.tecnico) {
    novas.push({
      id: `CP-TEC-${order.id}-${Date.now()}`,
      osId: order.id,
      osPedido: order.pedido,
      tecnico: order.tecnico,
      descricao: `Pagamento técnico — OS ${order.pedido}`,
      valor: valorTecnico,
      tipo: "tecnico",
      status: "Pendente",
      dataPagamento: "",
      observacao: "",
      criadoEm: hoje,
    });
  }

  order.despesas.forEach((d, i) => {
    const v = parseCurrencyValue(d.valor);
    if (v > 0) {
      novas.push({
        id: `CP-DESP-${order.id}-${i}-${Date.now()}`,
        osId: order.id,
        osPedido: order.pedido,
        tecnico: order.tecnico,
        descricao: d.descricao,
        valor: v,
        tipo: "despesa",
        status: "Pendente",
        dataPagamento: "",
        observacao: "",
        criadoEm: hoje,
      });
    }
  });

  contasPagar = [...novas, ...contasPagar];
  emitCP();
}

export function atualizarContaPagar(id: string, partial: Partial<ContaPagar>) {
  contasPagar = contasPagar.map((cp) => cp.id === id ? { ...cp, ...partial } : cp);
  emitCP();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export { formatCurrencyBRL, parseCurrencyValue };

export function formatDate(iso: string) {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function isVencida(dataVencimento: string, status: ContaReceberStatus) {
  if (status === "Pago total") return false;
  return new Date(dataVencimento) < new Date();
}
