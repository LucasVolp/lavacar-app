import axios, { AxiosResponse } from 'axios';
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
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao criar avaliação (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao criar avaliação:', error);
      }
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
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar avaliações (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao buscar avaliações:', error);
      }
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
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar avaliações públicas (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao buscar avaliações públicas:', error);
      }
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<Evaluation> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar avaliação ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar avaliação ${id}:`, error);
      }
      throw error;
    }
  },

  getShopStats: async (shopId: string) => {
    try {
      const response = await axiosInstance.get(`${base}/stats/${shopId}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar estatísticas da loja (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao buscar estatísticas da loja:', error);
      }
      throw error;
    }
  },

  getPublicShopStats: async (shopId: string) => {
    try {
      const response = await axiosInstance.get(`${base}/public/stats/${shopId}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar estatísticas públicas da loja (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao buscar estatísticas públicas da loja:', error);
      }
      throw error;
    }
  },

  update: async (id: string, payload: Partial<Evaluation>) => {
    try {
      const response: AxiosResponse<Evaluation> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao atualizar avaliação ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao atualizar avaliação ${id}:`, error);
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
        console.error(`Erro ao deletar avaliação ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao deletar avaliação ${id}:`, error);
      }
      throw error;
    }
  },
};

export default evaluationService;
