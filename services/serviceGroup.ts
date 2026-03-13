import { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { ServiceGroup } from '../types/serviceGroup';
import { PaginatedResult } from '@/types/pagination';

const base = '/service-groups';

export interface ServiceGroupFilters {
  shopId?: string;
  page?: number;
  perPage?: number;
}

export const serviceGroupService = {
  create: async (payload: Partial<ServiceGroup>) => {
    try {
      const response: AxiosResponse<ServiceGroup> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findAll: async (filters?: ServiceGroupFilters): Promise<PaginatedResult<ServiceGroup>> => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            params.append(k, String(v));
          }
        });
      }
      const response: AxiosResponse<PaginatedResult<ServiceGroup>> = await axiosInstance.get(base, { params });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<ServiceGroup> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  update: async (id: string, payload: Partial<ServiceGroup>) => {
    try {
      const response: AxiosResponse<ServiceGroup> = await axiosInstance.patch(`${base}/${id}`, payload);
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

export default serviceGroupService;
