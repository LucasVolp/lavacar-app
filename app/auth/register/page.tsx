"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, Divider, Alert } from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const { Title, Text } = Typography;

interface RegisterFormValues {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [form] = Form.useForm<RegisterFormValues>();
  const [error, setError] = useState<string | null>(null);
  const { register, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/";

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  const handleSubmit = async (values: RegisterFormValues) => {
    setError(null);

    // Verificar se as senhas conferem
    if (values.password !== values.confirmPassword) {
      setError("As senhas não conferem");
      return;
    }

    try {
      const success = await register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phone: values.phone,
      });

      if (success) {
        router.push(redirectTo);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Erro ao criar conta");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <Title level={2} className="!mb-2">
            Criar Conta
          </Title>
          <Text type="secondary">
            Cadastre-se para agendar serviços
          </Text>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            closable
            onClose={() => setError(null)}
            className="mb-4"
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="firstName"
              label="Nome"
              rules={[{ required: true, message: "Informe seu nome" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Seu nome"
                size="large"
              />
            </Form.Item>

            <Form.Item name="lastName" label="Sobrenome">
              <Input placeholder="Seu sobrenome" size="large" />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Informe seu email" },
              { type: "email", message: "Email inválido" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="seu@email.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefone (opcional)"
          >
            <Input
              prefix={<PhoneOutlined className="text-gray-400" />}
              placeholder="(00) 00000-0000"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Senha"
            rules={[
              { required: true, message: "Informe uma senha" },
              { min: 6, message: "A senha deve ter pelo menos 6 caracteres" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Sua senha"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmar Senha"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Confirme sua senha" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("As senhas não conferem"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Confirme sua senha"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-2">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
            >
              Criar Conta
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">ou</Text>
        </Divider>

        {/* Cadastro com Google */}
        <Button
          icon={<GoogleOutlined />}
          size="large"
          block
          className="mb-4"
          onClick={() => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
            window.location.href = `${apiUrl}/auth/google`;
          }}
        >
          Continuar com Google
        </Button>

        <div className="text-center">
          <Text type="secondary">
            Já tem uma conta?{" "}
            <Link
              href={`/auth/login${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
              className="text-primary font-medium"
            >
              Fazer login
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}
