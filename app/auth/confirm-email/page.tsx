"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, Spin } from "antd";
import { CheckCircleFilled, WarningFilled, MailOutlined } from "@ant-design/icons";
import { AuthShell } from "@/components/auth/AuthShell";
import { authService } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";

const TOKEN_PATTERN = /^[a-f0-9]{64}$/i;

type Status = "loading" | "success" | "error" | "invalid";

function ConfirmEmailContent() {
  const searchParams = useSearchParams();
  const { refreshUser, isAuthenticated } = useAuth();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<Status>(TOKEN_PATTERN.test(token) ? "loading" : "invalid");
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasConfirmedRef = useRef(false);

  useEffect(() => {
    if (status !== "loading" || hasConfirmedRef.current) return;
    hasConfirmedRef.current = true;

    authService
      .confirmEmailChange({ token })
      .then(async (response) => {
        setConfirmedEmail(response.email);
        setStatus("success");
        if (isAuthenticated) {
          await refreshUser();
        }
      })
      .catch((err: unknown) => {
        const apiError = err as { response?: { status?: number; data?: { message?: string } } };
        const statusCode = apiError.response?.status;
        const msg =
          statusCode === 401
            ? "Este link expirou ou já foi usado. Solicite uma nova alteração nas suas configurações."
            : apiError.response?.data?.message || "Não foi possível confirmar a alteração de e-mail.";
        setErrorMessage(msg);
        setStatus("error");
      });
  }, [status, token, isAuthenticated, refreshUser]);

  if (status === "invalid") {
    return (
      <AuthShell
        title="Link inválido"
        subtitle="O link que você abriu não é válido ou está incompleto."
      >
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-6 flex items-start gap-3">
          <WarningFilled className="text-amber-500 text-2xl mt-0.5" />
          <div>
            <p className="text-amber-900 dark:text-amber-200 font-semibold mb-1">
              Não conseguimos verificar seu link
            </p>
            <p className="text-sm text-amber-800/80 dark:text-amber-200/80 leading-[1.7]">
              Abra o link exatamente como recebeu no e-mail. Se já tentou confirmar antes, a alteração pode ter sido concluída.
            </p>
          </div>
        </div>

        <Link href="/auth/login">
          <Button size="large" block className="mt-8 h-12 rounded-xl">
            Voltar para o login
          </Button>
        </Link>
      </AuthShell>
    );
  }

  if (status === "loading") {
    return (
      <AuthShell
        title="Confirmando seu e-mail"
        subtitle="Aguarde um instante enquanto validamos o link."
      >
        <div className="flex items-center justify-center py-10">
          <Spin size="large" />
        </div>
      </AuthShell>
    );
  }

  if (status === "error") {
    return (
      <AuthShell
        title="Não foi possível confirmar"
        subtitle="Houve um problema ao processar sua solicitação."
      >
        <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-6 flex items-start gap-3">
          <WarningFilled className="text-red-500 text-2xl mt-0.5" />
          <div>
            <p className="text-red-900 dark:text-red-200 font-semibold mb-1">Link inválido ou expirado</p>
            <p className="text-sm text-red-800/80 dark:text-red-200/80 leading-[1.7]">{errorMessage}</p>
          </div>
        </div>

        <Link href={isAuthenticated ? "/client/profile" : "/auth/login"}>
          <Button
            type="primary"
            size="large"
            block
            className="mt-8 h-12 bg-blue-600 hover:bg-blue-500 border-none rounded-xl font-semibold"
          >
            {isAuthenticated ? "Ir para o perfil" : "Voltar para o login"}
          </Button>
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="E-mail atualizado"
      subtitle="A alteração do seu e-mail foi concluída com sucesso."
    >
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-6 flex items-start gap-3">
        <CheckCircleFilled className="text-emerald-500 text-2xl mt-0.5" />
        <div>
          <p className="text-emerald-900 dark:text-emerald-200 font-semibold mb-2">
            Novo e-mail confirmado
          </p>
          <p className="text-sm text-emerald-800/80 dark:text-emerald-200/80 leading-[1.7] flex items-center gap-2 flex-wrap">
            <MailOutlined />
            <span className="break-all font-medium">{confirmedEmail}</span>
          </p>
          <p className="text-sm text-emerald-800/80 dark:text-emerald-200/80 leading-[1.7] mt-2">
            A partir de agora, use este endereço para fazer login no NexoCar.
          </p>
        </div>
      </div>

      <Link href={isAuthenticated ? "/client/profile" : "/auth/login"}>
        <Button
          type="primary"
          size="large"
          block
          className="mt-8 h-12 bg-blue-600 hover:bg-blue-500 border-none rounded-xl font-semibold"
        >
          {isAuthenticated ? "Voltar ao perfil" : "Fazer login"}
        </Button>
      </Link>
    </AuthShell>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
          <Spin size="large" />
        </div>
      }
    >
      <ConfirmEmailContent />
    </Suspense>
  );
}
