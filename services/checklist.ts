import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { Checklist, CreateChecklistPayload, UpdateChecklistPayload } from '../types/checklist';

const base = '/checklist';

export const checklistService = {
  create: async (payload: CreateChecklistPayload) => {
    try {
      const response: AxiosResponse<Checklist> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao criar checklist (${status || 'desconhecido'}):`, message);
      } else {
        console.error('Erro desconhecido ao criar checklist:', error);
      }
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<Checklist> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar checklist ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar checklist ${id}:`, error);
      }
      throw error;
    }
  },

  findByAppointment: async (appointmentId: string) => {
    try {
      const response: AxiosResponse<Checklist> = await axiosInstance.get(`${base}/appointment/${appointmentId}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar checklist do agendamento ${appointmentId} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar checklist do agendamento ${appointmentId}:`, error);
      }
      throw error;
    }
  },

  update: async (id: string, payload: UpdateChecklistPayload) => {
    try {
      const response: AxiosResponse<Checklist> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao atualizar checklist ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao atualizar checklist ${id}:`, error);
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
        console.error(`Erro ao deletar checklist ${id} (${status || 'desconhecido'}):`, message);
      } else {
        console.error(`Erro desconhecido ao deletar checklist ${id}:`, error);
      }
      throw error;
    }
  },
};

export default checklistService;
