import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shopService } from "@/services/shop";
import { CreateShopDto, UpdateShopDto } from "@/types/shop";

export const shopKeys = {
  all: ["shops"] as const,
  lists: () => [...shopKeys.all, "list"] as const,
  bySlug: (slug: string) => [...shopKeys.lists(), { slug }] as const,
  details: () => [...shopKeys.all, "detail"] as const,
  detail: (id: string) => [...shopKeys.details(), id] as const,
};

export function useShops(enabled = true) {
  return useQuery({
    queryKey: shopKeys.lists(),
    queryFn: () => shopService.findAll(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useShopBySlug(slug: string | null, enabled = true) {
  return useQuery({
    queryKey: shopKeys.bySlug(slug || ""),
    queryFn: () => shopService.findBySlug(slug!),
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useShopById(id: string | null, enabled = true) {
  return useQuery({
    queryKey: shopKeys.detail(id || ""),
    queryFn: () => shopService.findOne(id!),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShopDto) => shopService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopKeys.all });
    },
  });
}

export function useUpdateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateShopDto }) =>
      shopService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopKeys.all });
    },
  });
}

export function useDeleteShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shopService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopKeys.all });
    },
  });
}
