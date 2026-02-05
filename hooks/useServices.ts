import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { serviceService, ServiceFilters } from "@/services/service";
import { CreateServicePayload, UpdateServicePayload } from "@/types/services";

export const serviceKeys = {
  all: ["services"] as const,
  lists: () => [...serviceKeys.all, "list"] as const,
  list: (filters: ServiceFilters) => [...serviceKeys.lists(), filters] as const,
  byShop: (shopId: string, filters?: object) => [...serviceKeys.lists(), { shopId, ...filters }] as const,
  details: () => [...serviceKeys.all, "detail"] as const,
  detail: (id: string) => [...serviceKeys.details(), id] as const,
};

export function useServices(filters: ServiceFilters = {}, enabled = true) {
  return useQuery({
    queryKey: serviceKeys.list(filters),
    queryFn: () => serviceService.findAll(filters),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useServicesByShop(shopId: string | null, filters: Omit<ServiceFilters, 'shopId'> = {}, enabled = true) {
  const queryFilters = { ...filters, shopId: shopId! };
  return useQuery({
    queryKey: serviceKeys.byShop(shopId || "", filters),
    queryFn: () => serviceService.findAll(queryFilters),
    enabled: enabled && !!shopId,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useService(id: string | null, enabled = true) {
  return useQuery({
    queryKey: serviceKeys.detail(id || ""),
    queryFn: () => serviceService.findOne(id!),
    enabled: enabled && !!id,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServicePayload) => serviceService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateServicePayload }) =>
      serviceService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => serviceService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
}
