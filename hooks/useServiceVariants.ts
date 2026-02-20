import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateServiceVariantPayload,
  ServiceVariantFilters,
  serviceVariantService,
  UpdateServiceVariantPayload,
} from '@/services/serviceVariant';
import { handleQueryForbidden } from './handleQueryForbidden';

export const serviceVariantKeys = {
  all: ['service-variants'] as const,
  lists: () => [...serviceVariantKeys.all, 'list'] as const,
  list: (filters: ServiceVariantFilters) => [...serviceVariantKeys.lists(), filters] as const,
  details: () => [...serviceVariantKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceVariantKeys.details(), id] as const,
};

export function useServiceVariants(filters: ServiceVariantFilters = {}, enabled = true) {
  return useQuery({
    queryKey: serviceVariantKeys.list(filters),
    queryFn: async () => {
      try {
        return await serviceVariantService.findAll(filters);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useServiceVariant(id: string | null, enabled = true) {
  return useQuery({
    queryKey: serviceVariantKeys.detail(id || ''),
    queryFn: async () => {
      try {
        return await serviceVariantService.findOne(id!);
      } catch (error) {
        handleQueryForbidden(error);
        throw error;
      }
    },
    enabled: enabled && !!id,
  });
}

export function useCreateServiceVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServiceVariantPayload) => serviceVariantService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceVariantKeys.all });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useUpdateServiceVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateServiceVariantPayload }) =>
      serviceVariantService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceVariantKeys.all });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useDeleteServiceVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => serviceVariantService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceVariantKeys.all });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}
