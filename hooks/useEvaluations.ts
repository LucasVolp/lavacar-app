import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { evaluationService, EvaluationFilters } from "@/services/evaluation";
import type { CreateEvaluationPayload } from "@/types/evaluation";
import { handleQueryForbidden } from "./handleQueryForbidden";

export function useShopEvaluations(shopId: string | null, filters: Omit<EvaluationFilters, 'shopId'> = {}, enabled = true) {
  const queryFilters = { ...filters, shopId: shopId! };
  return useQuery({
    queryKey: ["evaluations", "shop", shopId, filters],
    queryFn: async () => {
      try {
        return await evaluationService.findAll(queryFilters);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
    },
    enabled: enabled && !!shopId,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function usePublicShopEvaluations(shopId: string | null, filters: Omit<EvaluationFilters, 'shopId'> = {}, enabled = true) {
  const queryFilters = { ...filters, shopId: shopId! };
  return useQuery({
    queryKey: ["evaluations", "public", "shop", shopId, filters],
    queryFn: () => evaluationService.findPublicByShop(queryFilters as { shopId: string; rating?: number; page?: number; perPage?: number }),
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
    queryFn: async () => {
      try {
        return await evaluationService.getShopStats(shopId!);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
    },
    enabled: enabled && !!shopId,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePublicShopEvaluationStats(shopId: string | null, enabled = true) {
  return useQuery<{
    averageRating: number;
    totalEvaluations: number;
    ratingDistribution: Record<number, number>;
  }>({
    queryKey: ["evaluations", "public", "stats", shopId],
    queryFn: () => evaluationService.getPublicShopStats(shopId!),
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

export function usePublicCuratedReviews(
  shopId: string | null,
  limit = 5,
  enabled = true
) {
  const { data: evaluationsData, ...rest } = usePublicShopEvaluations(shopId, { perPage: 100 }, enabled);
  const evaluations = evaluationsData?.data ?? [];

  const featuredReviews = evaluations
    .filter((e) => e.rating >= 4)
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Fallback: se não houver "reviews destaque", usa as avaliações mais recentes
  // para não esconder completamente a seção quando existir histórico.
  const fallbackReviews = evaluations
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const curatedReviews = (featuredReviews.length > 0 ? featuredReviews : fallbackReviews).slice(0, limit);

  return {
    ...rest,
    data: curatedReviews,
    allEvaluations: evaluations,
  };
}

export function useUserEvaluations(userId: string | null, filters: Omit<EvaluationFilters, 'userId'> = {}, enabled = true) {
  const queryFilters = { ...filters, userId: userId! };
  return useQuery({
    queryKey: ["evaluations", "user", userId, filters],
    queryFn: async () => {
      try {
        return await evaluationService.findAll(queryFilters);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
    },
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
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

export function usePublicEvaluationSummary(shopId: string | null, enabled = true) {
  const { data: stats, ...rest } = usePublicShopEvaluationStats(shopId, enabled);

  const summary = {
    averageRating: stats?.averageRating ?? 0,
    totalEvaluations: stats?.totalEvaluations ?? 0,
    ratingDistribution: stats?.ratingDistribution ?? {},
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

export function useCreateEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEvaluationPayload) => evaluationService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
