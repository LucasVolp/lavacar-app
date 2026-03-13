import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { User, CreateUserPayload } from '../types/user';

const base = '/users';

export const usersService = {
  create: async (payload: CreateUserPayload) => {
    try {
      const response: AxiosResponse<User> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
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
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<User> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findByEmail: async (email: string) => {
    try {
      const response: AxiosResponse<User> = await axiosInstance.get(`${base}/email/${email}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findPublicUser: async (phone: string) => {
    try {
      const response = await axiosInstance.get(`${base}/public/phone/${phone}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return null;
        }
      }
      throw error;
    }
  },

  findByPhone: async (phone: string): Promise<User | null> => {
    try {
      const response: AxiosResponse<User> = await axiosInstance.get(`${base}/phone/${phone}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return null;
        }
      }
      throw error;
    }
  },

  update: async (id: string, payload: Partial<User>) => {
    try {
      const response: AxiosResponse<User> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  uploadAvatar: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response: AxiosResponse<{ url: string }> = await axiosInstance.post(`${base}/${id}/upload/avatar`, formData);
    return response.data;
  },

  deleteAvatar: async (id: string) => {
    const response: AxiosResponse<{ success: boolean }> = await axiosInstance.delete(`${base}/${id}/upload/avatar`);
    return response.data;
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

export default usersService;
