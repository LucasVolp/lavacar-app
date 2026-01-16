import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService, CreateAppointmentRequest } from "@/services/appointment";
import { Appointment } from "@/types/appointment";

// Query Keys
export const appointmentKeys = {
  all: ["appointments"] as const,
  lists: () => [...appointmentKeys.all, "list"] as const,
  list: (filters: object) => [...appointmentKeys.lists(), filters] as const,
  byShop: (shopId: string) => [...appointmentKeys.lists(), { shopId }] as const,
  byUser: (userId: string) => [...appointmentKeys.lists(), { userId }] as const,
  byShopAndDate: (shopId: string, date: string) =>
    [...appointmentKeys.lists(), { shopId, date }] as const,
  details: () => [...appointmentKeys.all, "detail"] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
};

interface AppointmentFilters {
  shopId?: string;
  userId?: string;
  status?: Appointment["status"];
  startDate?: string;
  endDate?: string;
}

/**
 * Hook para buscar agendamentos com filtros
 */
export function useAppointments(filters: AppointmentFilters = {}, enabled = true) {
  return useQuery({
    queryKey: appointmentKeys.list(filters),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryFn: () => appointmentService.findAll(filters as any),
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
}

/**
 * Hook para buscar agendamentos do usuário logado
 */
export function useUserAppointments(userId: string | null, enabled = true) {
  return useQuery({
    queryKey: appointmentKeys.byUser(userId || ""),
    queryFn: () => appointmentService.findAll({ userId: userId! }),
    enabled: enabled && !!userId,
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Hook para buscar agendamentos de uma loja em uma data específica
 * Útil para calcular slots disponíveis
 */
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
    staleTime: 0, // Sempre buscar dados frescos para disponibilidade
    refetchOnMount: 'always', // Sempre refetch ao montar o componente
  });
}

/**
 * Hook para buscar um agendamento específico
 */
export function useAppointment(id: string | null, enabled = true) {
  return useQuery({
    queryKey: appointmentKeys.detail(id || ""),
    queryFn: () => appointmentService.findOne(id!),
    enabled: enabled && !!id,
  });
}

// Re-exporta o tipo do service
export type { CreateAppointmentRequest as CreateAppointmentPayload };

/**
 * Hook para criar um agendamento
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAppointmentRequest) => appointmentService.create(payload),
    onSuccess: () => {
      // Invalida todas as queries de agendamentos para garantir dados frescos
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      // Invalida especificamente as listas (incluindo byShopAndDate)
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
}

/**
 * Hook para atualizar um agendamento
 */
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

/**
 * Hook para cancelar um agendamento
 */
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

/**
 * Hook para atualizar apenas o status de um agendamento
 */
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
