// src/integrations/sap/serviceCalls.ts

import { sapGet, sapPost, sapPatch } from "./client";
import type { ServiceOrderRecord } from "@/data/service-orders";

export interface SAPServiceCall {
  ServiceCallID?: number;
  Subject: string;
  CustomerCode: string;        // CardCode do cliente (C*)
  TechnicianCode?: string;     // CardCode do técnico (F*)
  Status: number;              // 1=Aberto, 2=Pendente, 3=Encerrado
  Priority: number;            // 0=Baixa, 1=Média, 2=Alta
  CallType: number;
  Description: string;
  Resolution?: string;
  CreationDate: string;        // "YYYY-MM-DD"
  ClosingDate?: string;
  ServiceCallActivities?: SAPServiceCallActivity[];
  ServiceCallInventoryExpenses?: SAPServiceCallExpense[];
}

export interface SAPServiceCallActivity {
  ActivityCode: number;
  Date: string;
  HandledBy: string;
}

export interface SAPServiceCallExpense {
  LineNum?: number;
  ItemCode: string;
  ItemDescription: string;
  Quantity: number;
  LineTotal: number;
}

// Mapeamento de status TELIG → SAP ServiceCall Status
const statusMap: Record<string, number> = {
  "Em agendamento": 1,
  "Agendada": 1,
  "Em reagendamento": 1,
  "Aguardando agendamento": 2,
  "Em atendimento": 1,
  "Em execução": 1,
  "Finalizada": 3,
  "Validada": 3,
  "Faturada": 3,
  "Cancelada": 3,
  "Estoque": 2,
};

// Mapeamento de tipo OS → CallType SAP (adapte conforme cadastro no SAP)
const callTypeMap: Record<string, number> = {
  "INSTALACAO": 1,
  "RETIRADA": 2,
  "MANUTENCAO": 3,
  "REINSTALACAO": 4,
  "SOCORRO_TECNICO": 5,
  "TRANSFERENCIA": 6,
  "AGENDAMENTO_MANUTENCAO": 3,
};

function toSAPDate(value: string): string {
  if (!value || value === "-") return "";
  return value.includes("/") ? value.split("/").reverse().join("-") : value;
}

export function mapServiceOrderToSAPCall(order: ServiceOrderRecord): SAPServiceCall {
  const creationDate = toSAPDate(order.abertura);
  const closingDate = order.realizacao && order.realizacao !== "-"
    ? toSAPDate(order.realizacao)
    : undefined;

  return {
    Subject: `OS ${order.pedido} - ${order.tipo} - ${order.cliente}`,
    CustomerCode: order.cliente, // ATENÇÃO: deve ser o CardCode SAP (ex: C001), não o nome
    TechnicianCode: order.tecnico || undefined, // ATENÇÃO: deve ser o CardCode SAP (ex: F023)
    Status: statusMap[order.status] ?? 1,
    Priority: 1,
    CallType: callTypeMap[order.tipo] ?? 1,
    Description: `Defeito relatado: ${order.defeitoRelatado}\nDefeito constatado: ${order.defeitoConstatado}\nObservação: ${order.observacao}`,
    Resolution: order.defeitoConstatado || undefined,
    CreationDate: creationDate,
    ClosingDate: closingDate,
    ServiceCallInventoryExpenses: order.despesas.map((d, i) => ({
      LineNum: i,
      ItemCode: "SERVICO", // código genérico — adapte conforme items do SAP
      ItemDescription: d.descricao,
      Quantity: 1,
      LineTotal: parseFloat(d.valor.replace(/[^0-9,]/g, "").replace(",", ".")) || 0,
    })),
  };
}

// Criar ServiceCall no SAP
export async function createSAPServiceCall(order: ServiceOrderRecord): Promise<number> {
  const payload = mapServiceOrderToSAPCall(order);
  const result = await sapPost<SAPServiceCall>("ServiceCalls", payload);
  return result.ServiceCallID!;
}

// Atualizar ServiceCall existente
export async function updateSAPServiceCall(sapCallId: number, order: ServiceOrderRecord): Promise<void> {
  const payload = mapServiceOrderToSAPCall(order);
  await sapPatch("ServiceCalls", sapCallId, payload);
}

// Buscar ServiceCalls do SAP
export async function fetchSAPServiceCalls(top = 100): Promise<SAPServiceCall[]> {
  const result = await sapGet<{ value: SAPServiceCall[] }>(
    "ServiceCalls",
    {
      "$orderby": "ServiceCallID desc",
      "$top": String(top),
      "$select": "ServiceCallID,Subject,CustomerCode,TechnicianCode,Status,CreationDate,ClosingDate,Description",
    }
  );
  return result.value;
}
