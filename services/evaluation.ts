import { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { Evaluation, EvaluationWithRelations } from '../types/evaluation';
import { PaginatedResult } from '@/types/pagination';

const base = '/evaluations';

export interface EvaluationFilters {
  shopId?: string;
  userId?: string;
  rating?: number;
  page?: number;
  perPage?: number;
}

export const evaluationService = {
  create: async (payload: Partial<Evaluation>) => {
    try {
      const response: AxiosResponse<Evaluation> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  uploadPhotos: async (files: File[], appointmentId?: string) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("photos", file));
    const response: AxiosResponse<{ urls: string[] }> = await axiosInstance.post(
      `${base}/upload/photos`,
      formData,
      { params: appointmentId ? { appointmentId } : undefined }
    );
    return response.data;
  },

  findAll: async (filters?: EvaluationFilters): Promise<PaginatedResult<EvaluationWithRelations>> => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            params.append(k, String(v));
          }
        });
      }
      const response: AxiosResponse<PaginatedResult<EvaluationWithRelations>> = await axiosInstance.get(base, { params });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findPublicByShop: async (filters: { shopId: string; rating?: number; page?: number; perPage?: number }): Promise<PaginatedResult<EvaluationWithRelations>> => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          params.append(k, String(v));
        }
      });
      const response: AxiosResponse<PaginatedResult<EvaluationWithRelations>> = await axiosInstance.get(`${base}/public`, { params });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<Evaluation> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  getShopStats: async (shopId: string) => {
    try {
      const response = await axiosInstance.get(`${base}/stats/${shopId}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  getPublicShopStats: async (shopId: string) => {
    try {
      const response = await axiosInstance.get(`${base}/public/stats/${shopId}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  update: async (id: string, payload: Partial<Evaluation>) => {
    try {
      const response: AxiosResponse<Evaluation> = await axiosInstance.patch(`${base}/${id}`, payload);
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

export default evaluationService;
