import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { shopClientService } from "@/services/shopClient";
import {
  CreateShopClientPayload,
  UpdateShopClientPayload,
  ShopClientFilters,
} from "@/types/shopClient";
import { handleQueryForbidden } from "./handleQueryForbidden";

export const shopClientKeys = {
  all: ["shopClients"] as const,
  lists: () => [...shopClientKeys.all, "list"] as const,
  list: (filters: ShopClientFilters) => [...shopClientKeys.lists(), filters] as const,
  byShop: (shopId: string, filters?: Omit<ShopClientFilters, "shopId">) =>
    [...shopClientKeys.lists(), { shopId, ...filters }] as const,
  count: (shopId: string) => [...shopClientKeys.all, "count", { shopId }] as const,
  details: () => [...shopClientKeys.all, "detail"] as const,
  detail: (id: string) => [...shopClientKeys.details(), id] as const,
  check: (shopId: string, userId: string) => [...shopClientKeys.all, "check", shopId, userId] as const,
};

export function useShopClients(filters?: ShopClientFilters, enabled = true) {
  return useQuery({
    queryKey: shopClientKeys.list(filters || {}),
    queryFn: async () => {
      try {
        return await shopClientService.findAll(filters);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
    },
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useShopClientsByShop(
  shopId: string | null,
  filters?: Omit<ShopClientFilters, "shopId">,
  enabled = true
) {
  return useQuery({
    queryKey: shopClientKeys.byShop(shopId || "", filters),
    queryFn: async () => {
      try {
        return await shopClientService.findByShopId(shopId!, filters);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
    },
    enabled: enabled && !!shopId,
    placeholderData: keepPreviousData,
  });
}

export function useCheckShopClient(shopId: string | null, userId: string | null, enabled = true) {
  return useQuery({
    queryKey: shopClientKeys.check(shopId || "", userId || ""),
    queryFn: () => shopClientService.findByShopAndUser(shopId!, userId!),
    enabled: enabled && !!shopId && !!userId,
    retry: false,
  });
}

export function useShopClientsCount(shopId: string | null, enabled = true) {
  return useQuery({
    queryKey: shopClientKeys.count(shopId || ""),
    queryFn: async () => {
      try {
        return await shopClientService.countByShopId(shopId!);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
    },
    enabled: enabled && !!shopId,
  });
}

export function useShopClient(id: string | null, enabled = true) {
  return useQuery({
    queryKey: shopClientKeys.detail(id || ""),
    queryFn: async () => {
      try {
        return await shopClientService.findOne(id!);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
    },
    enabled: enabled && !!id,
  });
}

export function useCreateShopClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShopClientPayload) => shopClientService.create(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: shopClientKeys.byShop(variables.shopId) });
      queryClient.invalidateQueries({ queryKey: shopClientKeys.count(variables.shopId) });
    },
  });
}

export function useUpdateShopClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateShopClientPayload }) =>
      shopClientService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopClientKeys.all });
    },
  });
}

export function useDeleteShopClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shopClientService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopClientKeys.all });
    },
  });
}
