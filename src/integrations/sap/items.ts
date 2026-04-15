// src/integrations/sap/items.ts

import { sapGet } from "./client";

export interface SAPItem {
  ItemCode: string;
  ItemName: string;
  QuantityOnStock: number;
  ManageSerialNumbers: "tYES" | "tNO";
  SalesItem: "tYES" | "tNO";
  InventoryItem: "tYES" | "tNO";
}

export interface SAPSerialNumber {
  ItemCode: string;
  InternalSerialNumber: string;
  ManufacturerSerialNumber: string;
  Status: string;
  WarehouseCode: string;
}

// Busca produtos que gerenciam número de série (equipamentos)
export async function fetchSAPEquipmentItems(): Promise<SAPItem[]> {
  const result = await sapGet<{ value: SAPItem[] }>(
    "Items",
    {
      "$filter": "ManageSerialNumbers eq 'tYES' and InventoryItem eq 'tYES'",
      "$select": "ItemCode,ItemName,QuantityOnStock,ManageSerialNumbers",
      "$top": "200",
    }
  );
  return result.value;
}

// Busca números de série de um produto específico
export async function fetchSAPSerialNumbers(itemCode: string): Promise<SAPSerialNumber[]> {
  const result = await sapGet<{ value: SAPSerialNumber[] }>(
    "SerialNumbers",
    {
      "$filter": `ItemCode eq '${itemCode}'`,
      "$select": "ItemCode,InternalSerialNumber,ManufacturerSerialNumber,Status,WarehouseCode",
      "$top": "500",
    }
  );
  return result.value;
}
