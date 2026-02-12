import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { Vehicle } from '../types/vehicle';
import { PaginatedResult } from '@/types/pagination';

const base = '/vehicle';

export interface VehicleFilters {
  userId?: string;
  page?: number;
  perPage?: number;
}

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

  findAll: async (filters?: VehicleFilters): Promise<PaginatedResult<Vehicle>> => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            params.append(k, String(v));
          }
        });
      }
      const response: AxiosResponse<PaginatedResult<Vehicle>> = await axiosInstance.get(base, { params });
      return response.data;
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

  findByPlate: async (plate: string): Promise<Vehicle | null> => {
    try {
      const normalized = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const response: AxiosResponse<Vehicle> = await axiosInstance.get(`${base}/plate/${normalized}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar veículo por placa (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao buscar veículo por placa:', error);
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
