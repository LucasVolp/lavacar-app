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
    queryFn: async () => {
      const response = await salesGoalService.findAll();
      const raw = response as unknown;
      return Array.isArray(raw) 
        ? (raw as SalesGoal[]) 
        : (raw as { data: SalesGoal[] }).data || [];
    },
    enabled,
  });
}

/**
 * Hook para buscar metas de vendas por loja
 */
export function useShopSalesGoals(shopId: string | null, enabled = true) {
  return useQuery({
    queryKey: salesGoalKeys.byShop(shopId || ""),
    queryFn: async () => {
      const response = await salesGoalService.findByShopId(shopId!);
      const raw = response as unknown;
      return Array.isArray(raw) 
        ? (raw as SalesGoal[]) 
        : (raw as { data: SalesGoal[] }).data || [];
    },
    enabled: enabled && !!shopId,
  });
}

/**
 * Hook para buscar metas de vendas por organização
 */
export function useOrganizationSalesGoals(organizationId: string | null, enabled = true) {
  return useQuery({
    queryKey: salesGoalKeys.byOrganization(organizationId || ""),
    queryFn: async () => {
      const response = await salesGoalService.findByOrganizationId(organizationId!);
      const raw = response as unknown;
      return Array.isArray(raw) 
        ? (raw as SalesGoal[]) 
        : (raw as { data: SalesGoal[] }).data || [];
    },
    enabled: enabled && !!organizationId,
  });
}

/**
 * Hook para buscar uma meta específica
 */
export function useSalesGoal(id: string | null, enabled = true) {
  return useQuery({
    queryKey: salesGoalKeys.detail(id || ""),
    queryFn: async () => {
      const response = await salesGoalService.findOne(id!);
      const raw = response as unknown;
      return (raw as { data: SalesGoal }).data || (raw as SalesGoal);
    },
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
    onSuccess: (data, variables) => {
      // Invalidate all sales goals queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: salesGoalKeys.all });

      // Also specifically invalidate the shop query if shopId is provided
      if (variables.shopId) {
        queryClient.invalidateQueries({
          queryKey: salesGoalKeys.byShop(variables.shopId),
          exact: true
        });
      }

      // Invalidate organization query if organizationId is provided
      if (variables.organizationId) {
        queryClient.invalidateQueries({
          queryKey: salesGoalKeys.byOrganization(variables.organizationId),
          exact: true
        });
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
      // Invalidate all sales goals queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: salesGoalKeys.all });

      // Invalidate the specific detail query
      queryClient.invalidateQueries({
        queryKey: salesGoalKeys.detail(data.id),
        exact: true
      });

      // Invalidate shop-specific query if applicable
      if (data.shopId) {
        queryClient.invalidateQueries({
          queryKey: salesGoalKeys.byShop(data.shopId),
          exact: true
        });
      }

      // Invalidate organization-specific query if applicable
      if (data.organizationId) {
        queryClient.invalidateQueries({
          queryKey: salesGoalKeys.byOrganization(data.organizationId),
          exact: true
        });
      }
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
      // Invalidate all sales goals queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: salesGoalKeys.all });
    },
  });
}
