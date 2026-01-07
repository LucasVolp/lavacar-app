import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blockedTimeService } from "@/services/blockedTime";
import { BlockedTime, CreateBlockedTimePayload, UpdateBlockedTimePayload } from "@/types/blockedTime";

// Query Keys
export const blockedTimeKeys = {
  all: ["blockedTimes"] as const,
  lists: () => [...blockedTimeKeys.all, "list"] as const,
  byShop: (shopId: string) => [...blockedTimeKeys.lists(), { shopId }] as const,
  details: () => [...blockedTimeKeys.all, "detail"] as const,
  detail: (id: string) => [...blockedTimeKeys.details(), id] as const,
};

/**
 * Hook para buscar todos os bloqueios
 */
export function useBlockedTimes(enabled = true) {
  return useQuery({
    queryKey: blockedTimeKeys.lists(),
    queryFn: () => blockedTimeService.findAll(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para buscar bloqueios filtrados por shop
 */
export function useBlockedTimesByShop(shopId: string | null, enabled = true) {
  return useQuery({
    queryKey: blockedTimeKeys.byShop(shopId || ""),
    queryFn: async () => {
      const blockedTimes = await blockedTimeService.findAll();
      return blockedTimes.filter((b: BlockedTime) => b.shopId === shopId);
    },
    enabled: enabled && !!shopId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para buscar um bloqueio por ID
 */
export function useBlockedTimeById(id: string | null, enabled = true) {
  return useQuery({
    queryKey: blockedTimeKeys.detail(id || ""),
    queryFn: () => blockedTimeService.findOne(id!),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar um bloqueio
 */
export function useCreateBlockedTime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBlockedTimePayload) => blockedTimeService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockedTimeKeys.all });
    },
  });
}

/**
 * Hook para atualizar um bloqueio
 */
export function useUpdateBlockedTime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBlockedTimePayload }) =>
      blockedTimeService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockedTimeKeys.all });
    },
  });
}

/**
 * Hook para deletar um bloqueio
 */
export function useDeleteBlockedTime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blockedTimeService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockedTimeKeys.all });
    },
  });
}
