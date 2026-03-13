"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spin, message } from "antd";
import { useAuth } from "@/contexts/AuthContext";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithToken } = useAuth();

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
        try {
          const success = await loginWithToken(accessToken);
          
          if (success) {
            message.success("Login com Google realizado!");
            
            const redirectUrl = localStorage.getItem("auth_redirect");
            localStorage.removeItem("auth_redirect");
            
            if (redirectUrl) {
                router.push(redirectUrl);
            } else {
                router.push("/");
            }
          } else {
             message.error("Falha ao validar sessão");
             router.push("/auth/login");
          }
        } catch {
            router.push("/auth/login");
        }
      } else {
        router.push("/auth/login");
      }
    };

    handleCallback();
  }, [searchParams, router, loginWithToken]);

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
