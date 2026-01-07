import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceService } from "@/services/service";
import { CreateServicePayload, UpdateServicePayload } from "@/types/services";

// Query Keys
export const serviceKeys = {
  all: ["services"] as const,
  lists: () => [...serviceKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...serviceKeys.lists(), filters] as const,
  byShop: (shopId: string) => [...serviceKeys.lists(), { shopId }] as const,
  details: () => [...serviceKeys.all, "detail"] as const,
  detail: (id: string) => [...serviceKeys.details(), id] as const,
};

/**
 * Hook para buscar todos os serviços
 */
export function useServices(enabled = true) {
  return useQuery({
    queryKey: serviceKeys.lists(),
    queryFn: () => serviceService.findAll(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar serviços de uma loja específica (todos, ativos e inativos)
 */
export function useServicesByShop(shopId: string | null, enabled = true) {
  return useQuery({
    queryKey: serviceKeys.byShop(shopId || ""),
    queryFn: async () => {
      const allServices = await serviceService.findAll();
      return allServices.filter((service) => service.shopId === shopId);
    },
    enabled: enabled && !!shopId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para buscar um serviço específico
 */
export function useService(id: string | null, enabled = true) {
  return useQuery({
    queryKey: serviceKeys.detail(id || ""),
    queryFn: () => serviceService.findOne(id!),
    enabled: enabled && !!id,
  });
}

/**
 * Hook para criar um serviço
 */
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServicePayload) => serviceService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
}

/**
 * Hook para atualizar um serviço
 */
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

/**
 * Hook para deletar um serviço
 */
export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => serviceService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
}
