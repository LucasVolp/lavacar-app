import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shopService } from "@/services/shop";
import { CreateShopDto } from "@/types/shop";

export const useCreateShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateShopDto) => await shopService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shops"] });

      queryClient.invalidateQueries({ queryKey: ["organizations", variables.organizationId] });

      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};