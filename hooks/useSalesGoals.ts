import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { salesGoalService } from "@/services/salesGoal";
import { CreateSalesGoalPayload, UpdateSalesGoalPayload, SalesGoal } from "@/types/salesGoal";
import { handleQueryForbidden } from "./handleQueryForbidden";

export const salesGoalKeys = {
  all: ["salesGoals"] as const,
  lists: () => [...salesGoalKeys.all, "list"] as const,
  byShop: (shopId: string) => [...salesGoalKeys.lists(), { shopId }] as const,
  byOrganization: (organizationId: string) => [...salesGoalKeys.lists(), { organizationId }] as const,
  details: () => [...salesGoalKeys.all, "detail"] as const,
  detail: (id: string) => [...salesGoalKeys.details(), id] as const,
};

export function useSalesGoals(enabled = true) {
  return useQuery({
    queryKey: salesGoalKeys.lists(),
    queryFn: async () => {
      let response;
      try {
        response = await salesGoalService.findAll();
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
      const raw = response as unknown;
      return Array.isArray(raw) 
        ? (raw as SalesGoal[]) 
        : (raw as { data: SalesGoal[] }).data || [];
    },
    enabled,
  });
}

export function useShopSalesGoals(shopId: string | null, enabled = true) {
  return useQuery({
    queryKey: salesGoalKeys.byShop(shopId || ""),
    queryFn: async () => {
      let response;
      try {
        response = await salesGoalService.findByShopId(shopId!);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
      const raw = response as unknown;
      return Array.isArray(raw) 
        ? (raw as SalesGoal[]) 
        : (raw as { data: SalesGoal[] }).data || [];
    },
    enabled: enabled && !!shopId,
  });
}

export function useOrganizationSalesGoals(organizationId: string | null, enabled = true) {
  return useQuery({
    queryKey: salesGoalKeys.byOrganization(organizationId || ""),
    queryFn: async () => {
      let response;
      try {
        response = await salesGoalService.findByOrganizationId(organizationId!);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
      const raw = response as unknown;
      return Array.isArray(raw) 
        ? (raw as SalesGoal[]) 
        : (raw as { data: SalesGoal[] }).data || [];
    },
    enabled: enabled && !!organizationId,
  });
}

export function useSalesGoal(id: string | null, enabled = true) {
  return useQuery({
    queryKey: salesGoalKeys.detail(id || ""),
    queryFn: async () => {
      let response;
      try {
        response = await salesGoalService.findOne(id!);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
      const raw = response as unknown;
      return (raw as { data: SalesGoal }).data || (raw as SalesGoal);
    },
    enabled: enabled && !!id,
  });
}

export function useCreateSalesGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSalesGoalPayload) => salesGoalService.create(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: salesGoalKeys.all });

      if (variables.shopId) {
        queryClient.invalidateQueries({
          queryKey: salesGoalKeys.byShop(variables.shopId),
          exact: true
        });
      }

      if (variables.organizationId) {
        queryClient.invalidateQueries({
          queryKey: salesGoalKeys.byOrganization(variables.organizationId),
          exact: true
        });
      }
    },
  });
}

export function useUpdateSalesGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSalesGoalPayload }) =>
      salesGoalService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: salesGoalKeys.all });

      queryClient.invalidateQueries({
        queryKey: salesGoalKeys.detail(data.id),
        exact: true
      });

      if (data.shopId) {
        queryClient.invalidateQueries({
          queryKey: salesGoalKeys.byShop(data.shopId),
          exact: true
        });
      }

      if (data.organizationId) {
        queryClient.invalidateQueries({
          queryKey: salesGoalKeys.byOrganization(data.organizationId),
          exact: true
        });
      }
    },
  });
}

export function useDeleteSalesGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => salesGoalService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesGoalKeys.all });
    },
  });
}
