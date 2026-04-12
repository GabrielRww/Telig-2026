import { useSyncExternalStore } from "react";

const STORAGE_KEY = "telig.vendedores";

export interface Vendedor {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  comissaoPercentual: number;
  metaMensal: number;
  usuarioId?: number | null;
  dataAdmissao: string;
  ativo: boolean;
  observacoes: string;
  createdAt: string;
  updatedAt: string;
}

const seedData: Vendedor[] = [
  {
    id: 1, nome: "Lucas Mendes", cpf: "123.456.789-09", telefone: "(54) 99901-1111",
    email: "lucas@telig.com.br", comissaoPercentual: 5.5, metaMensal: 20000,
    dataAdmissao: "2023-01-10", ativo: true, observacoes: "",
    createdAt: "2023-01-10T00:00:00.000Z", updatedAt: "2023-01-10T00:00:00.000Z",
  },
  {
    id: 2, nome: "Fernanda Rocha", cpf: "987.654.321-00", telefone: "(54) 99902-2222",
    email: "fernanda@telig.com.br", comissaoPercentual: 4.0, metaMensal: 15000,
    dataAdmissao: "2023-06-01", ativo: true, observacoes: "",
    createdAt: "2023-06-01T00:00:00.000Z", updatedAt: "2023-06-01T00:00:00.000Z",
  },
  {
    id: 3, nome: "Ricardo Gomes", cpf: "111.222.333-96", telefone: "(54) 99903-3333",
    email: "ricardo@telig.com.br", comissaoPercentual: 6.0, metaMensal: 25000,
    dataAdmissao: "2022-08-15", ativo: false, observacoes: "Desligado em março/2026.",
    createdAt: "2022-08-15T00:00:00.000Z", updatedAt: "2022-08-15T00:00:00.000Z",
  },
];

let store: Vendedor[] = readStore(STORAGE_KEY, seedData);
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

export function subscribeVendedores(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useVendedores() {
  return useSyncExternalStore(subscribeVendedores, () => store, () => store);
}

export function getVendedores() {
  return store;
}

export function getNextVendedorId() {
  return Math.max(0, ...store.map((v) => v.id)) + 1;
}

export function upsertVendedor(vendedor: Vendedor) {
  const now = new Date().toISOString();
  const next = { ...vendedor, updatedAt: now };
  const idx = store.findIndex((v) => v.id === vendedor.id);
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

export function deleteVendedor(id: number) {
  store = store.map((v) =>
    v.id === id ? { ...v, ativo: false, updatedAt: new Date().toISOString() } : v
  );
  emit();
}

export function toggleVendedorStatus(id: number) {
  store = store.map((v) =>
    v.id === id ? { ...v, ativo: !v.ativo, updatedAt: new Date().toISOString() } : v
  );
  emit();
}

export function cpfVendedorExiste(cpf: string, excludeId?: number): boolean {
  const clean = cpf.replace(/\D/g, "");
  return store.some((v) => v.cpf.replace(/\D/g, "") === clean && v.id !== excludeId);
}

export function emailVendedorExiste(email: string, excludeId?: number): boolean {
  return store.some((v) => v.email.toLowerCase() === email.toLowerCase() && v.id !== excludeId);
}

export function usuarioVinculadoAVendedor(usuarioId: number, excludeVendedorId?: number): boolean {
  return store.some((v) => v.usuarioId === usuarioId && v.id !== excludeVendedorId);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}
