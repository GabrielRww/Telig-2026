// src/integrations/sap/delivery.ts

import { sapPost } from "./client";
import type { ServiceOrderRecord, ServiceOrderEquipment } from "@/data/service-orders";

export interface SAPDeliveryLine {
  ItemCode: string;
  Quantity: number;
  WarehouseCode: string;
  SerialNumbers?: { InternalSerialNumber: string }[];
}

export interface SAPDelivery {
  CardCode: string;
  DocDate: string;
  Comments?: string;
  DocumentLines: SAPDeliveryLine[];
}

export function mapEquipmentsToDelivery(
  order: ServiceOrderRecord,
  equipments: ServiceOrderEquipment[]
): SAPDelivery {
  const docDate = new Date().toISOString().split("T")[0];

  return {
    CardCode: order.cliente, // ATENÇÃO: CardCode SAP
    DocDate: docDate,
    Comments: `Expedição OS ${order.pedido} - ${order.tipo} - ${order.cliente}`,
    DocumentLines: equipments.map((equip) => ({
      ItemCode: equip.produto, // ATENÇÃO: deve ser ItemCode SAP
      Quantity: 1,
      WarehouseCode: "01", // adapte para o depósito correto
      SerialNumbers: equip.serial ? [{ InternalSerialNumber: equip.serial }] : undefined,
    })),
  };
}

export async function createSAPDelivery(
  order: ServiceOrderRecord,
  equipments: ServiceOrderEquipment[]
): Promise<number> {
  const payload = mapEquipmentsToDelivery(order, equipments);
  const result = await sapPost<{ DocEntry: number }>("DeliveryNotes", payload);
  return result.DocEntry;
}
