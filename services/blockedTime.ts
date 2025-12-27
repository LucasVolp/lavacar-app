import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { BlockedTime } from '../types/blockedTime';

const base = '/blockedtime';

export const blockedTimeService = {
  create: async (payload: Partial<BlockedTime>) => {
    try {
      const response: AxiosResponse<BlockedTime> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao criar bloqueio (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao criar bloqueio:', error);
      }
      throw error;
    }
  },

  findAll: async () => {
    try {
      const response: AxiosResponse<BlockedTime[]> = await axiosInstance.get(base);
      return response.data || [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao listar bloqueios (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao listar bloqueios:', error);
      }
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<BlockedTime> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar bloqueio ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar bloqueio ${id}:`, error);
      }
      throw error;
    }
  },

  update: async (id: string, payload: Partial<BlockedTime>) => {
    try {
      const response: AxiosResponse<BlockedTime> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao atualizar bloqueio ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao atualizar bloqueio ${id}:`, error);
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
        console.error(`Erro ao deletar bloqueio ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao deletar bloqueio ${id}:`, error);
      }
      throw error;
    }
  },
};

export default blockedTimeService;
