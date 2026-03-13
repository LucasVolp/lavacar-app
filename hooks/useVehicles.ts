import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleService } from "@/services/vehicle";
import { CreateVehiclePayload, UpdateVehiclePayload, Vehicle } from "@/types/vehicle";

export const vehicleKeys = {
  all: ["vehicles"] as const,
  lists: () => [...vehicleKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...vehicleKeys.lists(), filters] as const,
  byUser: (userId: string) => [...vehicleKeys.lists(), { userId }] as const,
  byPlate: (plate: string) => [...vehicleKeys.all, "plate", plate] as const,
  details: () => [...vehicleKeys.all, "detail"] as const,
  detail: (id: string) => [...vehicleKeys.details(), id] as const,
};

export function useVehicles(enabled = true) {
  return useQuery({
    queryKey: vehicleKeys.lists(),
    queryFn: async (): Promise<Vehicle[]> => {
      const result = await vehicleService.findAll();
      return result.data ?? [];
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserVehicles(userId: string | null, enabled = true) {
  return useQuery({
    queryKey: vehicleKeys.byUser(userId || ""),
    queryFn: async (): Promise<Vehicle[]> => {
      const result = await vehicleService.findAll({ userId: userId!, perPage: 100 });
      return result.data ?? [];
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useVehicle(id: string | null, enabled = true) {
  return useQuery({
    queryKey: vehicleKeys.detail(id || ""),
    queryFn: () => vehicleService.findOne(id!),
    enabled: enabled && !!id,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVehiclePayload) => vehicleService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    },
  });
}

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

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehicleService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    },
  });
}

export function useVehicleByPlate(plate: string | null, enabled = true) {
  return useQuery({
    queryKey: vehicleKeys.byPlate(plate || ""),
    queryFn: () => vehicleService.findByPlate(plate!),
    enabled: enabled && !!plate && plate.length >= 7,
    staleTime: 1 * 60 * 1000,
    retry: false,
  });
}
