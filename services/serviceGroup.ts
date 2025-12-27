import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { ServiceGroup } from '../types/serviceGroup';

const base = '/service-groups';

export const serviceGroupService = {
  create: async (payload: Partial<ServiceGroup>) => {
    try {
      const response: AxiosResponse<ServiceGroup> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao criar grupo de serviços (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao criar grupo de serviços:', error);
      }
      throw error;
    }
  },

  findAll: async (shopId?: string) => {
    try {
      const params = new URLSearchParams();
      if (shopId) params.append('shopId', shopId);
      const response: AxiosResponse<ServiceGroup[]> = await axiosInstance.get(base, { params });
      return response.data || [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao listar grupos de serviços (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao listar grupos de serviços:', error);
      }
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<ServiceGroup> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar grupo ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar grupo ${id}:`, error);
      }
      throw error;
    }
  },

  update: async (id: string, payload: Partial<ServiceGroup>) => {
    try {
      const response: AxiosResponse<ServiceGroup> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao atualizar grupo ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao atualizar grupo ${id}:`, error);
      }
      throw error;
    }
  },

  remove: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao deletar grupo ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao deletar grupo ${id}:`, error);
      }
      throw error;
    }
  },
};

export default serviceGroupService;
