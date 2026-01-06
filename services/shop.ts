import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { Shop } from '../types/shop';

const base = '/shop';

export const shopService = {
  create: async (payload: Partial<Shop>) => {
    try {
      const response: AxiosResponse<Shop> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao criar loja (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao criar loja:', error);
      }
      throw error;
    }
  },

  findAll: async () => {
    try {
      const response: AxiosResponse<Shop[]> = await axiosInstance.get(base);
      return response.data || [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao listar lojas (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao listar lojas:', error);
      }
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<Shop> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar loja ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar loja ${id}:`, error);
      }
      throw error;
    }
  },

  findBySlug: async (slug: string) => {
    try {
      const response: AxiosResponse<Shop> = await axiosInstance.get(`${base}/slug/${slug}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar loja por slug ${slug} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar loja por slug ${slug}:`, error);
      }
      throw error;
    }
  },

  update: async (id: string, payload: Partial<Shop>) => {
    try {
      const response: AxiosResponse<Shop> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao atualizar loja ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao atualizar loja ${id}:`, error);
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
        console.error(`Erro ao deletar loja ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao deletar loja ${id}:`, error);
      }
      throw error;
    }
  },
};

export default shopService;
