import { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { OrganizationMember } from '../types/organization';

const base = '/organization-members';

export const organizationMemberService = {
  findByOrganizationId: async (organizationId: string) => {
    try {
      const response: AxiosResponse<OrganizationMember[]> = await axiosInstance.get(`${base}/organization/${organizationId}`);
      return response.data;
    } catch (error: unknown) {
      console.error(`Erro ao buscar membros da organização ${organizationId}:`, error);
      throw error;
    }
  },

  update: async (id: string, payload: { role?: string; isActive?: boolean }) => {
    try {
      const response: AxiosResponse<OrganizationMember> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      console.error(`Erro ao atualizar membro ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      console.error(`Erro ao remover membro ${id}:`, error);
      throw error;
    }
  },
};
