import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceGroupService } from "@/services/serviceGroup";
import { ServiceGroup, CreateServiceGroupPayload, UpdateServiceGroupPayload } from "@/types/serviceGroup";

/**
 * Hook para buscar todos os grupos de serviço de um shop
 */
export function useServiceGroupsByShop(shopId: string | undefined | null) {
  return useQuery<ServiceGroup[]>({
    queryKey: ["serviceGroups", shopId],
    queryFn: () => serviceGroupService.findAll(shopId || undefined),
    enabled: !!shopId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar um grupo de serviço por ID
 */
export function useServiceGroup(id: string | undefined | null) {
  return useQuery<ServiceGroup>({
    queryKey: ["serviceGroup", id],
    queryFn: () => serviceGroupService.findOne(id!),
    enabled: !!id,
  });
}

/**
 * Hook para criar um grupo de serviço
 */
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

/**
 * Hook para atualizar um grupo de serviço
 */
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

/**
 * Hook para deletar um grupo de serviço
 */
export function useDeleteServiceGroup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => serviceGroupService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceGroups"] });
    },
  });
}
