import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blockedTimeService } from "@/services/blockedTime";
import { BlockedTime, CreateBlockedTimePayload, UpdateBlockedTimePayload } from "@/types/blockedTime";
import { handleQueryForbidden } from "./handleQueryForbidden";

export const blockedTimeKeys = {
  all: ["blockedTimes"] as const,
  lists: () => [...blockedTimeKeys.all, "list"] as const,
  byShop: (shopId: string) => [...blockedTimeKeys.lists(), { shopId }] as const,
  details: () => [...blockedTimeKeys.all, "detail"] as const,
  detail: (id: string) => [...blockedTimeKeys.details(), id] as const,
};

export function useBlockedTimes(enabled = true) {
  return useQuery({
    queryKey: blockedTimeKeys.lists(),
    queryFn: async () => {
      let response;
      try {
        response = await blockedTimeService.findAll();
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
      const raw = response as unknown;
      const items = Array.isArray(raw)
        ? (raw as BlockedTime[])
        : (raw as { data: BlockedTime[] }).data || [];
      return items;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBlockedTimesByShop(shopId: string | null, enabled = true) {
  return useQuery({
    queryKey: blockedTimeKeys.byShop(shopId || ""),
    queryFn: async () => {
      let response;
      try {
        response = await blockedTimeService.findAll();
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
      const raw = response as unknown;
      const items = Array.isArray(raw)
        ? (raw as BlockedTime[])
        : (raw as { data: BlockedTime[] }).data || [];
      return items.filter((b: BlockedTime) => b.shopId === shopId);
    },
    enabled: enabled && !!shopId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBlockedTimeById(id: string | null, enabled = true) {
  return useQuery({
    queryKey: blockedTimeKeys.detail(id || ""),
    queryFn: async () => {
      let response;
      try {
        response = await blockedTimeService.findOne(id!);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
      const raw = response as unknown;
      return (raw as { data: BlockedTime }).data || (raw as BlockedTime);
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateBlockedTime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBlockedTimePayload) => blockedTimeService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockedTimeKeys.all });
    },
  });
}

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

export function useDeleteBlockedTime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blockedTimeService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blockedTimeKeys.all });
    },
  });
}

export const useShopBlockedTimes = useBlockedTimesByShop;
