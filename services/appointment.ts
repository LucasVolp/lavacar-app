import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { Appointment, AppointmentStatus } from '../types/appointment';
import { PaginatedResult } from '@/types/pagination';

const base = '/appointments';

export interface CreateAppointmentRequest {
  scheduledAt: string;
  endTime: string;
  totalPrice: number;
  totalDuration: number;
  notes?: string;
  userId: string;
  shopId: string;
  vehicleId: string;
  serviceIds: {
    serviceId: string;
    serviceName: string;
    servicePrice: number;
    duration: number;
  }[];
}

export interface AppointmentFilters {
  shopId?: string;
  userId?: string;
  status?: AppointmentStatus | AppointmentStatus[];
  startDate?: string;
  endDate?: string;
  page?: number;
  perPage?: number;
  sortOrder?: 'asc' | 'desc';
}

export interface PublicAvailabilityResponse {
  date: string;
  totalDuration: number;
  slotInterval: number;
  availableSlots: string[];
}

export const appointmentService = {
  create: async (payload: CreateAppointmentRequest) => {
    try {
      const response: AxiosResponse<Appointment> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao criar agendamento (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao criar agendamento:', error);
      }
      throw error;
    }
  },

  findAll: async (filters?: AppointmentFilters): Promise<PaginatedResult<Appointment>> => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            if (Array.isArray(v)) {
              params.append(k, v.join(','));
            } else {
              params.append(k, String(v));
            }
          }
        });
      }
      const response: AxiosResponse<PaginatedResult<Appointment>> = await axiosInstance.get(base, { params });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar agendamentos (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao buscar agendamentos:', error);
      }
      throw error;
    }
  },

  findPublicByShopAndDate: async (shopId: string, date: string): Promise<Appointment[]> => {
    try {
      const response: AxiosResponse<Appointment[]> = await axiosInstance.get(`${base}/public/by-date`, {
        params: { shopId, date },
      });
      return response.data || [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar agendamentos públicos (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao buscar agendamentos públicos:', error);
      }
      throw error;
    }
  },

  findPublicAvailability: async (
    shopId: string,
    date: string,
    serviceIds: string[],
  ): Promise<PublicAvailabilityResponse> => {
    try {
      const response: AxiosResponse<PublicAvailabilityResponse> = await axiosInstance.get(`${base}/public/availability`, {
        params: {
          shopId,
          date,
          serviceIds: serviceIds.join(","),
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar disponibilidade pública (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao buscar disponibilidade pública:', error);
      }
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<Appointment> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar agendamento ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar agendamento ${id}:`, error);
      }
      throw error;
    }
  },

  update: async (id: string, payload: Partial<Appointment>) => {
    try {
      const response: AxiosResponse<Appointment> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao atualizar agendamento ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao atualizar agendamento ${id}:`, error);
      }
      throw error;
    }
  },

  cancel: async (id: string, reason?: string) => {
    try {
      const response = await axiosInstance.delete(`${base}/${id}`, { data: { reason } });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao cancelar agendamento ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao cancelar agendamento ${id}:`, error);
      }
      throw error;
    }
  },
};

export default appointmentService;
