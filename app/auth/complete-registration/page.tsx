"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { Form, Input, Button, Alert, Spin } from "antd";
import {
  PhoneOutlined,
  UserOutlined,
  MailOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { maskPhone } from "@/lib/masks";

interface GoogleProfile {
  email: string;
  firstName: string;
  lastName?: string;
  picture?: string;
}

interface CompleteRegistrationFormValues {
  phone: string;
  firstName: string;
  lastName?: string;
  email: string;
}

function CompleteRegistrationForm() {
  const [form] = Form.useForm<CompleteRegistrationFormValues>();
  const [error, setError] = useState<string | null>(null);
  const { completeRegistration, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const profile = useMemo<GoogleProfile | null>(() => {
    const profileParam = searchParams.get("profile");
    if (!profileParam) return null;
    try {
      return JSON.parse(decodeURIComponent(profileParam)) as GoogleProfile;
    } catch {
      return null;
    }
  }, [searchParams]);

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
      });
    } else {
      router.push("/auth/login");
    }
  }, [profile, form, router]);

  useEffect(() => {
    if (isAuthenticated) {
      const redirectUrl = localStorage.getItem("auth_redirect");
      localStorage.removeItem("auth_redirect");
      const safeRedirect =
        redirectUrl && redirectUrl.startsWith("/") && !redirectUrl.startsWith("//")
          ? redirectUrl
          : "/";
      router.push(safeRedirect);
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (values: CompleteRegistrationFormValues) => {
    setError(null);
    try {
      const phoneDigits = values.phone.replace(/\D/g, "");
      const phone =
        phoneDigits.length >= 10 && phoneDigits.length <= 11
          ? `+55${phoneDigits}`
          : values.phone;

      const success = await completeRegistration({
        phone,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        picture: profile?.picture,
      });

      if (success) {
        const redirectUrl = localStorage.getItem("auth_redirect");
        localStorage.removeItem("auth_redirect");
        const safeRedirect =
          redirectUrl && redirectUrl.startsWith("/") && !redirectUrl.startsWith("//")
            ? redirectUrl
            : "/";
        router.push(safeRedirect);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Erro ao completar cadastro");
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-black transition-colors duration-300">
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24 relative">
        <Link href="/auth/login" className="absolute top-8 left-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeftOutlined /> Voltar
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Complete seu cadastro</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Precisamos do seu telefone para finalizar o cadastro com Google.
            </p>
          </div>

          {profile.picture && (
            <div className="flex items-center gap-4 mb-6 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <Image
                src={profile.picture}
                alt={`${profile.firstName} ${profile.lastName ?? ""}`}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">{profile.firstName} {profile.lastName}</p>
                <p className="text-sm text-zinc-500">{profile.email}</p>
              </div>
            </div>
          )}

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
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="firstName"
                label={<span className="text-zinc-700 dark:text-zinc-300">Nome</span>}
                rules={[{ required: true, message: "Obrigatório" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-zinc-400" />}
                  placeholder="Seu nome"
                  className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label={<span className="text-zinc-700 dark:text-zinc-300">Sobrenome</span>}
              >
                <Input
                  placeholder="Sobrenome"
                  className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </Form.Item>
            </div>

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
                disabled
                className="bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label={<span className="text-zinc-700 dark:text-zinc-300">Telefone</span>}
              rules={[{ required: true, message: "Informe seu telefone" }]}
            >
              <Input
                prefix={<PhoneOutlined className="text-zinc-400" />}
                placeholder="(00) 00000-0000"
                maxLength={15}
                onChange={(e) => {
                  const masked = maskPhone(e.target.value);
                  form.setFieldValue("phone", masked);
                }}
                className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-800 text-zinc-900 dark:text-white"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              className="h-12 mt-2 bg-blue-600 hover:bg-blue-500 border-none text-base font-semibold shadow-lg shadow-blue-500/20 rounded-xl"
            >
              Finalizar Cadastro
            </Button>
          </Form>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-zinc-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=2300&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-blue-600/30" />

        <div className="relative z-10 max-w-lg text-center p-12">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Quase lá!
          </h2>
          <p className="text-lg text-white/70 leading-relaxed">
            Informe seu telefone para concluir o cadastro e começar a usar a plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CompleteRegistrationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Spin size="large" />
      </div>
    }>
      <CompleteRegistrationForm />
    </Suspense>
  );
}
