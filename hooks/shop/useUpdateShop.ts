import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shopService } from "@/services/shop";
import { UpdateShopDto } from "@/types/shop";

export const useUpdateShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateShopDto }) =>
      await shopService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shops"] });
      queryClient.invalidateQueries({ queryKey: ["shop", variables.id] });
    },
  });
};
