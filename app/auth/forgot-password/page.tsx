"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Alert, Button, Form, Input } from "antd";
import { MailOutlined, CheckCircleFilled } from "@ant-design/icons";
import { AuthShell } from "@/components/auth/AuthShell";
import { authService } from "@/services/auth";

interface FormValues {
  email: string;
}

export default function ForgotPasswordPage() {
  const [form] = Form.useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: FormValues) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await authService.requestPasswordReset({ email: values.email.trim().toLowerCase() });
      setSubmittedEmail(values.email.trim().toLowerCase());
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setError(apiError.response?.data?.message || "Não foi possível processar sua solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedEmail) {
    return (
      <AuthShell
        title="Verifique seu e-mail"
        subtitle="Se houver uma conta NexoCar associada a esse endereço, você receberá um link para redefinir sua senha."
      >
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-6">
          <div className="flex items-start gap-3">
            <CheckCircleFilled className="text-emerald-500 text-2xl mt-0.5" />
            <div>
              <p className="text-emerald-900 dark:text-emerald-200 font-semibold mb-1">
                Solicitação recebida
              </p>
              <p className="text-sm text-emerald-800/80 dark:text-emerald-200/80 leading-[1.7]">
                Caso <strong className="break-all">{submittedEmail}</strong> esteja cadastrado, enviaremos um link válido por <strong>60 minutos</strong>. Verifique também a caixa de spam.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Button
            block
            size="large"
            onClick={() => {
              form.resetFields();
              setSubmittedEmail(null);
            }}
            className="h-12 rounded-xl"
          >
            Enviar para outro e-mail
          </Button>

          <Link href="/auth/login">
            <Button type="link" block className="text-blue-600 dark:text-blue-400">
              Voltar para o login
            </Button>
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Esqueceu sua senha?"
      subtitle="Informe o e-mail da sua conta e enviaremos um link para redefinir sua senha."
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
          name="email"
          label={<span className="text-zinc-700 dark:text-zinc-300">E-mail cadastrado</span>}
          rules={[
            { required: true, message: "Informe seu e-mail" },
            { type: "email", message: "E-mail inválido" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-zinc-400" />}
            placeholder="seu@email.com"
            autoComplete="email"
            className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-800 text-zinc-900 dark:text-white"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isSubmitting}
          className="h-12 bg-blue-600 hover:bg-blue-500 border-none text-base font-semibold shadow-lg shadow-blue-500/20 rounded-xl"
        >
          Enviar link de redefinição
        </Button>
      </Form>

      <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Lembrou a senha?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
        >
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}
