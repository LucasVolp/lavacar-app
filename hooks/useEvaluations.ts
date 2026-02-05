import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { evaluationService, EvaluationFilters } from "@/services/evaluation";

export function useShopEvaluations(shopId: string | null, filters: Omit<EvaluationFilters, 'shopId'> = {}, enabled = true) {
  const queryFilters = { ...filters, shopId: shopId! };
  return useQuery({
    queryKey: ["evaluations", "shop", shopId, filters],
    queryFn: () => evaluationService.findAll(queryFilters),
    enabled: enabled && !!shopId,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useShopEvaluationStats(shopId: string | null, enabled = true) {
  return useQuery<{
    averageRating: number;
    totalEvaluations: number;
    ratingDistribution: Record<number, number>;
  }>({
    queryKey: ["evaluations", "stats", shopId],
    queryFn: () => evaluationService.getShopStats(shopId!),
    enabled: enabled && !!shopId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCuratedReviews(
  shopId: string | null,
  limit = 5,
  enabled = true
) {
  const { data: evaluationsData, ...rest } = useShopEvaluations(shopId, {}, enabled);
  const evaluations = evaluationsData?.data ?? [];

  const curatedReviews = evaluations
    .filter((e) => e.rating >= 4)
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, limit);

  return {
    ...rest,
    data: curatedReviews,
    allEvaluations: evaluations,
  };
}

export function useEvaluationSummary(shopId: string | null, enabled = true) {
  const { data: evaluationsData, ...rest } = useShopEvaluations(shopId, {}, enabled);
  const evaluations = evaluationsData?.data ?? [];

  const summary = {
    averageRating:
      evaluations.length > 0
        ? evaluations.reduce((sum, e) => sum + e.rating, 0) / evaluations.length
        : 0,
    totalEvaluations: evaluations.length,
    ratingDistribution: evaluations.reduce(
      (acc, e) => {
        acc[e.rating] = (acc[e.rating] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    ),
  };

  return {
    ...rest,
    data: summary,
  };
}

export function useDeleteEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => evaluationService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
    },
  });
}
