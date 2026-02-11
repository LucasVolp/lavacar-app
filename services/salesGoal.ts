import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { SalesGoal, CreateSalesGoalPayload, UpdateSalesGoalPayload } from '../types/salesGoal';

const base = '/sales-goal';

export const salesGoalService = {
  create: async (payload: CreateSalesGoalPayload) => {
    try {
      const response: AxiosResponse<SalesGoal> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao criar meta de vendas (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao criar meta de vendas:', error);
      }
      throw error;
    }
  },

  findAll: async () => {
    try {
      const response: AxiosResponse<SalesGoal[]> = await axiosInstance.get(base);
      return response.data || [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao listar metas de vendas (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao listar metas de vendas:', error);
      }
      throw error;
    }
  },

  findByShopId: async (shopId: string) => {
    try {
      const response: AxiosResponse<SalesGoal[]> = await axiosInstance.get(`${base}/shop/${shopId}`);
      return response.data || [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar metas de vendas da loja ${shopId} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar metas de vendas da loja ${shopId}:`, error);
      }
      throw error;
    }
  },

  findByOrganizationId: async (organizationId: string) => {
    try {
      const response: AxiosResponse<SalesGoal[]> = await axiosInstance.get(`${base}/organization/${organizationId}`);
      return response.data || [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar metas de vendas da organização ${organizationId} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar metas de vendas da organização ${organizationId}:`, error);
      }
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<SalesGoal> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar meta de vendas ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar meta de vendas ${id}:`, error);
      }
      throw error;
    }
  },

  update: async (id: string, payload: UpdateSalesGoalPayload) => {
    try {
      // Defensive Sanitization
      if (payload.amount !== undefined) {
        const numericAmount = Number(payload.amount);
        if (isNaN(numericAmount) || numericAmount < 0) {
          throw new Error("O valor da meta deve ser um número válido e positivo.");
        }
        payload.amount = numericAmount;
      }

      const response: AxiosResponse<SalesGoal> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao atualizar meta de vendas ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao atualizar meta de vendas ${id}:`, error);
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
        console.error(`Erro ao deletar meta de vendas ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao deletar meta de vendas ${id}:`, error);
      }
      throw error;
    }
  },
};

export default salesGoalService;
