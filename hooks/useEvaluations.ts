import { useQuery } from "@tanstack/react-query";
import { evaluationService } from "@/services/evaluation";
import { Evaluation } from "@/types/evaluation";

// Hook para buscar todas as avaliações de um shop
export function useShopEvaluations(shopId: string | null, enabled = true) {
  return useQuery<Evaluation[]>({
    queryKey: ["evaluations", "shop", shopId],
    queryFn: () => evaluationService.findAll(shopId!),
    enabled: enabled && !!shopId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook para buscar estatísticas de avaliações do shop
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

// Hook para buscar avaliações curadas (melhores avaliações para exibição)
export function useCuratedReviews(
  shopId: string | null,
  limit = 5,
  enabled = true
) {
  const { data: evaluations = [], ...rest } = useShopEvaluations(shopId, enabled);

  // Filtra e ordena as avaliações para exibição curada
  const curatedReviews = evaluations
    // Filtrar apenas avaliações com nota >= 4
    .filter((e) => e.rating >= 4)
    // Ordenar por rating (maior primeiro), depois por data (mais recente)
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    // Limitar quantidade
    .slice(0, limit);

  return {
    ...rest,
    data: curatedReviews,
    allEvaluations: evaluations,
  };
}

// Calcula a média e total de avaliações
export function useEvaluationSummary(shopId: string | null, enabled = true) {
  const { data: evaluations = [], ...rest } = useShopEvaluations(shopId, enabled);

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
