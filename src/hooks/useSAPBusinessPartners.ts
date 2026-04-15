// src/hooks/useSAPBusinessPartners.ts

import { useQuery } from "@tanstack/react-query";
import { fetchSAPClients, fetchSAPVendors } from "@/integrations/sap/businessPartners";
import { isSAPConfigured } from "@/integrations/sap/client";

export function useSAPClients() {
  return useQuery({
    queryKey: ["sap", "clients"],
    queryFn: fetchSAPClients,
    staleTime: 5 * 60 * 1000, // cache 5 minutos
    retry: 2,
    enabled: isSAPConfigured(),
  });
}

export function useSAPVendors() {
  return useQuery({
    queryKey: ["sap", "vendors"],
    queryFn: fetchSAPVendors,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: isSAPConfigured(),
  });
}
