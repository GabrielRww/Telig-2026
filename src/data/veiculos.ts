import { useSyncExternalStore } from "react";
import { normalizeSearch } from "@/lib/search";

const ACTIVE_VEHICLES_STORAGE_KEY = "telig.activeVehicles";
const RETIRED_VEHICLES_STORAGE_KEY = "telig.retiredVehicles";

export interface VehicleEquipment {
  serial: string;
  produto: string;
  status: string;
}

export interface VehicleRecord {
  id: number;
  tipo: string;
  placa: string;
  modelo: string;
  ano: number;
  cor: string;
  chassi: string;
  empresa: string;
  cliente: string;
  statusEquip: string;
  observacao: string;
  equipamentos: VehicleEquipment[];
}

export interface RetiredVehicleRecord extends VehicleRecord {
  retiredAt: string;
  retiredFromOsType: string;
  retiredFromOsId: string;
}

export const vehicleTypeOptions = [
  { value: "Carro", label: "Carro" },
  { value: "Caminhonete", label: "Caminhonete" },
  { value: "Caminhão", label: "Caminhão" },
  { value: "Carreta", label: "Carreta" },
  { value: "Van", label: "Van" },
  { value: "Utilitário", label: "Utilitário" },
];

export const vehicleStatusOptions = [
  { value: "Ativo", label: "Ativo" },
  { value: "Em manutenção", label: "Em manutenção" },
  { value: "Reserva", label: "Reserva" },
  { value: "Inativo", label: "Inativo" },
];

const seedVehicles: VehicleRecord[] = [
  {
    id: 1,
    tipo: "Caminhonete",
    placa: "ABC1234",
    modelo: "Fiat Strada",
    ano: 2023,
    cor: "Branca",
    chassi: "9BFAB12E3X1234567",
    empresa: "Volare Segurança",
    cliente: "Volare Segurança",
    statusEquip: "Ativo",
    observacao: "Veículo vinculado ao contrato principal da empresa.",
    equipamentos: [
      { serial: "TJ-2024-001", produto: "TJammer 4G", status: "Ativo" },
      { serial: "TB-2024-010", produto: "TBlock Pro", status: "Ativo" },
    ],
  },
  {
    id: 2,
    tipo: "Carro",
    placa: "XYZ5678",
    modelo: "VW Gol",
    ano: 2022,
    cor: "Prata",
    chassi: "9BWAB12E3X2345678",
    empresa: "Tracker Brasil",
    cliente: "Tracker Brasil",
    statusEquip: "Ativo",
    observacao: "",
    equipamentos: [{ serial: "TJ-2023-145", produto: "TBlock", status: "Ativo" }],
  },
  {
    id: 3,
    tipo: "Caminhonete",
    placa: "DEF9012",
    modelo: "Toyota Hilux",
    ano: 2024,
    cor: "Preta",
    chassi: "9BFAB12E3X3456789",
    empresa: "LogSafe",
    cliente: "LogSafe",
    statusEquip: "Em manutenção",
    observacao: "Agendado para revisão preventiva.",
    equipamentos: [{ serial: "TJ-2023-089", produto: "Rastreador 4G", status: "Manutenção" }],
  },
  {
    id: 4,
    tipo: "Caminhão",
    placa: "GHI3456",
    modelo: "Chevrolet S10",
    ano: 2023,
    cor: "Vermelha",
    chassi: "9BFAB12E3X4567890",
    empresa: "TransGuarda",
    cliente: "TransGuarda",
    statusEquip: "Reserva",
    observacao: "",
    equipamentos: [],
  },
  {
    id: 5,
    tipo: "Carreta",
    placa: "JKL7890",
    modelo: "Ford Ranger",
    ano: 2024,
    cor: "Azul",
    chassi: "9BFAB12E3X5678901",
    empresa: "FleetShield",
    cliente: "FleetShield",
    statusEquip: "Ativo",
    observacao: "",
    equipamentos: [
      { serial: "TJ-2024-055", produto: "TBlock", status: "Ativo" },
      { serial: "TJ-2024-056", produto: "Rastreador 4G", status: "Ativo" },
    ],
  },
  {
    id: 6,
    tipo: "Van",
    placa: "MNO1234",
    modelo: "Fiat Toro",
    ano: 2022,
    cor: "Cinza",
    chassi: "9BFAB12E3X6789012",
    empresa: "Volare Segurança",
    cliente: "Volare Segurança",
    statusEquip: "Inativo",
    observacao: "Veículo em revisão geral.",
    equipamentos: [{ serial: "TJ-2022-200", produto: "TJammer 4G", status: "Ativo" }],
  },
];

