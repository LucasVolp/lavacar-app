"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { authService, AuthUser, LoginCredentials, RegisterPayload, CompleteRegistrationPayload } from "@/services/auth";
import { message } from "antd";
import Cookies from "js-cookie";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  loginWithToken: (token: string) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  completeRegistration: (payload: CompleteRegistrationPayload) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const COOKIE_OPTIONS = { expires: 7, secure: true, sameSite: 'Strict' as const };

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get("access_token");

      if (token) {
        try {
          const response = await authService.me();
          const newToken = response.accessToken ?? response.access_token ?? "";
          if (newToken) {
            Cookies.set("access_token", newToken, COOKIE_OPTIONS);
          }
          setUser(response.user);
        } catch {
          Cookies.remove("access_token");
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);

      const token = response.accessToken ?? response.access_token ?? "";
      Cookies.set("access_token", token, COOKIE_OPTIONS);
      setUser(response.user);

      message.success("Login realizado com sucesso!");
      return true;
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Erro ao fazer login";
      message.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithToken = useCallback(async (token: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      Cookies.set("access_token", token, COOKIE_OPTIONS);
      const response = await authService.me();
      const newToken = response.accessToken ?? response.access_token ?? "";
      if (newToken) {
        Cookies.set("access_token", newToken, COOKIE_OPTIONS);
      }
      setUser(response.user);
      return true;
    } catch {
      Cookies.remove("access_token");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.register(payload);

      const token = response.accessToken ?? response.access_token ?? "";
      Cookies.set("access_token", token, COOKIE_OPTIONS);
      setUser(response.user);

      message.success("Conta criada com sucesso!");
      return true;
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Erro ao criar conta";
      message.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeRegistration = useCallback(async (payload: CompleteRegistrationPayload): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.completeRegistration(payload);

      const token = response.accessToken ?? response.access_token ?? "";
      Cookies.set("access_token", token, COOKIE_OPTIONS);
      setUser(response.user);

      message.success("Cadastro concluído com sucesso!");
      return true;
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Erro ao completar cadastro";
      message.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    Cookies.remove("access_token");
    setUser(null);
    message.info("Você foi desconectado");
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.me();
      const newToken = response.accessToken ?? response.access_token ?? "";
      if (newToken) {
        Cookies.set("access_token", newToken, COOKIE_OPTIONS);
      }
      setUser(response.user);
    } catch {
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        loginWithToken,
        register,
        completeRegistration,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
