import { useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleService } from "@/services/schedule";
import { CreateSchedulePayload } from "@/types/schedule";

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSchedulePayload) => scheduleService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["schedules", variables.shopId] });
    },
  });
};
