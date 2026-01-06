import { useQuery } from "@tanstack/react-query";
import { shopService } from "@/services/shop";

export const useShop = (id: string) => {
  return useQuery({
    queryKey: ["shop", id],
    queryFn: async () => await shopService.findOne(id),
    enabled: !!id,
  });
};
