import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationService } from "@/services/organizations";
import { organizationMemberService } from "@/services/organization-members";

/**
 * Hook para buscar todas as organizações
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

/**
 * Hook para buscar organizações de um owner específico
 */
export function useOrganizationByOwner(ownerId: string | undefined) {
  return useQuery({
    queryKey: ["organizations", "owner", ownerId],
    queryFn: () => organizationService.findByOwner(ownerId!),
    enabled: !!ownerId,
    retry: 1, 
  });
}

/**
 * Hook para buscar membros de uma organização
 */
export function useOrganizationMembers(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["organization-members", organizationId],
    queryFn: () => organizationMemberService.findByOrganizationId(organizationId!),
    enabled: !!organizationId,
  });
}

/**
 * Hook para atualizar um membro da organização
 */
export function useUpdateOrganizationMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { role?: string; isActive?: boolean } }) =>
      organizationMemberService.update(id, payload),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["organization-members"] });
    },
  });
}

/**
 * Hook para remover um membro da organização
 */
export function useDeleteOrganizationMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => organizationMemberService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["organization-members"] });
    },
  });
}