"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spin, message } from "antd";
import { useAuth } from "@/contexts/AuthContext";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get("access_token");
      const error = searchParams.get("error");

      if (error) {
        message.error("Erro na autenticação: " + error);
        router.push("/auth/login");
        return;
      }

      if (accessToken) {
        // Salvar o token
        localStorage.setItem("access_token", accessToken);

        // Atualizar dados do usuário
        await refreshUser();

        message.success("Login realizado com sucesso!");

        // Verificar se há um redirect salvo
        const savedRedirect = localStorage.getItem("auth_redirect");
        if (savedRedirect) {
          localStorage.removeItem("auth_redirect");
          router.push(savedRedirect);
        } else {
          router.push("/");
        }
      } else {
        message.error("Token de acesso não encontrado");
        router.push("/auth/login");
      }
    };

    handleCallback();
  }, [searchParams, router, refreshUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Spin size="large" />
      <p className="text-gray-500">Finalizando autenticação...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spin size="large" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
