import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import checklistService, { createChecklist, getChecklistByAppointment } from "@/services/checklist";
import { Checklist, UpdateChecklistPayload } from "@/types/checklist";
import { validateUUID } from "@/utils/validators";

export const checklistKeys = {
  all: ["checklist"] as const,
  byAppointment: (appointmentId: string) =>
    [...checklistKeys.all, appointmentId] as const,
  byUser: (userId: string, page: number, perPage: number) =>
    [...checklistKeys.all, "user", userId, page, perPage] as const,
};

export function useChecklistsByUser(
  userId: string | null,
  page = 1,
  perPage = 10,
  enabled = true
) {
  return useQuery({
    queryKey: checklistKeys.byUser(userId || "", page, perPage),
    queryFn: () => checklistService.findByUser(userId!, page, perPage),
    enabled: enabled && !!userId,
  });
}

export function useGetChecklist(appointmentId: string | null) {
  const normalizedAppointmentId =
    typeof appointmentId === "string" && validateUUID(appointmentId.trim())
      ? appointmentId.trim()
      : null;

  return useQuery<Checklist | null>({
    queryKey: checklistKeys.byAppointment(normalizedAppointmentId || "invalid"),
    enabled: !!normalizedAppointmentId,
    retry: false,
    queryFn: async () => {
      if (!normalizedAppointmentId) return null;

      try {
        return await getChecklistByAppointment(normalizedAppointmentId, {
          silentNotFound: true,
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });
}

export function useCreateChecklist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createChecklist(data),
    onSuccess: (_, formData) => {
      const appointmentId = formData.get("appointmentId");

      if (typeof appointmentId === "string" && validateUUID(appointmentId.trim())) {
        queryClient.invalidateQueries({
          queryKey: checklistKeys.byAppointment(appointmentId.trim()),
        });
      }

      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useChecklist(id: string | null, enabled = true) {
  return useQuery({
    queryKey: ["checklist", "detail", id || ""],
    queryFn: () => checklistService.findOne(id!),
    enabled: enabled && !!id,
  });
}

export function useChecklistByAppointment(
  appointmentId: string | null,
  enabled = true
) {
  return useGetChecklist(enabled ? appointmentId : null);
}

export function useUpdateChecklist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateChecklistPayload }) =>
      checklistService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: checklistKeys.byAppointment(data.appointmentId),
      });
    },
  });
}

export function useDeleteChecklist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; appointmentId?: string }) => checklistService.remove(id),
    onSuccess: (_, variables) => {
      if (
        typeof variables.appointmentId === "string" &&
        validateUUID(variables.appointmentId.trim())
      ) {
        queryClient.invalidateQueries({
          queryKey: checklistKeys.byAppointment(variables.appointmentId.trim()),
        });
      }

      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
