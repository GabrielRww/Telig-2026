// src/integrations/sap/invoices.ts

import { sapPost } from "./client";
import type { ServiceOrderRecord } from "@/data/service-orders";
import { parseCurrencyValue } from "@/data/service-orders";

export interface SAPInvoiceLine {
  ItemCode: string;
  Quantity: number;
  UnitPrice: number;
  TaxCode?: string;
  ItemDescription?: string;
}

export interface SAPInvoice {
  CardCode: string;        // CardCode do cliente (C*)
  DocDate: string;         // "YYYY-MM-DD"
  DocDueDate: string;
  Comments?: string;
  DocumentLines: SAPInvoiceLine[];
}

function toSAPDate(value: string): string {
  if (!value || value === "-") return new Date().toISOString().split("T")[0];
  return value.includes("/") ? value.split("/").reverse().join("-") : value;
}

export function mapServiceOrderToInvoice(order: ServiceOrderRecord): SAPInvoice {
  const docDate = order.realizacao && order.realizacao !== "-"
    ? toSAPDate(order.realizacao)
    : new Date().toISOString().split("T")[0];

  const serviceValue = parseCurrencyValue(order.valorCliente);

  const lines: SAPInvoiceLine[] = [
    {
      ItemCode: "SERVICO_OS", // código do item de serviço no SAP — adapte
      Quantity: 1,
      UnitPrice: serviceValue,
      ItemDescription: `OS ${order.pedido} - ${order.tipo}`,
    },
    ...order.despesas.map((despesa) => ({
      ItemCode: "DESPESA_OS", // código de despesas — adapte
      Quantity: 1,
      UnitPrice: parseCurrencyValue(despesa.valor),
      ItemDescription: despesa.descricao,
    })),
  ];

  return {
    CardCode: order.cliente, // ATENÇÃO: deve ser o CardCode SAP (C*)
    DocDate: docDate,
    DocDueDate: docDate,
    Comments: `Faturamento automático OS ${order.pedido} | Técnico: ${order.tecnico} | Veículo: ${order.veiculo}`,
    DocumentLines: lines.filter((l) => l.UnitPrice > 0),
  };
}

export async function createSAPInvoice(order: ServiceOrderRecord): Promise<number> {
  const payload = mapServiceOrderToInvoice(order);
  const result = await sapPost<{ DocEntry: number }>("Invoices", payload);
  return result.DocEntry;
}
