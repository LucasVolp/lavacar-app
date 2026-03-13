import { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { Schedule } from '../types/schedule';

const base = '/schedule';

export const scheduleService = {
  create: async (payload: Partial<Schedule>) => {
    try {
      const response: AxiosResponse<Schedule> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findAll: async () => {
    try {
      const response: AxiosResponse<{ data: Schedule[]; meta: { total: number } }> = await axiosInstance.get(base);
      return response.data?.data || [];
    } catch (error: unknown) {
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
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<Schedule> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  update: async (id: string, payload: Partial<Schedule>) => {
    try {
      const response: AxiosResponse<Schedule> = await axiosInstance.patch(`${base}/${id}`, payload);
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

export default scheduleService;
