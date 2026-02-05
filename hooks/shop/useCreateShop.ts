import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shopService } from "@/services/shop";
import { CreateShopDto } from "@/types/shop";

export const useCreateShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateShopDto) => await shopService.create(data),
    onSuccess: (_, variables) => {
      // Invalidate shops list (if used independently)
      queryClient.invalidateQueries({ queryKey: ["shops"] });
      
      // Invalidate the specific organization to update its nested shops list
      queryClient.invalidateQueries({ queryKey: ["organizations", variables.organizationId] });
      
      // Optionally invalidate the main organizations list if it shows shop counts
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};