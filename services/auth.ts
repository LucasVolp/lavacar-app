import axios, { AxiosResponse } from "axios";
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
  phone?: string;
  cpf?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

const base = "/auth";

export const authService = {
  /**
   * Login do usuário
   * POST /auth/login
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await axiosInstance.post(
        `${base}/login`,
        credentials
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao fazer login (${status || "desconhecido"}):`, message);
      } else {
        console.error("Erro desconhecido ao fazer login:", error);
      }
      throw error;
    }
  },

  /**
   * Registro de novo usuário
   * POST /auth/register
   */
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await axiosInstance.post(
        `${base}/register`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao registrar usuário (${status || "desconhecido"}):`, message);
      } else {
        console.error("Erro desconhecido ao registrar usuário:", error);
      }
      throw error;
    }
  },

  /**
   * Buscar dados do usuário logado
   * GET /auth/me
   */
  me: async (): Promise<AuthUser> => {
    try {
      const response: AxiosResponse<{ user: AuthUser } | AuthUser> = await axiosInstance.get(`${base}/me`);
      // Check if response is wrapped in { user: ... }
      if (response.data && 'user' in response.data) {
         return response.data.user;
      }
      return response.data as AuthUser;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar usuário logado (${status || "desconhecido"}):`, message);
      } else {
        console.error("Erro desconhecido ao buscar usuário logado:", error);
      }
      throw error;
    }
  },
};

export default authService;
