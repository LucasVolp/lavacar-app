"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, Divider, Alert } from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [form] = Form.useForm<LoginFormValues>();
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/";

  // Redirecionar se já estiver autenticado
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <Title level={2} className="!mb-2">
            Entrar
          </Title>
          <Text type="secondary">
            Acesse sua conta para agendar serviços
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
            name="password"
            label="Senha"
            rules={[
              { required: true, message: "Informe sua senha" },
              { min: 6, message: "A senha deve ter pelo menos 6 caracteres" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Sua senha"
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
              Entrar
            </Button>
          </Form.Item>

          {/* Link para recuperação de senha - desabilitado nesta fase */}
          <div className="text-center mb-4">
            <Text type="secondary" className="text-sm">
              Esqueceu sua senha?{" "}
              <Text type="secondary" className="cursor-not-allowed opacity-50">
                Recuperar (em breve)
              </Text>
            </Text>
          </div>
        </Form>

        <Divider>
          <Text type="secondary">ou</Text>
        </Divider>

        {/* Login com Google - vinculado ao endpoint existente */}
        <Button
          icon={<GoogleOutlined />}
          size="large"
          block
          className="mb-4"
          onClick={() => {
            // Redireciona para o endpoint OAuth do backend
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
            window.location.href = `${apiUrl}/auth/google`;
          }}
        >
          Continuar com Google
        </Button>

        <div className="text-center">
          <Text type="secondary">
            Não tem uma conta?{" "}
            <Link
              href={`/auth/register${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
              className="text-primary font-medium"
            >
              Criar conta
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}
