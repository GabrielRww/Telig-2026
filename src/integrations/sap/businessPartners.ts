// src/integrations/sap/businessPartners.ts

import { sapGet } from "./client";

export interface SAPBusinessPartner {
  CardCode: string;       // ex: "C001", "F023"
  CardName: string;       // nome do cliente/fornecedor
  CardType: "cCustomer" | "cSupplier" | "cLead";
  Phone1: string;
  EmailAddress: string;
  City: string;
  State: string;
  Address: string;
  FederalTaxID: string;   // CNPJ
  Valid: "tYES" | "tNO";
}

interface SAPListResponse<T> {
  value: T[];
}

// Busca todos os CLIENTES (CardCode começa com "C")
export async function fetchSAPClients(): Promise<SAPBusinessPartner[]> {
  const result = await sapGet<SAPListResponse<SAPBusinessPartner>>(
    "BusinessPartners",
    {
      "$filter": "startswith(CardCode,'C') and Valid eq 'tYES'",
      "$select": "CardCode,CardName,CardType,Phone1,EmailAddress,City,State,Address,FederalTaxID",
      "$orderby": "CardName",
      "$top": "500",
    }
  );
  return result.value;
}

// Busca todos os FORNECEDORES/TÉCNICOS (CardCode começa com "F")
export async function fetchSAPVendors(): Promise<SAPBusinessPartner[]> {
  const result = await sapGet<SAPListResponse<SAPBusinessPartner>>(
    "BusinessPartners",
    {
      "$filter": "startswith(CardCode,'F') and Valid eq 'tYES'",
      "$select": "CardCode,CardName,CardType,Phone1,EmailAddress,City,State",
      "$orderby": "CardName",
      "$top": "500",
    }
  );
  return result.value;
}

// Busca um PN específico pelo CardCode
export async function fetchSAPBusinessPartner(cardCode: string): Promise<SAPBusinessPartner> {
  return sapGet<SAPBusinessPartner>(`BusinessPartners('${cardCode}')`);
}
