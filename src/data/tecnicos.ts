import { useSyncExternalStore } from "react";

const STORAGE_KEY = "telig.tecnicos";

export interface Tecnico {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  categoriaId: number;
  usuarioId?: number | null;
  especialidades: string[];
  dataAdmissao: string;
  ativo: boolean;
  observacoes: string;
  createdAt: string;
  updatedAt: string;
}

const seedData: Tecnico[] = [
  {
    id: 1, nome: "Carlos Silva", cpf: "123.456.789-09", telefone: "(54) 99911-1111",
    email: "carlos@telig.com.br", categoriaId: 1, especialidades: ["Instalação", "Elétrica"],
    dataAdmissao: "2022-03-01", ativo: true, observacoes: "",
    createdAt: "2022-03-01T00:00:00.000Z", updatedAt: "2022-03-01T00:00:00.000Z",
  },
  {
    id: 2, nome: "João Santos", cpf: "987.654.321-00", telefone: "(54) 99922-2222",
    email: "joao@telig.com.br", categoriaId: 2, especialidades: ["Rastreamento", "Manutenção"],
    dataAdmissao: "2023-01-15", ativo: true, observacoes: "",
    createdAt: "2023-01-15T00:00:00.000Z", updatedAt: "2023-01-15T00:00:00.000Z",
  },
  {
    id: 3, nome: "Pedro Lima", cpf: "111.222.333-96", telefone: "(54) 99933-3333",
    email: "pedro@telig.com.br", categoriaId: 3, especialidades: ["Instalação"],
    dataAdmissao: "2024-06-01", ativo: false, observacoes: "Afastado temporariamente.",
    createdAt: "2024-06-01T00:00:00.000Z", updatedAt: "2024-06-01T00:00:00.000Z",
  },
  {
    id: 4, nome: "Ana Costa", cpf: "444.555.666-87", telefone: "(54) 99944-4444",
    email: "ana@telig.com.br", categoriaId: 2, especialidades: ["Elétrica", "Fibra"],
    dataAdmissao: "2023-08-20", ativo: true, observacoes: "",
    createdAt: "2023-08-20T00:00:00.000Z", updatedAt: "2023-08-20T00:00:00.000Z",
  },
];

let store: Tecnico[] = readStore(STORAGE_KEY, seedData);
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

export function subscribeTecnicos(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTecnicos() {
  return useSyncExternalStore(subscribeTecnicos, () => store, () => store);
}

export function getTecnicos() {
  return store;
}

export function getNextTecnicoId() {
  return Math.max(0, ...store.map((t) => t.id)) + 1;
}

export function upsertTecnico(tecnico: Tecnico) {
  const now = new Date().toISOString();
  const next = { ...tecnico, updatedAt: now };
  const idx = store.findIndex((t) => t.id === tecnico.id);
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

export function deleteTecnico(id: number) {
  store = store.map((t) =>
    t.id === id ? { ...t, ativo: false, updatedAt: new Date().toISOString() } : t
  );
  emit();
}

export function toggleTecnicoStatus(id: number) {
  store = store.map((t) =>
    t.id === id ? { ...t, ativo: !t.ativo, updatedAt: new Date().toISOString() } : t
  );
  emit();
}

export function cpfTecnicoExiste(cpf: string, excludeId?: number): boolean {
  const clean = cpf.replace(/\D/g, "");
  return store.some((t) => t.cpf.replace(/\D/g, "") === clean && t.id !== excludeId);
}

export function countTecnicosByCategoria(categoriaId: number): number {
  return store.filter((t) => t.categoriaId === categoriaId && t.ativo).length;
}

export function usuarioVinculadoATecnico(usuarioId: number, excludeTecnicoId?: number): boolean {
  return store.some((t) => t.usuarioId === usuarioId && t.id !== excludeTecnicoId);
}
