import { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { VehicleSize } from '@/types/enums';
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
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<ServiceVariant> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  update: async (id: string, payload: UpdateServiceVariantPayload) => {
    try {
      const response: AxiosResponse<ServiceVariant> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  remove: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },
};

export default serviceVariantService;
