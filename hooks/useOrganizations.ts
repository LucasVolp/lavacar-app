import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationService } from "@/services/organizations";
import { organizationMemberService } from "@/services/organization-members";
import type { OrganizationInsightsPeriod } from "@/types/organization";

export function useOrganizations() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: organizationService.findAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useOrganization(id: string | undefined) {
  return useQuery({
    queryKey: ["organizations", id],
    queryFn: () => organizationService.findById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useOrganizationDashboardMetrics(
  organizationId: string | undefined,
  filters?: { period?: OrganizationInsightsPeriod; startDate?: string; endDate?: string },
) {
  return useQuery({
    queryKey: ["organizations", organizationId, "dashboard-metrics", filters],
    queryFn: () => organizationService.findDashboardMetrics(organizationId!, filters),
    enabled: !!organizationId,
    staleTime: 60 * 1000,
  });
}

export function useOrganizationByOwner(ownerId: string | undefined) {
  return useQuery({
    queryKey: ["organizations", "owner", ownerId],
    queryFn: () => organizationService.findByOwner(ownerId!),
    enabled: !!ownerId,
    retry: 1,
  });
}

export function useOrganizationMembers(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["organization-members", organizationId],
    queryFn: () => organizationMemberService.findByOrganizationId(organizationId!),
    enabled: !!organizationId,
  });
}

export function useOrganizationMembersByShop(shopId: string | undefined) {
  return useQuery({
    queryKey: ["organization-members", "shop", shopId],
    queryFn: () => organizationMemberService.findByShopId(shopId!),
    enabled: !!shopId,
  });
}

export function useUpdateOrganizationMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { role?: string; isActive?: boolean } }) =>
      organizationMemberService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["organization-members"] });
    },
  });
}

export function useDeleteOrganizationMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => organizationMemberService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["organization-members"] });
    },
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string; document?: string; logoUrl?: string; ownerId: string }) =>
      organizationService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
