import { useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceService } from "@/services/service";
import { CreateServicePayload } from "@/types/services";

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServicePayload) => serviceService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["services", variables.shopId] });
    },
  });
};
