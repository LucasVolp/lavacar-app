"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { authService, AuthUser, LoginCredentials, RegisterPayload } from "@/services/auth";
import { message } from "antd";
import Cookies from "js-cookie";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  loginWithToken: (token: string) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Carregar usuário do token ao iniciar
  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get("access_token");
      
      if (token) {
        try {
          const userData = await authService.me();
          setUser(userData);
        } catch (error) {
          console.error("Erro ao recuperar usuário:", error);
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
      
      Cookies.set("access_token", response.accessToken, { expires: 7, secure: true, sameSite: 'Strict' });
      setUser(response.user);
      
      message.success("Login realizado com sucesso!");
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erro ao fazer login";
      message.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithToken = useCallback(async (token: string): Promise<boolean> => {
     try {
       setIsLoading(true);
       Cookies.set("access_token", token, { expires: 7, secure: true, sameSite: 'Strict' });
       const userData = await authService.me();
       setUser(userData);
       return true;
     } catch (error) {
       console.error("Failed to login with token", error);
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
      
      Cookies.set("access_token", response.accessToken, { expires: 7, secure: true, sameSite: 'Strict' });
      setUser(response.user);
      
      message.success("Conta criada com sucesso!");
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erro ao criar conta";
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
      const userData = await authService.me();
      setUser(userData);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
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
