import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { checklistService } from "@/services/checklist";
import { CreateChecklistPayload, UpdateChecklistPayload } from "@/types/checklist";

// Query Keys
export const checklistKeys = {
  all: ["checklists"] as const,
  lists: () => [...checklistKeys.all, "list"] as const,
  details: () => [...checklistKeys.all, "detail"] as const,
  detail: (id: string) => [...checklistKeys.details(), id] as const,
  byAppointment: (appointmentId: string) => [...checklistKeys.details(), "appointment", appointmentId] as const,
};

/**
 * Hook para buscar um checklist por ID
 */
export function useChecklist(id: string | null, enabled = true) {
  return useQuery({
    queryKey: checklistKeys.detail(id || ""),
    queryFn: () => checklistService.findOne(id!),
    enabled: enabled && !!id,
  });
}

/**
 * Hook para buscar um checklist por Appointment ID
 */
export function useChecklistByAppointment(appointmentId: string | null, enabled = true) {
  return useQuery({
    queryKey: checklistKeys.byAppointment(appointmentId || ""),
    queryFn: () => checklistService.findByAppointment(appointmentId!),
    enabled: enabled && !!appointmentId,
    retry: false, // Don't retry if not found (404 is expected if not created yet)
  });
}

/**
 * Hook para criar um checklist
 */
export function useCreateChecklist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateChecklistPayload) => checklistService.create(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: checklistKeys.byAppointment(variables.appointmentId) });
      queryClient.invalidateQueries({ queryKey: ["appointments", "detail", variables.appointmentId] }); // Update appointment details too
    },
  });
}

/**
 * Hook para atualizar um checklist
 */
export function useUpdateChecklist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateChecklistPayload }) =>
      checklistService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: checklistKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: checklistKeys.byAppointment(data.appointmentId) });
    },
  });
}

/**
 * Hook para deletar um checklist
 */
export function useDeleteChecklist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string, appointmentId?: string }) => checklistService.remove(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: checklistKeys.detail(variables.id) });
      if (variables.appointmentId) {
          queryClient.invalidateQueries({ queryKey: checklistKeys.byAppointment(variables.appointmentId) });
          queryClient.invalidateQueries({ queryKey: ["appointments", "detail", variables.appointmentId] });
      }
    },
  });
}
