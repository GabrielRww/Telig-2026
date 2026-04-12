import { useSyncExternalStore } from "react";

const STORAGE_KEY = "telig.equipamentosClientes";

export type CondicaoEntrada = "otimo" | "bom" | "regular" | "ruim" | "pessimo";

export const condicaoLabels: Record<CondicaoEntrada, string> = {
  otimo: "Ótimo",
  bom: "Bom",
  regular: "Regular",
  ruim: "Ruim",
  pessimo: "Péssimo",
};

export const condicaoColors: Record<CondicaoEntrada, string> = {
  otimo: "border-emerald-200 text-emerald-700",
  bom: "border-sky-200 text-sky-700",
  regular: "border-amber-200 text-amber-700",
  ruim: "border-orange-200 text-orange-700",
  pessimo: "border-rose-200 text-rose-700",
};

export interface EquipamentoCliente {
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  imei: string;
  cor: string;
  descricaoProblema: string;
  acessorios: string;
  condicaoEntrada: CondicaoEntrada;
  cliente: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

const seedData: EquipamentoCliente[] = [
  {
    id: 1, tipo: "Notebook", marca: "Dell", modelo: "Inspiron 15", numeroSerie: "NB-2024-001",
    imei: "", cor: "Preto", descricaoProblema: "Tela não liga", acessorios: "Carregador",
    condicaoEntrada: "bom", cliente: "Volare Segurança",
    ativo: true, createdAt: "2026-03-10T00:00:00.000Z", updatedAt: "2026-03-10T00:00:00.000Z",
  },
  {
    id: 2, tipo: "Smartphone", marca: "Samsung", modelo: "Galaxy A54", numeroSerie: "SM-A54-2024",
    imei: "358240051111110", cor: "Branco", descricaoProblema: "Bateria fraca", acessorios: "Cabo USB",
    condicaoEntrada: "regular", cliente: "Tracker Brasil",
    ativo: true, createdAt: "2026-03-15T00:00:00.000Z", updatedAt: "2026-03-15T00:00:00.000Z",
  },
  {
    id: 3, tipo: "Rastreador Veicular", marca: "Telig", modelo: "TJammer 4G", numeroSerie: "TJ-2024-089",
    imei: "", cor: "Preto", descricaoProblema: "Sem sinal GPS", acessorios: "",
    condicaoEntrada: "ruim", cliente: "LogSafe",
    ativo: true, createdAt: "2026-04-01T00:00:00.000Z", updatedAt: "2026-04-01T00:00:00.000Z",
  },
];

let store: EquipamentoCliente[] = readStore(STORAGE_KEY, seedData);
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

export function subscribeEquipamentosClientes(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useEquipamentosClientes() {
  return useSyncExternalStore(subscribeEquipamentosClientes, () => store, () => store);
}

export function getEquipamentosClientes() {
  return store;
}

export function getNextEquipamentoClienteId() {
  return Math.max(0, ...store.map((e) => e.id)) + 1;
}

export function upsertEquipamentoCliente(equip: EquipamentoCliente) {
  const now = new Date().toISOString();
  const next = { ...equip, updatedAt: now };
  const idx = store.findIndex((e) => e.id === equip.id);
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

export function deleteEquipamentoCliente(id: number) {
  store = store.map((e) =>
    e.id === id ? { ...e, ativo: false, updatedAt: new Date().toISOString() } : e
  );
  emit();
}

export function toggleEquipamentoClienteStatus(id: number) {
  store = store.map((e) =>
    e.id === id ? { ...e, ativo: !e.ativo, updatedAt: new Date().toISOString() } : e
  );
  emit();
}

export function numeroSerieExiste(numeroSerie: string, excludeId?: number): boolean {
  if (!numeroSerie.trim()) return false;
  return store.some((e) => e.numeroSerie === numeroSerie && e.id !== excludeId);
}

export function imeiExiste(imei: string, excludeId?: number): boolean {
  if (!imei.trim()) return false;
  return store.some((e) => e.imei === imei && e.id !== excludeId);
}
