import { useSyncExternalStore } from "react";
import { adjustProdutoStock, getProdutos } from "./produtos";
import { validarCNPJ } from "@/lib/cpf";

const PEDIDOS_KEY = "telig.pedidosCompra";
const MOVIMENTACOES_KEY = "telig.movimentacoes";

export type StatusPedido = "rascunho" | "aguardando" | "parcial" | "recebido" | "cancelado";
export type TipoMovimentacao = "entrada" | "saida" | "ajuste" | "devolucao";
export type OrigemMovimentacao = "pedido_compra" | "ordem_servico" | "ajuste_manual" | "devolucao";

export interface PedidoItem {
  produtoId: number;
  produtoNome: string;
  produtoCodigo: string;
  quantidadePedida: number;
  quantidadeRecebida: number;
  precoUnitario: number;
}

export interface PedidoCompra {
  id: number;
  numeroPedido: string;
  fornecedorNome: string;
  fornecedorCnpj: string;
  vendedorId: number | null;
  status: StatusPedido;
  dataPedido: string;
  dataPrevisaoEntrega: string;
  dataRecebimento: string;
  desconto: number;
  frete: number;
  observacoes: string;
  itens: PedidoItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Movimentacao {
  id: number;
  produtoId: number;
  produtoNome: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  estoqueAnterior: number;
  estoquePosterior: number;
  origem: OrigemMovimentacao;
  referenciaId: string;
  observacao: string;
  createdAt: string;
}

export const statusPedidoLabels: Record<StatusPedido, string> = {
  rascunho: "Rascunho",
  aguardando: "Aguardando",
  parcial: "Parcial",
  recebido: "Recebido",
  cancelado: "Cancelado",
};

export const statusPedidoColors: Record<StatusPedido, string> = {
  rascunho: "border-slate-200 text-slate-600",
  aguardando: "border-amber-200 text-amber-700",
  parcial: "border-sky-200 text-sky-700",
  recebido: "border-emerald-200 text-emerald-700",
  cancelado: "border-rose-200 text-rose-700",
};

const seedPedidos: PedidoCompra[] = [
  {
    id: 1, numeroPedido: "PED-2026-0001", fornecedorNome: "FornecedorX Ltda", fornecedorCnpj: "12.345.678/0001-90",
    vendedorId: null, status: "recebido", dataPedido: "2026-03-01", dataPrevisaoEntrega: "2026-03-10",
    dataRecebimento: "2026-03-09", desconto: 0, frete: 50, observacoes: "",
    itens: [
      { produtoId: 1, produtoNome: "TJammer 4G", produtoCodigo: "TJM-4G", quantidadePedida: 20, quantidadeRecebida: 20, precoUnitario: 600 },
      { produtoId: 3, produtoNome: "Rastreador 4G", produtoCodigo: "RST-4G", quantidadePedida: 30, quantidadeRecebida: 30, precoUnitario: 280 },
    ],
    createdAt: "2026-03-01T00:00:00.000Z", updatedAt: "2026-03-09T00:00:00.000Z",
  },
  {
    id: 2, numeroPedido: "PED-2026-0002", fornecedorNome: "FornecedorY Distribuidora", fornecedorCnpj: "",
    vendedorId: 1, status: "aguardando", dataPedido: "2026-04-05", dataPrevisaoEntrega: "2026-04-15",
    dataRecebimento: "", desconto: 100, frete: 0, observacoes: "Urgente para reposição.",
    itens: [
      { produtoId: 2, produtoNome: "TBlock Pro", produtoCodigo: "TBL-PRO", quantidadePedida: 15, quantidadeRecebida: 0, precoUnitario: 200 },
    ],
    createdAt: "2026-04-05T00:00:00.000Z", updatedAt: "2026-04-05T00:00:00.000Z",
  },
];

const seedMovimentacoes: Movimentacao[] = [
  {
    id: 1, produtoId: 1, produtoNome: "TJammer 4G", tipo: "entrada", quantidade: 20,
    estoqueAnterior: 22, estoquePosterior: 42, origem: "pedido_compra", referenciaId: "PED-2026-0001",
    observacao: "Recebimento pedido PED-2026-0001",
    createdAt: "2026-03-09T10:00:00.000Z",
  },
  {
    id: 2, produtoId: 3, produtoNome: "Rastreador 4G", tipo: "entrada", quantidade: 30,
    estoqueAnterior: 55, estoquePosterior: 85, origem: "pedido_compra", referenciaId: "PED-2026-0001",
    observacao: "Recebimento pedido PED-2026-0001",
    createdAt: "2026-03-09T10:00:00.000Z",
  },
];

let pedidosStore: PedidoCompra[] = readStore(PEDIDOS_KEY, seedPedidos);
let movimentacoesStore: Movimentacao[] = readStore(MOVIMENTACOES_KEY, seedMovimentacoes);

const pedidosListeners = new Set<() => void>();
const movimentacoesListeners = new Set<() => void>();

function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function persistAll() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidosStore));
  window.localStorage.setItem(MOVIMENTACOES_KEY, JSON.stringify(movimentacoesStore));
}

function emitPedidos() {
  persistAll();
  pedidosListeners.forEach((l) => l());
  movimentacoesListeners.forEach((l) => l());
}

export function subscribePedidos(listener: () => void) {
  pedidosListeners.add(listener);
  return () => pedidosListeners.delete(listener);
}

export function subscribeMovimentacoes(listener: () => void) {
  movimentacoesListeners.add(listener);
  return () => movimentacoesListeners.delete(listener);
}

export function usePedidosCompra() {
  return useSyncExternalStore(subscribePedidos, () => pedidosStore, () => pedidosStore);
}

