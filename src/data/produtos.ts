import { useSyncExternalStore } from "react";

const STORAGE_KEY = "telig.produtos";

export type UnidadeMedida = "un" | "kg" | "l" | "m" | "cx" | "par";

export interface Produto {
  id: number;
  nome: string;
  codigo: string;
  descricao: string;
  categoria: string;
  unidadeMedida: UnidadeMedida;
  precoCusto: number;
  precoVenda: number;
  margemLucro: number;
  estoqueAtual: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  fornecedor: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export const categoriasProduto = ["Jammer", "Bloqueador", "Rastreador", "Acessório", "Insumo", "Outro"];

export function calcMargemLucro(custo: number, venda: number): number {
  if (custo <= 0) return 0;
  return ((venda - custo) / custo) * 100;
}

const seedData: Produto[] = [
  {
    id: 1, nome: "TJammer 4G", codigo: "TJM-4G", descricao: "Bloqueador de sinal 4G", categoria: "Jammer",
    unidadeMedida: "un", precoCusto: 600, precoVenda: 850, margemLucro: calcMargemLucro(600, 850),
    estoqueAtual: 42, estoqueMinimo: 10, estoqueMaximo: 100, fornecedor: "FornecedorX",
    ativo: true, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 2, nome: "TBlock Pro", codigo: "TBL-PRO", descricao: "Bloqueador profissional", categoria: "Bloqueador",
    unidadeMedida: "un", precoCusto: 200, precoVenda: 320, margemLucro: calcMargemLucro(200, 320),
    estoqueAtual: 38, estoqueMinimo: 5, estoqueMaximo: 80, fornecedor: "FornecedorY",
    ativo: true, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 3, nome: "Rastreador 4G", codigo: "RST-4G", descricao: "Rastreador veicular 4G", categoria: "Rastreador",
    unidadeMedida: "un", precoCusto: 280, precoVenda: 450, margemLucro: calcMargemLucro(280, 450),
    estoqueAtual: 85, estoqueMinimo: 15, estoqueMaximo: 150, fornecedor: "FornecedorX",
    ativo: true, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 4, nome: "TBlock V1", codigo: "TBL-V1", descricao: "Versão legada", categoria: "Bloqueador",
    unidadeMedida: "un", precoCusto: 150, precoVenda: 200, margemLucro: calcMargemLucro(150, 200),
    estoqueAtual: 3, estoqueMinimo: 10, estoqueMaximo: 50, fornecedor: "FornecedorY",
    ativo: false, createdAt: "2025-06-01T00:00:00.000Z", updatedAt: "2025-06-01T00:00:00.000Z",
  },
  {
    id: 5, nome: "Bloqueador Standard", codigo: "BLQ-STD", descricao: "Bloqueador padrão", categoria: "Bloqueador",
    unidadeMedida: "un", precoCusto: 120, precoVenda: 180, margemLucro: calcMargemLucro(120, 180),
    estoqueAtual: 30, estoqueMinimo: 8, estoqueMaximo: 60, fornecedor: "FornecedorZ",
    ativo: true, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 6, nome: "Antena GPS", codigo: "ANT-GPS", descricao: "Antena GPS externa", categoria: "Acessório",
    unidadeMedida: "un", precoCusto: 25, precoVenda: 45, margemLucro: calcMargemLucro(25, 45),
    estoqueAtual: 120, estoqueMinimo: 20, estoqueMaximo: 200, fornecedor: "FornecedorZ",
    ativo: true, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

let store: Produto[] = readStore(STORAGE_KEY, seedData);
const listeners = new Set<() => void>();

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

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

export function subscribeProdutos(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useProdutos() {
  return useSyncExternalStore(subscribeProdutos, () => store, () => store);
}

export function getProdutos() {
  return store;
}

export function getNextProdutoId() {
  return Math.max(0, ...store.map((p) => p.id)) + 1;
}

export function upsertProduto(produto: Omit<Produto, "estoqueAtual"> & { estoqueAtual?: number }) {
  const now = new Date().toISOString();
  const idx = store.findIndex((p) => p.id === produto.id);
  const estoqueAtual = idx >= 0 ? store[idx].estoqueAtual : (produto.estoqueAtual ?? 0);
  const next: Produto = {
    ...produto,
    estoqueAtual,
    margemLucro: calcMargemLucro(produto.precoCusto, produto.precoVenda),
    updatedAt: now,
  };
  if (idx >= 0) {
    const nextStore = [...store];
    nextStore[idx] = next;
    store = nextStore;
  } else {
    store = [next, ...store];
  }
  emit();
  return next;
}

export function adjustProdutoStock(produtoId: number, delta: number): boolean {
  const idx = store.findIndex((p) => p.id === produtoId);
  if (idx < 0) return false;
  const produto = store[idx];
  const novoEstoque = produto.estoqueAtual + delta;
  if (novoEstoque < 0) return false;
  const nextStore = [...store];
  nextStore[idx] = { ...produto, estoqueAtual: novoEstoque, updatedAt: new Date().toISOString() };
  store = nextStore;
  emit();
  return true;
}

export function deleteProduto(id: number) {
  store = store.map((p) =>
    p.id === id ? { ...p, ativo: false, updatedAt: new Date().toISOString() } : p
  );
  emit();
}

export function toggleProdutoStatus(id: number) {
  store = store.map((p) =>
    p.id === id ? { ...p, ativo: !p.ativo, updatedAt: new Date().toISOString() } : p
  );
  emit();
}

export function codigoProdutoExiste(codigo: string, excludeId?: number): boolean {
  return store.some((p) => p.codigo.toUpperCase() === codigo.toUpperCase() && p.id !== excludeId);
}

export function countProdutosAbaixoMinimo(): number {
  return store.filter((p) => p.ativo && p.estoqueAtual <= p.estoqueMinimo).length;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}
