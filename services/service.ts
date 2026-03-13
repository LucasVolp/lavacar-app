import { AxiosResponse } from 'axios';
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
      throw error;
    }
  },

  findPublic: async (filters?: ServiceFilters): Promise<PaginatedResult<Services>> => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            params.append(k, String(v));
          }
        });
      }
      const response: AxiosResponse<PaginatedResult<Services>> = await axiosInstance.get(`${base}/public`, { params });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<Services> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  update: async (id: string, payload: UpdateServicePayload) => {
    try {
      const response: AxiosResponse<Services> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  uploadPhoto: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response: AxiosResponse<{ url: string }> = await axiosInstance.post(`${base}/${id}/upload/photo`, formData);
    return response.data;
  },

  deletePhoto: async (id: string) => {
    const response: AxiosResponse<{ success: boolean }> = await axiosInstance.delete(`${base}/${id}/upload/photo`);
    return response.data;
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

export default serviceService;
