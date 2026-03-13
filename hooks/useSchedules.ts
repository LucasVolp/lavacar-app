import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleService } from "@/services/schedule";
import { CreateSchedulePayload, UpdateSchedulePayload } from "@/types/schedule";
import { handleQueryForbidden } from "./handleQueryForbidden";

export const scheduleKeys = {
  all: ["schedules"] as const,
  lists: () => [...scheduleKeys.all, "list"] as const,
  byShop: (shopId: string) => [...scheduleKeys.lists(), { shopId }] as const,
  details: () => [...scheduleKeys.all, "detail"] as const,
  detail: (id: string) => [...scheduleKeys.details(), id] as const,
};

export function useSchedules(enabled = true) {
  return useQuery({
    queryKey: scheduleKeys.lists(),
    queryFn: async () => {
      try {
        return await scheduleService.findAll();
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
    },
    enabled,
    staleTime: 10 * 60 * 1000,
  });
}

export function useShopSchedules(shopId: string | null, enabled = true) {
  return useQuery({
    queryKey: scheduleKeys.byShop(shopId || ""),
    queryFn: async () => {
      try {
        return await scheduleService.findByShop(shopId!);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
    },
    enabled: enabled && !!shopId,
    staleTime: 10 * 60 * 1000,
  });
}

export function usePublicShopSchedules(shopId: string | null, enabled = true) {
  return useQuery({
    queryKey: [...scheduleKeys.byShop(shopId || ""), "public"],
    queryFn: () => scheduleService.findPublicByShop(shopId!),
    enabled: enabled && !!shopId,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSchedule(id: string | null, enabled = true) {
  return useQuery({
    queryKey: scheduleKeys.detail(id || ""),
    queryFn: async () => {
      try {
        return await scheduleService.findOne(id!);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
    },
    enabled: enabled && !!id,
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSchedulePayload) => scheduleService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    },
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSchedulePayload }) =>
      scheduleService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scheduleService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    },
  });
}
