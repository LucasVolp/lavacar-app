import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shopService } from "@/services/shop";

export const useDeleteShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => await shopService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shops"] });
    },
  });
};
