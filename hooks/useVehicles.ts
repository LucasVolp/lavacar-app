import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleService } from "@/services/vehicle";
import { CreateVehiclePayload, UpdateVehiclePayload } from "@/types/vehicle";

// Query Keys
export const vehicleKeys = {
  all: ["vehicles"] as const,
  lists: () => [...vehicleKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...vehicleKeys.lists(), filters] as const,
  byUser: (userId: string) => [...vehicleKeys.lists(), { userId }] as const,
  details: () => [...vehicleKeys.all, "detail"] as const,
  detail: (id: string) => [...vehicleKeys.details(), id] as const,
};

/**
 * Hook para buscar todos os veículos
 */
export function useVehicles(enabled = true) {
  return useQuery({
    queryKey: vehicleKeys.lists(),
    queryFn: () => vehicleService.findAll(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar veículos de um usuário específico
 * Nota: O backend deve filtrar automaticamente pelo token JWT
 */
export function useUserVehicles(userId: string | null, enabled = true) {
  return useQuery({
    queryKey: vehicleKeys.byUser(userId || ""),
    queryFn: async () => {
      const allVehicles = await vehicleService.findAll();
      // Filtra pelo userId no frontend caso o backend não faça
      return allVehicles.filter((vehicle) => vehicle.userId === userId);
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para buscar um veículo específico
 */
export function useVehicle(id: string | null, enabled = true) {
  return useQuery({
    queryKey: vehicleKeys.detail(id || ""),
    queryFn: () => vehicleService.findOne(id!),
    enabled: enabled && !!id,
  });
}

/**
 * Hook para criar um veículo
 */
export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVehiclePayload) => vehicleService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    },
  });
}

/**
 * Hook para atualizar um veículo
 */
export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateVehiclePayload }) =>
      vehicleService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    },
  });
}

/**
 * Hook para deletar um veículo
 */
export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehicleService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    },
  });
}
