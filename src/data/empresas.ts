import { normalizeSearch } from "@/lib/search";

export interface CompanyRecord {
  id: number;
  nome: string;
  cnpj: string;
  cidade: string;
  contato: string;
  email: string;
  status: string;
}

export const registeredCompanies: CompanyRecord[] = [
  { id: 1, nome: "Volare Segurança", cnpj: "12.345.678/0001-90", cidade: "Passo Fundo/RS", contato: "(54) 3311-1234", email: "contato@volare.com.br", status: "Ativa" },
  { id: 2, nome: "Tracker Brasil", cnpj: "23.456.789/0001-01", cidade: "Porto Alegre/RS", contato: "(51) 3222-5678", email: "contato@tracker.com.br", status: "Ativa" },
  { id: 3, nome: "LogSafe", cnpj: "34.567.890/0001-12", cidade: "Caxias do Sul/RS", contato: "(54) 3221-9012", email: "contato@logsafe.com.br", status: "Ativa" },
  { id: 4, nome: "TransGuarda", cnpj: "45.678.901/0001-23", cidade: "Passo Fundo/RS", contato: "(54) 3311-3456", email: "contato@transguarda.com.br", status: "Inativa" },
  { id: 5, nome: "FleetShield", cnpj: "56.789.012/0001-34", cidade: "Erechim/RS", contato: "(54) 3321-7890", email: "contato@fleetshield.com.br", status: "Ativa" },
];

export function normalizeCompanySearch(value: string) {
  return normalizeSearch(value);
}
