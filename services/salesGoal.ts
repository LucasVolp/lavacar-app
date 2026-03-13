import { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { SalesGoal, CreateSalesGoalPayload, UpdateSalesGoalPayload } from '../types/salesGoal';

const base = '/sales-goal';

export const salesGoalService = {
  create: async (payload: CreateSalesGoalPayload) => {
    try {
      const response: AxiosResponse<SalesGoal> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findAll: async () => {
    try {
      const response: AxiosResponse<SalesGoal[]> = await axiosInstance.get(base);
      return response.data || [];
    } catch (error: unknown) {
      throw error;
    }
  },

  findByShopId: async (shopId: string) => {
    try {
      const response: AxiosResponse<SalesGoal[]> = await axiosInstance.get(`${base}/shop/${shopId}`);
      return response.data || [];
    } catch (error: unknown) {
      throw error;
    }
  },

  findByOrganizationId: async (organizationId: string) => {
    try {
      const response: AxiosResponse<SalesGoal[]> = await axiosInstance.get(`${base}/organization/${organizationId}`);
      return response.data || [];
    } catch (error: unknown) {
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<SalesGoal> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  update: async (id: string, payload: UpdateSalesGoalPayload) => {
    try {
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

export default salesGoalService;
