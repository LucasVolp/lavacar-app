import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { Organization } from '../types/organization';

const base = '/organizations';

export const organizationService = {
  create: async (payload: Partial<Organization>) => {
    try {
      const response: AxiosResponse<Organization> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao criar organização (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao criar organização:', error);
      }
      throw error;
    }
  },

  findAll: async () => {
    try {
      const response: AxiosResponse<Organization[]> = await axiosInstance.get(base);
      return response.data || [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao listar organizações (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao listar organizações:', error);
      }
      throw error;
    }
  },

  findById: async (id: string) => {
    try {
      const response: AxiosResponse<Organization> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar organização ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar organização ${id}:`, error);
      }
      throw error;
    }
  },

  findBySlug: async (slug: string) => {
    try {
      const response: AxiosResponse<Organization> = await axiosInstance.get(`${base}/slug/${slug}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar organização por slug (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao buscar organização por slug:', error);
      }
      throw error;
    }
  },

  findByOwner: async (ownerId: string) => {
    try {
      const response: AxiosResponse<Organization[]> = await axiosInstance.get(`${base}/owner/${ownerId}`);
      // Assuming return type is an array of organizations owned by the user
      // But based on user request "Organization do usuário" singular, we might handle the first one or the array.
      // API Controller returns `this.organizationService.findByOwner(ownerId)`.
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar organizações do owner ${ownerId} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar organizações do owner ${ownerId}:`, error);
      }
      throw error;
    }
  },

  update: async (id: string, payload: Partial<Organization>) => {
    try {
      const response: AxiosResponse<Organization> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao atualizar organização ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao atualizar organização ${id}:`, error);
      }
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao deletar organização ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao deletar organização ${id}:`, error);
      }
      throw error;
    }
  },
};

export default organizationService;
