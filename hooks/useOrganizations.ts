import { useQuery } from "@tanstack/react-query";
import { organizationService } from "@/services/organizations";

/**
 * Hook para buscar todas as organizações
 * 
 * Nesta fase, retorna a primeira organization disponível
 * pois não temos autenticação para determinar qual org o usuário pertence
 */
export function useOrganizations() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: organizationService.findAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar organização por ID
 */
export function useOrganization(id: string | undefined) {
  return useQuery({
    queryKey: ["organizations", id],
    queryFn: () => organizationService.findById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
