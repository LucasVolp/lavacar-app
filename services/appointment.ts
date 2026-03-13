import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { Appointment, AppointmentStatus } from '../types/appointment';
import { PaginatedResult } from '@/types/pagination';
import { VehicleSize } from '@/types/enums';

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
    isBudget?: boolean;
    vehicleSize?: VehicleSize;
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

export interface CreateAppointmentResponse extends Appointment {
  trackingUrl?: string;
}

export interface CreateWalkInRequest {
  shopId: string;
  user: {
    id?: string;
    firstName: string;
    phone: string;
    email?: string;
  };
  vehicle: {
    id?: string;
    plate?: string;
    brand: string;
    model: string;
    color?: string;
    type?: string;
    size?: string;
  };
  serviceIds: string[];
  notes?: string;
}

export const appointmentService = {
  create: async (payload: CreateAppointmentRequest) => {
    try {
      const response: AxiosResponse<CreateAppointmentResponse> = await axiosInstance.post(base, payload);
      return response.data;
    } catch (error: unknown) {
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
      throw error;
    }
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<Appointment> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  update: async (id: string, payload: Partial<Appointment>) => {
    try {
      const response: AxiosResponse<Appointment> = await axiosInstance.patch(`${base}/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  cancel: async (id: string, reason?: string) => {
    try {
      const response = await axiosInstance.delete(`${base}/${id}`, { data: { reason } });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  createWalkIn: async (payload: CreateWalkInRequest) => {
    try {
      const response: AxiosResponse<CreateAppointmentResponse> = await axiosInstance.post(`${base}/walk-in`, payload);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findByVehiclePlate: async (plate: string, shopId: string): Promise<Appointment[]> => {
    try {
      const normalized = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const response: AxiosResponse<Appointment[]> = await axiosInstance.get(`${base}/vehicle-plate/${normalized}`, {
        params: { shopId },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) return [];
      }
      throw error;
    }
  },

  confirmByTracking: async (token: string) => {
    const response: AxiosResponse<Appointment> = await axiosInstance.patch(
      `${base}/track/confirm`,
      {},
      { params: { token } },
    );
    return response.data;
  },

  cancelByTracking: async (token: string, reason?: string) => {
    const response: AxiosResponse<Appointment> = await axiosInstance.patch(
      `${base}/track/cancel`,
      { reason },
      { params: { token } },
    );
    return response.data;
  },
};

export default appointmentService;
