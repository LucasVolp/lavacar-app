"use client";

import React, { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Button, Form, Input, Spin } from "antd";
import { LockOutlined, CheckCircleFilled, WarningFilled } from "@ant-design/icons";
import { AuthShell } from "@/components/auth/AuthShell";
import { authService } from "@/services/auth";

const TOKEN_PATTERN = /^[a-f0-9]{64}$/i;

interface FormValues {
  newPassword: string;
  confirmPassword: string;
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token") ?? "";
  const isTokenValid = useMemo(() => TOKEN_PATTERN.test(token), [token]);

  const handleSubmit = async (values: FormValues) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await authService.resetPassword({ token, newPassword: values.newPassword });
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2500);
    } catch (err: unknown) {
      const apiError = err as { response?: { status?: number; data?: { message?: string } } };
      const status = apiError.response?.status;
      const message =
        status === 401
          ? "Este link expirou ou já foi usado. Solicite um novo link de redefinição."
          : apiError.response?.data?.message || "Não foi possível redefinir sua senha. Tente novamente.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isTokenValid) {
    return (
      <AuthShell
        title="Link inválido"
        subtitle="O link que você abriu não é válido ou está incompleto."
      >
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-6">
          <div className="flex items-start gap-3">
            <WarningFilled className="text-amber-500 text-2xl mt-0.5" />
            <div>
              <p className="text-amber-900 dark:text-amber-200 font-semibold mb-1">
                Não foi possível verificar seu link
              </p>
              <p className="text-sm text-amber-800/80 dark:text-amber-200/80 leading-[1.7]">
                Solicite um novo e-mail de redefinição para continuar. Os links expiram em 60 minutos.
              </p>
            </div>
          </div>
        </div>

        <Link href="/auth/forgot-password">
          <Button
            type="primary"
            size="large"
            block
            className="mt-8 h-12 bg-blue-600 hover:bg-blue-500 border-none rounded-xl font-semibold"
          >
            Solicitar novo link
          </Button>
        </Link>
      </AuthShell>
    );
  }

  if (success) {
    return (
      <AuthShell
        title="Senha atualizada"
        subtitle="Sua nova senha já está ativa. Estamos te levando para o login."
      >
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-6 flex items-start gap-3">
          <CheckCircleFilled className="text-emerald-500 text-2xl mt-0.5" />
          <div>
            <p className="text-emerald-900 dark:text-emerald-200 font-semibold mb-1">
              Pronto!
            </p>
            <p className="text-sm text-emerald-800/80 dark:text-emerald-200/80 leading-[1.7]">
              Use sua nova senha para entrar na sua conta. Por segurança, todas as outras sessões continuam válidas até você encerrá-las.
            </p>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Crie uma nova senha"
      subtitle="Escolha uma senha forte para proteger sua conta NexoCar."
    >
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          closable
          onClose={() => setError(null)}
          className="mb-6 rounded-xl border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900/50"
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        size="large"
      >
        <Form.Item
          name="newPassword"
          label={<span className="text-zinc-700 dark:text-zinc-300">Nova senha</span>}
          rules={[
            { required: true, message: "Informe a nova senha" },
            { min: 8, message: "A senha deve ter ao menos 8 caracteres" },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined className="text-zinc-400" />}
            placeholder="••••••••"
            autoComplete="new-password"
            className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={<span className="text-zinc-700 dark:text-zinc-300">Confirmar nova senha</span>}
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            { required: true, message: "Confirme a nova senha" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("As senhas não coincidem"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-zinc-400" />}
            placeholder="••••••••"
            autoComplete="new-password"
            className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isSubmitting}
          className="h-12 bg-blue-600 hover:bg-blue-500 border-none text-base font-semibold shadow-lg shadow-blue-500/20 rounded-xl"
        >
          Redefinir senha
        </Button>
      </Form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
          <Spin size="large" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
