"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetInviteDetails, useAcceptInvite } from "@/hooks/useOrganizationInvites";
import { Card, Typography, Button, Form, Input, message, Spin, Alert } from "antd";
import { UserOutlined, LockOutlined, CheckCircleOutlined, InfoCircleOutlined, PhoneOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [form] = Form.useForm();

  const { data: invite, isLoading, error } = useGetInviteDetails(token || "");
  const { mutateAsync: acceptInvite, isPending: isAccepting } = useAcceptInvite();

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
        <Alert message="Token inválido ou ausente" type="error" showIcon />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
        <Spin size="large" tip="Carregando detalhes do convite..." />
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
        <Alert 
          message="Erro ao carregar convite" 
          description={(error as { response?: { data?: { message?: string } } })?.response?.data?.message || "O convite pode ter expirado ou sido revogado."}
          type="error" 
          showIcon 
        />
      </div>
    );
  }

  const handleAccept = async (values?: { firstName?: string; lastName?: string; password?: string; phone?: string }) => {
    try {
      await acceptInvite({
        token,
        firstName: values?.firstName,
        lastName: values?.lastName,
        password: values?.password,
        phone: values?.phone || undefined,
      });

      message.success("Convite aceito com sucesso!");
      
      router.push("/auth/login");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      message.error(error.response?.data?.message || "Erro ao aceitar convite");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/25">
            <CheckCircleOutlined className="text-3xl text-white" />
          </div>
          <Title level={3} className="!mt-0 !mb-2 dark:text-white">Aceitar Convite</Title>
          <Text className="text-zinc-500 dark:text-zinc-400 block px-4">
            Você foi convidado por <span className="font-semibold text-zinc-800 dark:text-zinc-200">{invite.invitedBy.firstName}</span> para participar de <span className="font-semibold text-zinc-800 dark:text-zinc-200">{invite.organization.name}</span>.
          </Text>
        </div>

        {invite.userExists ? (
          <div className="space-y-6">
            <Alert
              message="Conta existente"
              description="Sua conta já existe. Ao aceitar, este estabelecimento será adicionado ao seu perfil."
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
              className="rounded-xl border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-200"
            />
            <Button
              type="primary"
              size="large"
              block
              loading={isAccepting}
              onClick={() => handleAccept()}
              className="h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 border-none shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 font-medium text-lg"
            >
              Aceitar Convite
            </Button>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAccept}
            requiredMark={false}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item
                name="firstName"
                label={<span className="text-zinc-700 dark:text-zinc-300 font-medium">Nome</span>}
                rules={[{ required: true, message: "Informe seu nome" }]}
              >
                <Input size="large" prefix={<UserOutlined className="text-zinc-400" />} className="rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" />
              </Form.Item>
              <Form.Item
                name="lastName"
                label={<span className="text-zinc-700 dark:text-zinc-300 font-medium">Sobrenome</span>}
                rules={[{ required: true, message: "Informe seu sobrenome" }]}
              >
                <Input size="large" prefix={<UserOutlined className="text-zinc-400" />} className="rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" />
              </Form.Item>
            </div>
            
            <Form.Item label={<span className="text-zinc-700 dark:text-zinc-300 font-medium">Email</span>}>
              <Input size="large" value={invite.invite.email} disabled className="rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400" />
            </Form.Item>

            <Form.Item
              name="phone"
              label={<span className="text-zinc-700 dark:text-zinc-300 font-medium">Telefone</span>}
              rules={[
                { required: true, message: "Informe seu telefone" },
                {
                  pattern: /^\+?[1-9]\d{1,14}$/,
                  message: "Informe um número válido (ex: 67991234567)",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<PhoneOutlined className="text-zinc-400" />}
                placeholder="Ex: 67991234567"
                className="rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="text-zinc-700 dark:text-zinc-300 font-medium">Crie uma senha</span>}
              rules={[
                { required: true, message: "Crie uma senha" },
                { min: 6, message: "A senha deve ter pelo menos 6 caracteres" }
              ]}
            >
              <Input.Password size="large" prefix={<LockOutlined className="text-zinc-400" />} className="rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" />
            </Form.Item>

            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              loading={isAccepting}
              className="h-12 mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 border-none shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 font-medium text-lg"
            >
              Criar conta e Aceitar
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <Spin size="large" />
      </div>
    }>
      <AcceptInviteContent />
    </Suspense>
  );
}
