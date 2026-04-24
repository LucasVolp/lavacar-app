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
  organizations?: {
    id: string;
    name: string;
    slug: string;
  }[];
  organizationMembers?: {
    id: string;
    organizationId: string;
    role: string;
    organization: {
      id: string;
      name: string;
      slug: string;
    };
    managedShops: {
      shopId: string;
      shop: {
        id: string;
        name: string;
        slug: string;
      };
    }[];
  }[];
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

export interface RequestPasswordResetPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface RequestEmailChangePayload {
  newEmail: string;
}

export interface ConfirmEmailChangePayload {
  token: string;
}

export interface ConfirmEmailChangeResponse {
  success: true;
  email: string;
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

  me: async (): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await axiosInstance.get(`${base}/me`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  requestPasswordReset: async (
    payload: RequestPasswordResetPayload,
  ): Promise<{ success: true }> => {
    const response: AxiosResponse<{ success: true }> = await axiosInstance.post(
      `${base}/password/request-reset`,
      payload,
    );
    return response.data;
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<{ success: true }> => {
    const response: AxiosResponse<{ success: true }> = await axiosInstance.post(
      `${base}/password/reset`,
      payload,
    );
    return response.data;
  },

  requestEmailChange: async (
    payload: RequestEmailChangePayload,
  ): Promise<{ success: true }> => {
    const response: AxiosResponse<{ success: true }> = await axiosInstance.post(
      `${base}/email/request-change`,
      payload,
    );
    return response.data;
  },

  confirmEmailChange: async (
    payload: ConfirmEmailChangePayload,
  ): Promise<ConfirmEmailChangeResponse> => {
    const response: AxiosResponse<ConfirmEmailChangeResponse> = await axiosInstance.post(
      `${base}/email/confirm-change`,
      payload,
    );
    return response.data;
  },
};

export default authService;