let registeredVehicles: VehicleRecord[] = readStoredVehicles(ACTIVE_VEHICLES_STORAGE_KEY, seedVehicles);
let retiredVehicles: RetiredVehicleRecord[] = readStoredVehicles(RETIRED_VEHICLES_STORAGE_KEY, []);

const listeners = new Set<() => void>();

function readStoredVehicles<T>(storageKey: string, fallbackValue: T): T {
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

function persistVehicleStore() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACTIVE_VEHICLES_STORAGE_KEY, JSON.stringify(registeredVehicles));
  window.localStorage.setItem(RETIRED_VEHICLES_STORAGE_KEY, JSON.stringify(retiredVehicles));
}

function emitVehicleStoreChange() {
  persistVehicleStore();
  listeners.forEach((listener) => listener());
}

function normalizePlate(value: string) {
  return normalizeVehicleSearch(value);
}

function sanitizeVehicle(vehicle: VehicleRecord): VehicleRecord {
  return {
    ...vehicle,
    tipo: vehicle.tipo.trim(),
    placa: vehicle.placa.replace(/\s+/g, "").toUpperCase(),
    modelo: vehicle.modelo.trim(),
    ano: Number(vehicle.ano),
    cor: vehicle.cor.trim(),
    chassi: vehicle.chassi.replace(/\s+/g, "").toUpperCase(),
    empresa: vehicle.empresa.trim(),
    cliente: vehicle.cliente.trim(),
    statusEquip: vehicle.statusEquip.trim(),
    observacao: vehicle.observacao.trim(),
    equipamentos: vehicle.equipamentos.map((equipment) => ({
      serial: equipment.serial.trim(),
      produto: equipment.produto.trim(),
      status: equipment.status.trim(),
    })),
  };
}

function getHighestVehicleId() {
  return Math.max(
    0,
    ...registeredVehicles.map((vehicle) => vehicle.id),
    ...retiredVehicles.map((vehicle) => vehicle.id),
  );
}

export function subscribeVehicleStore(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useRegisteredVehicles() {
  return useSyncExternalStore(subscribeVehicleStore, () => registeredVehicles, () => registeredVehicles);
}

export function useRetiredVehicles() {
  return useSyncExternalStore(subscribeVehicleStore, () => retiredVehicles, () => retiredVehicles);
}

export function getNextVehicleId() {
  return getHighestVehicleId() + 1;
}

export function createVehicleId() {
  return getNextVehicleId();
}

export function upsertVehicle(vehicle: VehicleRecord) {
  const nextVehicle = sanitizeVehicle(vehicle);
  const targetPlate = normalizePlate(nextVehicle.placa);
  const targetId = nextVehicle.id;

  const existingIndex = registeredVehicles.findIndex((currentVehicle) => (
    currentVehicle.id === targetId || normalizePlate(currentVehicle.placa) === targetPlate
  ));

  if (existingIndex >= 0) {
    const nextVehicles = [...registeredVehicles];
    nextVehicles[existingIndex] = nextVehicle;
    registeredVehicles = nextVehicles;
  } else {
    registeredVehicles = [nextVehicle, ...registeredVehicles];
  }

  retiredVehicles = retiredVehicles.filter((currentVehicle) => normalizePlate(currentVehicle.placa) !== targetPlate);
  emitVehicleStoreChange();
  return nextVehicle;
}

export function removeVehicleByPlate(plate: string, metadata?: { osType?: string; osId?: string }) {
  const targetPlate = normalizePlate(plate);
  const removedVehicle = registeredVehicles.find((vehicle) => normalizePlate(vehicle.placa) === targetPlate);

  if (!removedVehicle) {
    return false;
  }

  registeredVehicles = registeredVehicles.filter((vehicle) => normalizePlate(vehicle.placa) !== targetPlate);

  const retiredRecord: RetiredVehicleRecord = {
    ...removedVehicle,
    retiredAt: new Date().toISOString(),
    retiredFromOsType: metadata?.osType ?? "RETIRADA",
    retiredFromOsId: metadata?.osId ?? "",
  };

  retiredVehicles = [
    retiredRecord,
    ...retiredVehicles.filter((vehicle) => normalizePlate(vehicle.placa) !== targetPlate),
  ];

  emitVehicleStoreChange();
  return true;
}

export function getRegisteredVehicles() {
  return registeredVehicles;
}

export function getRetiredVehicles() {
  return retiredVehicles;
}

export function normalizeVehicleSearch(value: string) {
  return normalizeSearch(value);
}
