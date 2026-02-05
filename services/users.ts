import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { User } from '../types/user';

const base = '/users';

export const usersService = {
  create: async (payload: Partial<User>) => {
    try {
      const response: AxiosResponse<User> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao criar usuário (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao criar usuário:', error);
      }
      throw error;
    }
  },

  findAll: async () => {
    try {
      const response: AxiosResponse<{ data: User[]; meta: { total: number } }> = await axiosInstance.get(base, {
        params: { perPage: 100 }
      });
      return response.data?.data || [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao listar usuários (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao listar usuários:', error);
      }
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<User> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar usuário ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar usuário ${id}:`, error);
      }
      throw error;
    }
  },

  findByEmail: async (email: string) => {
    try {
      const response: AxiosResponse<User> = await axiosInstance.get(`${base}/email/${email}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar usuário por email (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao buscar usuário por email:', error);
      }
      throw error;
    }
  },

  update: async (id: string, payload: Partial<User>) => {
    try {
      const response: AxiosResponse<User> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao atualizar usuário ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao atualizar usuário ${id}:`, error);
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
        console.error(`Erro ao deletar usuário ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao deletar usuário ${id}:`, error);
      }
      throw error;
    }
  },
};

export default usersService;
