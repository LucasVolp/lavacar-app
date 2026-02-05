"use client";

import { Suspense, useState, useEffect } from "react";
import { Form, Input, Button, Alert, Spin } from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormValues {
  email: string;
  password: string;
}

function LoginForm() {
  const [form] = Form.useForm<LoginFormValues>();
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  const handleSubmit = async (values: LoginFormValues) => {
    setError(null);
    try {
      const success = await login(values);
      if (success) {
        router.push(redirectTo);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Erro ao fazer login");
    }
  };

  const handleGoogleLogin = () => {
    if (redirectTo && redirectTo !== "/") {
        localStorage.setItem("auth_redirect", redirectTo);
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-black transition-colors duration-300">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24 relative">
        <Link href="/" className="absolute top-8 left-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeftOutlined /> Voltar
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Bem-vindo de volta</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Digite seus dados para acessar sua conta.
            </p>
          </div>

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
            autoComplete="off"
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="email"
              label={<span className="text-zinc-700 dark:text-zinc-300">Email</span>}
              rules={[
                { required: true, message: "Informe seu email" },
                { type: "email", message: "Email inválido" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-zinc-400" />}
                placeholder="seu@email.com"
                className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-800 text-zinc-900 dark:text-white"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="text-zinc-700 dark:text-zinc-300">Senha</span>}
              rules={[
                { required: true, message: "Informe sua senha" },
                { min: 6, message: "Mínimo 6 caracteres" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-zinc-400" />}
                placeholder="••••••••"
                className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-800 text-zinc-900 dark:text-white"
              />
            </Form.Item>

            <div className="flex justify-end mb-6">
              <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              className="h-12 bg-blue-600 hover:bg-blue-500 border-none text-base font-semibold shadow-lg shadow-blue-500/20 rounded-xl"
            >
              Entrar
            </Button>
          </Form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-black px-4 text-zinc-500">ou continue com</span>
            </div>
          </div>

          <Button
            icon={<GoogleOutlined />}
            size="large"
            block
            onClick={handleGoogleLogin}
            className="h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl flex items-center justify-center gap-2 font-medium"
          >
            Google
          </Button>

          <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Não tem uma conta?{" "}
            <Link
              href={`/auth/register${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
              className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-zinc-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2300&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30" />
        
        <div className="relative z-10 max-w-lg text-center p-12">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl">
            <span className="text-3xl font-bold text-white">L</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Gerencie sua estética automotiva com excelência
          </h2>
          <p className="text-lg text-white/70 leading-relaxed">
            Junte-se a milhares de estabelecimentos que transformaram sua gestão com o Lavacar.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Spin size="large" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}