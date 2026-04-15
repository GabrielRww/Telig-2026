import { useSyncExternalStore } from "react";

const STORAGE_KEY = "telig.usuarios";

export type PerfilUsuario = "admin" | "gerente" | "atendente" | "tecnico" | "vendedor";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  ativo: boolean;
  telefone: string;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const perfilLabels: Record<PerfilUsuario, string> = {
  admin: "Administrador",
  gerente: "Gerente",
  atendente: "Atendente",
  tecnico: "Técnico",
  vendedor: "Vendedor",
};

export const perfilColors: Record<PerfilUsuario, string> = {
  admin: "border-rose-200 text-rose-700",
  gerente: "border-violet-200 text-violet-700",
  atendente: "border-sky-200 text-sky-700",
  tecnico: "border-emerald-200 text-emerald-700",
  vendedor: "border-amber-200 text-amber-700",
};

const seedData: Usuario[] = [
  { id: 1, nome: "Admin Master", email: "admin@telig.com.br", perfil: "admin", ativo: true, telefone: "(54) 99900-0000", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: 2, nome: "Maria Souza", email: "maria@telig.com.br", perfil: "atendente", ativo: true, telefone: "(54) 99911-1111", createdAt: "2026-01-15T00:00:00.000Z", updatedAt: "2026-01-15T00:00:00.000Z" },
  { id: 3, nome: "Carlos Silva", email: "carlos@telig.com.br", perfil: "tecnico", ativo: true, telefone: "(54) 99922-2222", createdAt: "2026-02-01T00:00:00.000Z", updatedAt: "2026-02-01T00:00:00.000Z" },
  { id: 4, nome: "João Santos", email: "joao@telig.com.br", perfil: "tecnico", ativo: true, telefone: "(54) 99933-3333", createdAt: "2026-02-10T00:00:00.000Z", updatedAt: "2026-02-10T00:00:00.000Z" },
  { id: 5, nome: "Pedro Lima", email: "pedro@telig.com.br", perfil: "vendedor", ativo: false, telefone: "(54) 99944-4444", createdAt: "2026-03-01T00:00:00.000Z", updatedAt: "2026-03-01T00:00:00.000Z" },
  { id: 6, nome: "Gerente Ops", email: "gerente@telig.com.br", perfil: "gerente", ativo: true, telefone: "(54) 99955-5555", createdAt: "2026-03-15T00:00:00.000Z", updatedAt: "2026-03-15T00:00:00.000Z" },
];

let store: Usuario[] = readStore(STORAGE_KEY, seedData);
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

export function subscribeUsuarios(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useUsuarios() {
  return useSyncExternalStore(subscribeUsuarios, () => store, () => store);
}

export function getUsuarios() {
  return store;
}

export function getNextUsuarioId() {
  return Math.max(0, ...store.map((u) => u.id)) + 1;
}

export function upsertUsuario(usuario: Usuario) {
  const now = new Date().toISOString();
  const next = { ...usuario, updatedAt: now };
  const idx = store.findIndex((u) => u.id === usuario.id);
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

export function deleteUsuario(id: number) {
  store = store.map((u) =>
    u.id === id ? { ...u, ativo: false, updatedAt: new Date().toISOString() } : u
  );
  emit();
}

export function toggleUsuarioStatus(id: number) {
  store = store.map((u) =>
    u.id === id ? { ...u, ativo: !u.ativo, updatedAt: new Date().toISOString() } : u
  );
  emit();
}

export function emailExiste(email: string, excludeId?: number): boolean {
  return store.some((u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== excludeId);
}
