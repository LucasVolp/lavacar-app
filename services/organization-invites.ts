import axiosInstance from "./axiosInstance";
import { Role } from "@/types/enums";

export interface SendInviteDTO {
  email: string;
  role: Role;
  shopId: string;
}

export interface InviteResponse {
  id: string;
  email: string;
  role: Role;
  status: "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";
  token: string;
  shopId: string;
  organizationId: string;
  inviterId: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcceptInviteDTO {
  token: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

export interface InviteDetailsResponse {
  userExists: boolean;
  invite: {
    email: string;
    role: Role;
    expiresAt: string;
  };
  organization: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
  };
  invitedBy: {
    firstName: string;
    lastName: string;
  };
}
export const organizationInvitesService = {
  sendInvite: async (organizationId: string, shopId: string | undefined, data: Omit<SendInviteDTO, 'shopId'>): Promise<InviteResponse> => {
    const response = await axiosInstance.post(`/organization-invites/send`, {
      organizationId,
      ...(shopId ? { shopId } : {}),
      ...data,
    });
    return response.data;
  },

  listInvites: async (organizationId: string, shopId?: string): Promise<InviteResponse[]> => {
    const response = await axiosInstance.get(`/organization-invites/${organizationId}`);
    return response.data;
  },

  revokeInvite: async (organizationId: string, inviteId: string, shopId?: string): Promise<void> => {
    await axiosInstance.post(`/organization-invites/${organizationId}/revoke/${inviteId}`);
  },

  getInviteDetails: async (token: string): Promise<InviteDetailsResponse> => {
    const response = await axiosInstance.get(`/organization-invites/details`, { params: { token } });
    return response.data;
  },

  acceptInvite: async (data: AcceptInviteDTO): Promise<{ message: string }> => {
    const response = await axiosInstance.post(`/organization-invites/accept`, data);
    return response.data;
  },
};