export function useMovimentacoes() {
  return useSyncExternalStore(subscribeMovimentacoes, () => movimentacoesStore, () => movimentacoesStore);
}

export function getPedidosCompra() {
  return pedidosStore;
}

export function getMovimentacoes() {
  return movimentacoesStore;
}

export function getNextPedidoId() {
  return Math.max(0, ...pedidosStore.map((p) => p.id)) + 1;
}

export function getNextMovimentacaoId() {
  return Math.max(0, ...movimentacoesStore.map((m) => m.id)) + 1;
}

function gerarNumeroPedido(id: number): string {
  const year = new Date().getFullYear();
  return `PED-${year}-${String(id).padStart(4, "0")}`;
}

export function upsertPedidoCompra(pedido: PedidoCompra) {
  const now = new Date().toISOString();
  const next = { ...pedido, updatedAt: now };
  const idx = pedidosStore.findIndex((p) => p.id === pedido.id);
  if (idx >= 0) {
    pedidosStore = pedidosStore.map((p) => p.id === pedido.id ? next : p);
  } else {
    if (!next.numeroPedido) next.numeroPedido = gerarNumeroPedido(next.id);
    pedidosStore = [next, ...pedidosStore];
  }
  emitPedidos();
  return next;
}

export function criarPedidoCompra(pedido: Omit<PedidoCompra, "id" | "numeroPedido" | "createdAt" | "updatedAt">): PedidoCompra {
  if (pedido.fornecedorCnpj && !validarCNPJ(pedido.fornecedorCnpj)) {
    throw new Error("CNPJ do fornecedor inválido.");
  }
  const id = getNextPedidoId();
  const numeroPedido = gerarNumeroPedido(id);
  const now = new Date().toISOString();
  const novo: PedidoCompra = { ...pedido, id, numeroPedido, createdAt: now, updatedAt: now };
  pedidosStore = [novo, ...pedidosStore];
  emitPedidos();
  return novo;
}

export function cancelarPedido(id: number) {
  pedidosStore = pedidosStore.map((p) =>
    p.id === id ? { ...p, status: "cancelado" as StatusPedido, updatedAt: new Date().toISOString() } : p
  );
  emitPedidos();
}

export function receberPedido(pedidoId: number, quantidadesRecebidas: Record<number, number>) {
  const pedido = pedidosStore.find((p) => p.id === pedidoId);
  if (!pedido) return;

  const now = new Date().toISOString();
  const produtos = getProdutos();
  const novasMovimentacoes: Movimentacao[] = [];
  let nextMovId = getNextMovimentacaoId();

  const itensAtualizados = pedido.itens.map((item) => {
    const qtdReceber = quantidadesRecebidas[item.produtoId] ?? 0;
    if (qtdReceber <= 0) return item;

    const produto = produtos.find((p) => p.id === item.produtoId);
    const estoqueAntes = produto?.estoqueAtual ?? 0;
    adjustProdutoStock(item.produtoId, qtdReceber);
    const estoqueDepois = estoqueAntes + qtdReceber;

    novasMovimentacoes.push({
      id: nextMovId++,
      produtoId: item.produtoId,
      produtoNome: item.produtoNome,
      tipo: "entrada",
      quantidade: qtdReceber,
      estoqueAnterior: estoqueAntes,
      estoquePosterior: estoqueDepois,
      origem: "pedido_compra",
      referenciaId: pedido.numeroPedido,
      observacao: `Recebimento de ${pedido.numeroPedido}`,
      createdAt: now,
    });

    return { ...item, quantidadeRecebida: item.quantidadeRecebida + qtdReceber };
  });

  const totalRecebido = itensAtualizados.every((item) => item.quantidadeRecebida >= item.quantidadePedida);
  const algumRecebido = itensAtualizados.some((item) => item.quantidadeRecebida > 0);
  const novoStatus: StatusPedido = totalRecebido ? "recebido" : algumRecebido ? "parcial" : pedido.status;

  pedidosStore = pedidosStore.map((p) =>
    p.id === pedidoId
      ? { ...p, itens: itensAtualizados, status: novoStatus, dataRecebimento: now.slice(0, 10), updatedAt: now }
      : p
  );

  movimentacoesStore = [...novasMovimentacoes, ...movimentacoesStore];
  emitPedidos();
}

export function registrarAjusteManual(
  produtoId: number,
  produtoNome: string,
  quantidade: number,
  tipo: "entrada" | "saida" | "ajuste",
  observacao: string
): boolean {
  const produtos = getProdutos();
  const produto = produtos.find((p) => p.id === produtoId);
  if (!produto) return false;

  const estoqueAntes = produto.estoqueAtual;
  const delta = tipo === "saida" ? -Math.abs(quantidade) : Math.abs(quantidade);

  const ok = adjustProdutoStock(produtoId, delta);
  if (!ok) return false;

  const estoqueDep = estoqueAntes + delta;
  const mov: Movimentacao = {
    id: getNextMovimentacaoId(),
    produtoId,
    produtoNome,
    tipo,
    quantidade: Math.abs(quantidade),
    estoqueAnterior: estoqueAntes,
    estoquePosterior: estoqueDep,
    origem: "ajuste_manual",
    referenciaId: "",
    observacao,
    createdAt: new Date().toISOString(),
  };
  movimentacoesStore = [mov, ...movimentacoesStore];
  emitPedidos();
  return true;
}

export function calcularValorTotalPedido(pedido: PedidoCompra): number {
  const subtotal = pedido.itens.reduce((acc, item) => acc + item.quantidadePedida * item.precoUnitario, 0);
  return subtotal - pedido.desconto + pedido.frete;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}
