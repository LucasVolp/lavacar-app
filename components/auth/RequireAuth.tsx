"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spin } from "antd";
import { useAuth } from "@/contexts/AuthContext";

interface RequireAuthProps {
  children: React.ReactNode;
  fallbackUrl?: string;
}

/**
 * Componente que protege rotas que requerem autenticação.
 * Redireciona para login se o usuário não estiver autenticado.
 */
export function RequireAuth({ children, fallbackUrl }: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirect = encodeURIComponent(pathname);
      const url = fallbackUrl || `/auth/login?redirect=${redirect}`;
      router.push(url);
    }
  }, [isLoading, isAuthenticated, router, pathname, fallbackUrl]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Não renderizar conteúdo se não autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
}

export default RequireAuth;
