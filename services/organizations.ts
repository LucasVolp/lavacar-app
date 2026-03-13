import { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import {
  Organization,
  OrganizationDashboardMetrics,
  OrganizationInsightsPeriod,
} from '../types/organization';

const base = '/organizations';

export interface OrganizationDashboardMetricsFilters {
  period?: OrganizationInsightsPeriod;
  startDate?: string;
  endDate?: string;
}

export const organizationService = {
  create: async (payload: Partial<Organization>) => {
    try {
      const response: AxiosResponse<Organization> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findAll: async () => {
    try {
      const response: AxiosResponse<Organization[]> = await axiosInstance.get(base);
      return response.data || [];
    } catch (error: unknown) {
      throw error;
    }
  },

  findById: async (id: string) => {
    try {
      const response: AxiosResponse<Organization> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findDashboardMetrics: async (
    id: string,
    filters: OrganizationDashboardMetricsFilters = {},
  ) => {
    try {
      const response: AxiosResponse<OrganizationDashboardMetrics> = await axiosInstance.get(
        `${base}/${id}/dashboard-metrics`,
        { params: filters },
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findBySlug: async (slug: string) => {
    try {
      const response: AxiosResponse<Organization> = await axiosInstance.get(`${base}/slug/${slug}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findByOwner: async (ownerId: string) => {
    try {
      const response = await axiosInstance.get(`${base}/owner/${ownerId}`);
      const data = response.data;

      if (Array.isArray(data)) {
        return data;
      } else if (data && typeof data === 'object') {
        return [data as Organization];
      }
      return [];
    } catch (error: unknown) {
      throw error;
    }
  },

  update: async (id: string, payload: Partial<Organization>) => {
    try {
      const response: AxiosResponse<Organization> = await axiosInstance.patch(`${base}/${id}`, payload);
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

  deleteLogo: async (id: string) => {
    const response: AxiosResponse<{ success: boolean }> = await axiosInstance.delete(`${base}/${id}/upload/logo`);
    return response.data;
  },

  delete: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },
};

export default organizationService;
