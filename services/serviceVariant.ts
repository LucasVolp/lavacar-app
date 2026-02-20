import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { VehicleSize } from '../../lavacar-api/prisma/generated/enums';
import { PaginatedResult } from '@/types/pagination';
import { ServiceVariant } from '@/types/services';

const base = '/service-variants';

export interface ServiceVariantFilters {
  serviceId?: string;
  shopId?: string;
  page?: number;
  perPage?: number;
}

export interface CreateServiceVariantPayload {
  serviceId: string;
  size: VehicleSize;
  price: number;
  duration: number;
}

export interface UpdateServiceVariantPayload {
  serviceId?: string;
  size?: VehicleSize;
  price?: number;
  duration?: number;
}

export const serviceVariantService = {
  create: async (payload: CreateServiceVariantPayload) => {
    try {
      const response: AxiosResponse<ServiceVariant> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao criar variação de serviço (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao criar variação de serviço:', error);
      }
      throw error;
    }
  },

  findAll: async (filters?: ServiceVariantFilters): Promise<PaginatedResult<ServiceVariant>> => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            params.append(k, String(v));
          }
        });
      }
      const response: AxiosResponse<PaginatedResult<ServiceVariant>> = await axiosInstance.get(base, { params });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao listar variações de serviço (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao listar variações de serviço:', error);
      }
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<ServiceVariant> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar variação ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar variação ${id}:`, error);
      }
      throw error;
    }
  },

  update: async (id: string, payload: UpdateServiceVariantPayload) => {
    try {
      const response: AxiosResponse<ServiceVariant> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao atualizar variação ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao atualizar variação ${id}:`, error);
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
        console.error(`Erro ao remover variação ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao remover variação ${id}:`, error);
      }
      throw error;
    }
  },
};

export default serviceVariantService;
