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
  // Create a deterministic query key with serialized filters to avoid object mutation issues
  const queryKey = [
    "organizations",
    organizationId,
    "dashboard-metrics",
    filters?.period || "30d",
    filters?.startDate,
    filters?.endDate,
  ];

  return useQuery({
    queryKey,
    queryFn: () => organizationService.findDashboardMetrics(organizationId!, filters),
    enabled: !!organizationId,
    staleTime: 30 * 1000, // 30s - data becomes stale quickly for dashboards
    gcTime: 5 * 60 * 1000, // 5m - garbage collection, then remove from cache
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

export function useAssignMemberToShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, shopId }: { memberId: string; shopId: string }) =>
      organizationMemberService.assignToShop(memberId, shopId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-members"] });
    },
  });
}

export function useRemoveMemberFromShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shopManagerId: string) => organizationMemberService.removeFromShop(shopManagerId),
    onSuccess: () => {
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
