import { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { OrganizationMember } from '../types/organization';

const base = '/organization-members';

export const organizationMemberService = {
  findByOrganizationId: async (organizationId: string) => {
    try {
      const response: AxiosResponse<{ data: OrganizationMember[]; meta: { total: number } }> = await axiosInstance.get(`${base}/organization/${organizationId}`, {
        params: { perPage: 100 }
      });
      return response.data?.data || [];
    } catch (error: unknown) {
      throw error;
    }
  },

  findByShopId: async (shopId: string) => {
    try {
      const response: AxiosResponse<OrganizationMember[]> = await axiosInstance.get(`${base}/shop/${shopId}`);
      return response.data || [];
    } catch (error: unknown) {
      throw error;
    }
  },

  update: async (id: string, payload: { role?: string; isActive?: boolean }) => {
    try {
      const response: AxiosResponse<OrganizationMember> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },
};
