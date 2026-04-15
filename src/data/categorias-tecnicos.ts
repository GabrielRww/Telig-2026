import { useSyncExternalStore } from "react";
import { countTecnicosByCategoria } from "./tecnicos";

const STORAGE_KEY = "telig.categoriasTecnicos";

export interface CategoriaTecnico {
  id: number;
  nome: string;
  descricao: string;
  cor: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

const seedData: CategoriaTecnico[] = [
  { id: 1, nome: "Instalador Sênior", descricao: "Profissional com 5+ anos de experiência", cor: "#3b82f6", ativo: true, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 2, nome: "Instalador Pleno", descricao: "Profissional com 2-5 anos de experiência", cor: "#10b981", ativo: true, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 3, nome: "Instalador Júnior", descricao: "Profissional em formação", cor: "#f59e0b", ativo: true, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 4, nome: "Eletricista Automotivo", descricao: "Especialista em elétrica veicular", cor: "#ef4444", ativo: true, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 5, nome: "Técnico em TI", descricao: "Suporte técnico e infraestrutura", cor: "#8b5cf6", ativo: true, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
];

let store: CategoriaTecnico[] = readStore(STORAGE_KEY, seedData);
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

export function subscribeCategoriasTecnicos(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCategoriasTecnicos() {
  return useSyncExternalStore(subscribeCategoriasTecnicos, () => store, () => store);
}

export function getCategoriasTecnicos() {
  return store;
}

export function getNextCategoriaTecnicoId() {
  return Math.max(0, ...store.map((c) => c.id)) + 1;
}

export function upsertCategoriaTecnico(categoria: CategoriaTecnico) {
  const now = new Date().toISOString();
  const next = { ...categoria, updatedAt: now };
  const idx = store.findIndex((c) => c.id === categoria.id);
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

export function deleteCategoriaTecnico(id: number) {
  if (countTecnicosByCategoria(id) > 0) return false;
  store = store.map((c) =>
    c.id === id ? { ...c, ativo: false, updatedAt: new Date().toISOString() } : c
  );
  emit();
  return true;
}

export function toggleCategoriaTecnicoStatus(id: number) {
  store = store.map((c) => c.id === id ? { ...c, ativo: !c.ativo, updatedAt: new Date().toISOString() } : c);
  emit();
}
