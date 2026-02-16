import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { Schedule } from '../types/schedule';

const base = '/schedule';

export const scheduleService = {
  create: async (payload: Partial<Schedule>) => {
    try {
      const response: AxiosResponse<Schedule> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao criar horário (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao criar horário:', error);
      }
      throw error;
    }
  },

  findAll: async () => {
    try {
      const response: AxiosResponse<{ data: Schedule[]; meta: { total: number } }> = await axiosInstance.get(base);
      return response.data?.data || [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao listar horários (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao listar horários:', error);
      }
      throw error;
    }
  },

  findByShop: async (shopId: string) => {
    try {
      const response: AxiosResponse<{ data: Schedule[]; meta: { total: number } }> = await axiosInstance.get(base, {
        params: { shopId, perPage: 100 }
      });
      return response.data?.data || [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao listar horários do shop ${shopId} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao listar horários do shop ${shopId}:`, error);
      }
      throw error;
    }
  },

  findPublicByShop: async (shopId: string) => {
    try {
      const response: AxiosResponse<Schedule[]> = await axiosInstance.get(`${base}/public`, {
        params: { shopId }
      });
      return response.data || [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao listar horários públicos do shop ${shopId} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao listar horários públicos do shop ${shopId}:`, error);
      }
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<Schedule> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar horário ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar horário ${id}:`, error);
      }
      throw error;
    }
  },

  update: async (id: string, payload: Partial<Schedule>) => {
    try {
      const response: AxiosResponse<Schedule> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao atualizar horário ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao atualizar horário ${id}:`, error);
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
        console.error(`Erro ao deletar horário ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao deletar horário ${id}:`, error);
      }
      throw error;
    }
  },
};

export default scheduleService;
