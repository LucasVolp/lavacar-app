import { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { Shop } from '../types/shop';

const base = '/shop';

export const shopService = {
  create: async (payload: Partial<Shop>) => {
    try {
      const response: AxiosResponse<Shop> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findAll: async () => {
    try {
      const response: AxiosResponse<Shop[]> = await axiosInstance.get(base);
      return response.data || [];
    } catch (error: unknown) {
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<Shop> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findBySlug: async (slug: string) => {
    try {
      const response: AxiosResponse<Shop> = await axiosInstance.get(`${base}/slug/${slug}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  update: async (id: string, payload: Partial<Shop>) => {
    try {
      const response: AxiosResponse<Shop> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  uploadLogo: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response: AxiosResponse<{ url: string }> = await axiosInstance.post(`${base}/${id}/upload/logo`, formData);
    return response.data;
  },

  uploadBanner: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response: AxiosResponse<{ url: string }> = await axiosInstance.post(`${base}/${id}/upload/banner`, formData);
    return response.data;
  },

  uploadGallery: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response: AxiosResponse<{ url: string; gallery: string[] }> = await axiosInstance.post(`${base}/${id}/upload/gallery`, formData);
    return response.data;
  },

  deleteGalleryImage: async (id: string, url: string) => {
    const response: AxiosResponse<{ success: boolean; gallery: string[] }> = await axiosInstance.delete(`${base}/${id}/upload/gallery`, {
      params: { url },
    });
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

export default shopService;
