import { useQuery } from "@tanstack/react-query";
import { shopService } from "@/services/shop";
import { FindAllShopDto } from "@/types/shop";

export const useShops = (params?: FindAllShopDto) => {
  return useQuery({
    queryKey: ["shops", params],
    queryFn: async () => await shopService.findAll(),
  });
};
