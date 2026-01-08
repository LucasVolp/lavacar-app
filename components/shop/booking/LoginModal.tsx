"use client";

import { Modal, Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { LoginCredentials } from "@/services/auth";
import { useState } from "react";
import Link from "next/link";

interface LoginModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export function LoginModal({ open, onCancel, onSuccess }: LoginModalProps) {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleGoogleLogin = () => {

     if (typeof window !== 'undefined') {
        localStorage.setItem('auth_redirect', window.location.pathname);
     }
     window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/google`;
  };

  const handleSubmit = async (values: LoginCredentials) => {
    setLoading(true);
    try {
      const success = await login({
        email: values.email,
        password: values.password,
      });

      if (success) {
        message.success("Login realizado com sucesso!");
        onSuccess();
        form.resetFields();
      } else {
        message.error("Credenciais inválidas");
      }
    } catch {
      message.error("Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title={null}
      width={400}
      centered
      className="login-modal"
    >
      <div className="pt-6 px-2 pb-2">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Bem-vindo de volta!
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Faça login para finalizar seu agendamento.
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Por favor, insira seu email" },
              { type: "email", message: "Email inválido" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-slate-400" />}
              placeholder="Email"
              className="rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Por favor, insira sua senha" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-slate-400" />}
              placeholder="Senha"
              className="rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="h-12 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 font-bold rounded-xl border-none shadow-lg shadow-slate-900/20"
            >
              Entrar e Continuar
            </Button>
          </Form.Item>
        </Form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-[#18181b] text-slate-500 dark:text-slate-400">
              Ou
            </span>
          </div>
        </div>

        <div className="mb-4">
            <Button 
                block 
                size="large"
                icon={<GoogleOutlined />}
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 h-12 rounded-xl font-medium border-slate-200 dark:border-slate-700 hover:text-indigo-500 hover:border-indigo-500 active:bg-slate-50"
            >
                Entrar com Google
            </Button>
        </div>
        
        <div className="text-center mt-6">
           <p className="text-slate-500 dark:text-slate-400">
             Não tem conta?{" "}
             <Link href="/auth/register" className="text-indigo-500 font-bold hover:underline">
               Criar conta
             </Link>
           </p>
        </div>
      </div>
    </Modal>
  );
}
