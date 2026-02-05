import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { salesGoalService } from "@/services/salesGoal";
import { CreateSalesGoalPayload, UpdateSalesGoalPayload } from "@/types/salesGoal";

// Query Keys
export const salesGoalKeys = {
  all: ["salesGoals"] as const,
  lists: () => [...salesGoalKeys.all, "list"] as const,
  byShop: (shopId: string) => [...salesGoalKeys.lists(), { shopId }] as const,
  byOrganization: (organizationId: string) => [...salesGoalKeys.lists(), { organizationId }] as const,
  details: () => [...salesGoalKeys.all, "detail"] as const,
  detail: (id: string) => [...salesGoalKeys.details(), id] as const,
};

/**
 * Hook para buscar todas as metas de vendas
 */
export function useSalesGoals(enabled = true) {
  return useQuery({
    queryKey: salesGoalKeys.lists(),
    queryFn: () => salesGoalService.findAll(),
    enabled,
  });
}

/**
 * Hook para buscar metas de vendas por loja
 */
export function useShopSalesGoals(shopId: string | null, enabled = true) {
  return useQuery({
    queryKey: salesGoalKeys.byShop(shopId || ""),
    queryFn: () => salesGoalService.findByShopId(shopId!),
    enabled: enabled && !!shopId,
  });
}

/**
 * Hook para buscar metas de vendas por organização
 */
export function useOrganizationSalesGoals(organizationId: string | null, enabled = true) {
  return useQuery({
    queryKey: salesGoalKeys.byOrganization(organizationId || ""),
    queryFn: () => salesGoalService.findByOrganizationId(organizationId!),
    enabled: enabled && !!organizationId,
  });
}

/**
 * Hook para buscar uma meta específica
 */
export function useSalesGoal(id: string | null, enabled = true) {
  return useQuery({
    queryKey: salesGoalKeys.detail(id || ""),
    queryFn: () => salesGoalService.findOne(id!),
    enabled: enabled && !!id,
  });
}

/**
 * Hook para criar uma meta de vendas
 */
export function useCreateSalesGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSalesGoalPayload) => salesGoalService.create(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: salesGoalKeys.lists() });
      if (variables.shopId) {
        queryClient.invalidateQueries({ queryKey: salesGoalKeys.byShop(variables.shopId) });
      }
      if (variables.organizationId) {
        queryClient.invalidateQueries({ queryKey: salesGoalKeys.byOrganization(variables.organizationId) });
      }
    },
  });
}

/**
 * Hook para atualizar uma meta de vendas
 */
export function useUpdateSalesGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSalesGoalPayload }) =>
      salesGoalService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: salesGoalKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: salesGoalKeys.lists() });
      if (data.shopId) queryClient.invalidateQueries({ queryKey: salesGoalKeys.byShop(data.shopId) });
      if (data.organizationId) queryClient.invalidateQueries({ queryKey: salesGoalKeys.byOrganization(data.organizationId) });
    },
  });
}

/**
 * Hook para deletar uma meta de vendas
 */
export function useDeleteSalesGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => salesGoalService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesGoalKeys.all });
    },
  });
}
