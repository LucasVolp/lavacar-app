import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { appointmentService, CreateAppointmentRequest, AppointmentFilters } from "@/services/appointment";
import { Appointment } from "@/types/appointment";

export const appointmentKeys = {
  all: ["appointments"] as const,
  lists: () => [...appointmentKeys.all, "list"] as const,
  list: (filters: object) => [...appointmentKeys.lists(), filters] as const,
  byShop: (shopId: string, filters?: object) => [...appointmentKeys.lists(), { shopId, ...filters }] as const,
  byUser: (userId: string, filters?: object) => [...appointmentKeys.lists(), { userId, ...filters }] as const,
  byShopAndDate: (shopId: string, date: string) =>
    [...appointmentKeys.lists(), { shopId, date }] as const,
  details: () => [...appointmentKeys.all, "detail"] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
};

export function useAppointments(filters: AppointmentFilters = {}, enabled = true) {
  return useQuery({
    queryKey: appointmentKeys.list(filters),
    queryFn: () => appointmentService.findAll(filters),
    enabled,
    staleTime: 1 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useShopAppointments(shopId: string | null, filters: Omit<AppointmentFilters, 'shopId'> = {}, enabled = true) {
  const queryFilters = { ...filters, shopId: shopId! };
  return useQuery({
    queryKey: appointmentKeys.byShop(shopId || "", filters),
    queryFn: () => appointmentService.findAll(queryFilters),
    enabled: enabled && !!shopId,
    staleTime: 1 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useUserAppointments(userId: string | null, filters: Omit<AppointmentFilters, 'userId'> = {}, enabled = true) {
  const queryFilters = { ...filters, userId: userId! };
  return useQuery({
    queryKey: appointmentKeys.byUser(userId || "", filters),
    queryFn: () => appointmentService.findAll(queryFilters),
    enabled: enabled && !!userId,
    staleTime: 1 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useShopAppointmentsByDate(
  shopId: string | null,
  date: string | null,
  enabled = true
) {
  return useQuery({
    queryKey: appointmentKeys.byShopAndDate(shopId || "", date || ""),
    queryFn: () =>
      appointmentService.findAll({
        shopId: shopId!,
        startDate: date!,
        endDate: date!,
      }),
    enabled: enabled && !!shopId && !!date,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useAppointment(id: string | null, enabled = true) {
  return useQuery({
    queryKey: appointmentKeys.detail(id || ""),
    queryFn: () => appointmentService.findOne(id!),
    enabled: enabled && !!id,
  });
}

export type { CreateAppointmentRequest as CreateAppointmentPayload };

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAppointmentRequest) => appointmentService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
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
      userId,
    }: {
      id: string;
      reason?: string;
      userId?: string;
    }) => appointmentService.cancel(id, reason, userId),
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
