import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { serviceGroupService, ServiceGroupFilters } from "@/services/serviceGroup";
import { CreateServiceGroupPayload, UpdateServiceGroupPayload } from "@/types/serviceGroup";

export function useServiceGroupsByShop(shopId: string | undefined | null, filters: Omit<ServiceGroupFilters, 'shopId'> = {}) {
  const queryFilters = { ...filters, shopId: shopId! };
  return useQuery({
    queryKey: ["serviceGroups", shopId, filters],
    queryFn: () => serviceGroupService.findAll(queryFilters),
    enabled: !!shopId,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useServiceGroup(id: string | undefined | null) {
  return useQuery({
    queryKey: ["serviceGroup", id],
    queryFn: () => serviceGroupService.findOne(id!),
    enabled: !!id,
  });
}

export function useCreateServiceGroup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateServiceGroupPayload) => 
      serviceGroupService.create(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["serviceGroups", variables.shopId] });
    },
  });
}

export function useUpdateServiceGroup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateServiceGroupPayload }) => 
      serviceGroupService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceGroups"] });
    },
  });
}

export function useDeleteServiceGroup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => serviceGroupService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceGroups"] });
    },
  });
}
