import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { organizationInvitesService, SendInviteDTO, AcceptInviteDTO } from "@/services/organization-invites";

export const useSendInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ organizationId, shopId, data }: { organizationId: string, shopId?: string, data: Omit<SendInviteDTO, 'shopId'> }) =>
      organizationInvitesService.sendInvite(organizationId, shopId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["organization-invites", variables.organizationId, variables.shopId] });
    },
  });
};

export const useListInvites = (organizationId?: string, shopId?: string) => {
  return useQuery({
    queryKey: ["organization-invites", organizationId, shopId],
    queryFn: () => organizationInvitesService.listInvites(organizationId!, shopId),
    enabled: !!organizationId,
  });
};

export const useRevokeInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ organizationId, inviteId, shopId }: { organizationId: string, inviteId: string, shopId?: string }) =>
      organizationInvitesService.revokeInvite(organizationId, inviteId, shopId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["organization-invites", variables.organizationId] });
    },
  });
};

export const useGetInviteDetails = (token: string) => {
  return useQuery({
    queryKey: ["invite-details", token],
    queryFn: () => organizationInvitesService.getInviteDetails(token),
    enabled: !!token,
  });
};

export const useAcceptInvite = () => {
  return useMutation({
    mutationFn: (data: AcceptInviteDTO) => organizationInvitesService.acceptInvite(data),
  });
};
