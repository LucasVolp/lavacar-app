import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { appointmentService, CreateAppointmentRequest, CreateWalkInRequest, AppointmentFilters } from "@/services/appointment";
import { Appointment } from "@/types/appointment";
import { handleQueryForbidden } from "./handleQueryForbidden";

export const appointmentKeys = {
  all: ["appointments"] as const,
  lists: () => [...appointmentKeys.all, "list"] as const,
  list: (filters: object) => [...appointmentKeys.lists(), filters] as const,
  byShop: (shopId: string, filters?: object) => [...appointmentKeys.lists(), { shopId, ...filters }] as const,
  byUser: (userId: string, filters?: object) => [...appointmentKeys.lists(), { userId, ...filters }] as const,
  byShopAndDate: (shopId: string, date: string) =>
    [...appointmentKeys.lists(), { shopId, date }] as const,
  byVehiclePlate: (plate: string, shopId: string) =>
    [...appointmentKeys.lists(), "vehicle-plate", { plate, shopId }] as const,
  publicAvailability: (shopId: string, date: string, serviceIds: string[]) =>
    [...appointmentKeys.lists(), "public-availability", { shopId, date, serviceIds: serviceIds.join(",") }] as const,
  details: () => [...appointmentKeys.all, "detail"] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
};

export function useAppointments(filters: AppointmentFilters = {}, enabled = true, options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: appointmentKeys.list(filters),
    queryFn: async () => {
      try {
        return await appointmentService.findAll(filters);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
    },
    enabled,
    staleTime: 1 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchInterval: options?.refetchInterval,
  });
}

export function useShopAppointments(shopId: string | null, filters: Omit<AppointmentFilters, 'shopId'> = {}, enabled = true) {
  const queryFilters = { ...filters, shopId: shopId! };
  return useQuery({
    queryKey: appointmentKeys.byShop(shopId || "", filters),
    queryFn: async () => {
      try {
        return await appointmentService.findAll(queryFilters);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
    },
    enabled: enabled && !!shopId,
    staleTime: 1 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchInterval: 15000,
  });
}

export function useUserAppointments(userId: string | null, filters: Omit<AppointmentFilters, 'userId'> = {}, enabled = true) {
  const queryFilters = { ...filters, userId: userId! };
  return useQuery({
    queryKey: appointmentKeys.byUser(userId || "", filters),
    queryFn: async () => {
      try {
        return await appointmentService.findAll(queryFilters);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
    },
    enabled: enabled && !!userId,
    staleTime: 1 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchInterval: 60000,
  });
}

export function useShopAppointmentsByDate(
  shopId: string | null,
  date: string | null,
  enabled = true
) {
  return useQuery({
    queryKey: appointmentKeys.byShopAndDate(shopId || "", date || ""),
    queryFn: async () => {
      try {
        return await appointmentService.findAll({
          shopId: shopId!,
          startDate: date!,
          endDate: date!,
        });
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
    },
    enabled: enabled && !!shopId && !!date,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function usePublicShopAppointmentsByDate(
  shopId: string | null,
  date: string | null,
  enabled = true
) {
  return useQuery({
    queryKey: [...appointmentKeys.byShopAndDate(shopId || "", date || ""), "public"],
    queryFn: () => appointmentService.findPublicByShopAndDate(shopId!, date!),
    enabled: enabled && !!shopId && !!date,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function usePublicAvailability(
  shopId: string | null,
  date: string | null,
  serviceIds: string[],
  enabled = true
) {
  return useQuery({
    queryKey: appointmentKeys.publicAvailability(shopId || "", date || "", serviceIds),
    queryFn: () => appointmentService.findPublicAvailability(shopId!, date!, serviceIds),
    enabled: enabled && !!shopId && !!date && serviceIds.length > 0,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useAppointment(id: string | null, enabled = true) {
  return useQuery({
    queryKey: appointmentKeys.detail(id || ""),
    queryFn: async () => {
      try {
        return await appointmentService.findOne(id!);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
    },
    enabled: enabled && !!id,
  });
}

export type { CreateAppointmentRequest as CreateAppointmentPayload };
export type { CreateWalkInRequest as CreateWalkInPayload };

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAppointmentRequest) => appointmentService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Appointment> }) =>
      appointmentService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      reason,
    }: {
      id: string;
      reason?: string;
    }) => appointmentService.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      id, 
      status, 
      cancellationReason 
    }: { 
      id: string; 
      status: string; 
      cancellationReason?: string;
    }) => appointmentService.update(id, { 
      status: status as Appointment["status"],
      cancellationReason,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}

export function useCreateWalkIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWalkInRequest) => appointmentService.createWalkIn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}

export function useUpcomingAppointmentsByPlate(
  plate: string | null,
  shopId: string | null,
  enabled = true,
) {
  return useQuery({
    queryKey: appointmentKeys.byVehiclePlate(plate || "", shopId || ""),
    queryFn: () => appointmentService.findByVehiclePlate(plate!, shopId!),
    enabled: enabled && !!plate && plate.length >= 7 && !!shopId,
    staleTime: 1 * 60 * 1000,
    retry: false,
  });
}
