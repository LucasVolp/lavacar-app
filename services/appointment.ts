import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { Appointment } from '../types/appointment';

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

  findAll: async (filters?: Record<string, string | number | boolean | undefined>) => {
    try {
      const params = new URLSearchParams();
      if (filters) Object.entries(filters).forEach(([k, v]) => v !== undefined && params.append(k, String(v)));
      const response: AxiosResponse<Appointment[]> = await axiosInstance.get(base, { params });
      return response.data || [];
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

  cancel: async (id: string, reason?: string, userId?: string) => {
    try {
      const response = await axiosInstance.delete(`${base}/${id}`, { data: { reason, userId } });
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
