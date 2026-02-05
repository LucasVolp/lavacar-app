import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { Services, CreateServicePayload, UpdateServicePayload } from '../types/services';
import { PaginatedResult } from '@/types/pagination';

const base = '/service';

export interface ServiceFilters {
  shopId?: string;
  groupId?: string;
  search?: string;
  isActive?: boolean;
  page?: number;
  perPage?: number;
}

export const serviceService = {
  create: async (payload: CreateServicePayload) => {
    try {
      const response: AxiosResponse<Services> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao criar serviço (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao criar serviço:', error);
      }
      throw error;
    }
  },

  findAll: async (filters?: ServiceFilters): Promise<PaginatedResult<Services>> => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            params.append(k, String(v));
          }
        });
      }
      const response: AxiosResponse<PaginatedResult<Services>> = await axiosInstance.get(base, { params });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao listar serviços (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao listar serviços:', error);
      }
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<Services> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar serviço ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar serviço ${id}:`, error);
      }
      throw error;
    }
  },

  update: async (id: string, payload: UpdateServicePayload) => {
    try {
      const response: AxiosResponse<Services> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao atualizar serviço ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao atualizar serviço ${id}:`, error);
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
        console.error(`Erro ao deletar serviço ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao deletar serviço ${id}:`, error);
      }
      throw error;
    }
  },
};

export default serviceService;
