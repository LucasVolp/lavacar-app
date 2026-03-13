import { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { BlockedTime } from '../types/blockedTime';

const base = '/blockedtime';

export const blockedTimeService = {
  create: async (payload: Partial<BlockedTime>) => {
    try {
      const response: AxiosResponse<BlockedTime> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findAll: async () => {
    try {
      const response: AxiosResponse<BlockedTime[]> = await axiosInstance.get(base);
      return response.data || [];
    } catch (error: unknown) {
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<BlockedTime> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  update: async (id: string, payload: Partial<BlockedTime>) => {
    try {
      const response: AxiosResponse<BlockedTime> = await axiosInstance.patch(`${base}/${id}`, payload);
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

export default blockedTimeService;
