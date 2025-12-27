import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { Vehicle } from '../types/vehicle';

const base = '/vehicle';

export const vehicleService = {
  create: async (payload: Partial<Vehicle>) => {
    try {
      const response: AxiosResponse<Vehicle> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao criar veículo (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao criar veículo:', error);
      }
      throw error;
    }
  },

  findAll: async () => {
    try {
      const response: AxiosResponse<Vehicle[]> = await axiosInstance.get(base);
      return response.data || [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao listar veículos (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao listar veículos:', error);
      }
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<Vehicle> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar veículo ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar veículo ${id}:`, error);
      }
      throw error;
    }
  },

  update: async (id: string, payload: Partial<Vehicle>) => {
    try {
      const response: AxiosResponse<Vehicle> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao atualizar veículo ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao atualizar veículo ${id}:`, error);
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
        console.error(`Erro ao deletar veículo ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao deletar veículo ${id}:`, error);
      }
      throw error;
    }
  },
};

export default vehicleService;
