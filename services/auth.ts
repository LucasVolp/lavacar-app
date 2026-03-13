import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  cpf?: string;
  picture?: string;
  role: "USER" | "OWNER" | "EMPLOYEE" | "MANAGER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  hasPassword?: boolean;
  provider?: string;
  isGuest?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phone: string;
  cpf?: string;
}

export interface RegisterOwnerPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phone: string;
  cpf?: string;
  shop: {
    name: string;
    description?: string;
    phone: string;
    email?: string;
  };
}

export interface GuestLoginPayload {
  phone: string;
  firstName?: string;
  lastName?: string;
  vehicle?: {
    type: string;
    brand: string;
    model: string;
    size: string;
    plate?: string;
    color?: string;
    year?: number;
  };
}

export interface CompleteRegistrationPayload {
  phone: string;
  email: string;
  firstName: string;
  lastName?: string;
  picture?: string;
}

export interface AuthResponse {
  access_token?: string;
  accessToken?: string;
  user: AuthUser;
}

export interface TrackingAppointment {
  id: string;
  scheduledAt: string;
  endTime: string;
  status: string;
  totalPrice: string;
  totalDuration: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  vehicle: {
    id: string;
    brand: string;
    model: string;
    plate?: string;
    color?: string;
    type: string;
  };
  shop: {
    id: string;
    name: string;
    slug: string;
    phone: string;
    logoUrl?: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  services: {
    id: string;
    serviceName: string;
    servicePrice: string;
    duration: number;
  }[];
}

const base = "/auth";

export const authService = {
  guestLogin: async (payload: GuestLoginPayload): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await axiosInstance.post(
        `${base}/guest`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await axiosInstance.post(
        `${base}/login`,
        credentials
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await axiosInstance.post(
        `${base}/register`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  registerOwner: async (payload: RegisterOwnerPayload): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await axiosInstance.post(
        `${base}/register/owner`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  completeRegistration: async (payload: CompleteRegistrationPayload): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await axiosInstance.post(
        `${base}/complete-registration`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  validateTrackingToken: async (token: string): Promise<TrackingAppointment> => {
    try {
      const response: AxiosResponse<TrackingAppointment> = await axiosInstance.get(
        `${base}/track/validate`,
        { params: { token } }
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  me: async (): Promise<AuthUser> => {
    try {
      const response: AxiosResponse<{ user: AuthUser } | AuthUser> = await axiosInstance.get(`${base}/me`);
      if (response.data && 'user' in response.data) {
         return response.data.user;
      }
      return response.data as AuthUser;
    } catch (error: unknown) {
      throw error;
    }
  },
};

export default authService;
