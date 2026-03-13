"use client";

import { Modal, Button, Typography, Divider } from "antd";
import { GoogleOutlined, LoginOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

interface LoginModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function LoginModal({ open, onCancel }: LoginModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    const currentPath = window.location.pathname;
    router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={400}
      className="login-modal"
    >
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500 text-2xl">
          <LoginOutlined />
        </div>
        
        <Title level={3} className="!mb-2 dark:text-white">Faça Login</Title>
        <Text className="text-gray-500 dark:text-gray-400 block mb-6">
          Para confirmar seu agendamento, precisamos identificar você.
        </Text>

        <div className="space-y-3">
          <Button 
            type="primary" 
            size="large" 
            block 
            icon={<LoginOutlined />}
            onClick={handleLogin}
            className="h-11 bg-blue-600 hover:bg-blue-500"
          >
            Entrar com E-mail
          </Button>
          
          <Divider plain className="dark:text-gray-500 dark:border-gray-700">ou</Divider>
          
          <Button 
            size="large" 
            block 
            icon={<GoogleOutlined />}
            onClick={() => {
               const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
               window.location.href = `${apiUrl}/auth/google`;
            }}
            className="h-11 dark:bg-transparent dark:text-white dark:border-gray-600 dark:hover:border-gray-400"
          >
            Continuar com Google
          </Button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          Ainda não tem conta?{" "}
          <span 
            className="text-blue-500 hover:underline cursor-pointer font-medium"
            onClick={() => {
                const currentPath = window.location.pathname;
                router.push(`/auth/register?redirect=${encodeURIComponent(currentPath)}`);
            }}
          >
            Cadastre-se
          </span>
        </div>
      </div>
    </Modal>
  );
}
