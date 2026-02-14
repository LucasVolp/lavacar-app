"use client";

import React, { useState, useEffect } from "react";
import {
  Spin,
  Card,
  Button,
  Form,
  Input,
  Avatar,
  message,
  Upload,
  Tag,
  Modal,
  Alert,
} from "antd";
import {
  UserOutlined,
  SafetyOutlined,
  LogoutOutlined,
  CameraOutlined,
  SaveOutlined,
  CalendarOutlined,
  MailOutlined,
  LockOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateUser } from "@/hooks/useUsers";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface PasswordFormValues {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function ClientProfilePage() {
  const { user, refreshUser, isLoading: authLoading, logout } = useAuth();
  const updateUser = useUpdateUser();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Logic to determine if current password is required
  // If user has a password (email/pass) OR if they are OAuth but already set a password
  // Default to true for safety if undefined
  const requiresCurrentPassword = user?.hasPassword !== false && !user?.provider;

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
      });
    }
  }, [user, form]);

  const handleSaveProfile = async (values: ProfileFormValues) => {
    if (!user) return;
    try {
      await updateUser.mutateAsync({
        id: user.id,
        payload: {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
        },
      });
      await refreshUser();
      message.success("Perfil atualizado com sucesso!");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      message.error(apiError.response?.data?.message || "Erro ao atualizar perfil");
    }
  };

  const handleChangePassword = async (values: PasswordFormValues) => {
    if (!user) return;
    setIsChangingPassword(true);
    try {
      const payload: { password?: string } = {
        password: values.newPassword,
      };
      
      if (requiresCurrentPassword && values.currentPassword) {
        // Backend handles verification
      }

      await updateUser.mutateAsync({
        id: user.id,
        payload,
      });
      message.success("Senha alterada com sucesso!");
      passwordForm.resetFields();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      message.error(apiError.response?.data?.message || "Erro ao alterar senha");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Sair da conta",
      content: "Tem certeza que deseja sair?",
      okText: "Sim, sair",
      cancelText: "Cancelar",
      okButtonProps: { danger: true },
      onOk: () => logout(),
    });
  };

  if (authLoading || !user) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const memberSince = user.createdAt
    ? dayjs(user.createdAt).format("MMMM [de] YYYY")
    : "Data desconhecida";

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-10">
      {/* Header / Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 m-0">
            Meu Perfil
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Gerencie suas informações pessoais e segurança.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Identity Card & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card
            className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-zinc-900"
            styles={{ body: { padding: 0 } }}
          >
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative"></div>
            <div className="px-6 pb-6 text-center relative">
              <div className="relative inline-block -mt-12 mb-3">
                <Avatar
                  size={96}
                  src={user.picture}
                  icon={<UserOutlined />}
                  className="border-4 border-white dark:border-zinc-900 bg-indigo-100 dark:bg-indigo-900 text-indigo-500 shadow-md"
                />
                <Upload showUploadList={false} disabled>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<CameraOutlined />}
                    size="small"
                    className="absolute bottom-0 right-0 shadow-sm"
                  />
                </Upload>
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 m-0">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">
                {user.email}
              </p>
              <Tag icon={<CalendarOutlined />} className="rounded-full px-3 py-1 border-0 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                Membro desde {memberSince}
              </Tag>
            </div>
          </Card>

          <Card
             title={
               <div className="flex items-center gap-2 font-semibold">
                 <SafetyOutlined className="text-emerald-500" />
                 <span>Segurança da Conta</span>
               </div>
             }
             className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900"
          >
             <div className="space-y-4">
               <Button block icon={<LockOutlined />} onClick={() => document.getElementById('password-section')?.scrollIntoView({ behavior: 'smooth' })}>
                 Redefinir Senha
               </Button>
               <Button block danger icon={<LogoutOutlined />} onClick={handleLogout}>
                 Encerrar Sessão
               </Button>
             </div>
          </Card>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity Form */}
          <Card
            title={
              <div className="flex items-center gap-2 font-semibold">
                <IdcardOutlined className="text-indigo-500" />
                <span>Dados de Identificação</span>
              </div>
            }
            className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSaveProfile}
              requiredMark={false}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="firstName"
                  label="Nome"
                  rules={[{ required: true, message: "Obrigatório" }]}
                >
                  <Input size="large" className="rounded-xl" />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  label="Sobrenome"
                >
                  <Input size="large" className="rounded-xl" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="email"
                  label="E-mail"
                >
                  <Input
                    size="large"
                    className="rounded-xl"
                    prefix={<MailOutlined className="text-zinc-400" />}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Celular / WhatsApp"
                >
                  <Input
                    size="large"
                    className="rounded-xl"
                    placeholder="(00) 00000-0000"
                  />
                </Form.Item>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={updateUser.isPending}
                  size="large"
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
                >
                  Salvar Alterações
                </Button>
              </div>
            </Form>
          </Card>

          {/* Password Form */}
          <div id="password-section">
            <Card
              title={
                <div className="flex items-center gap-2 font-semibold">
                  <LockOutlined className="text-amber-500" />
                  <span>Alteração de Senha</span>
                </div>
              }
              className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900"
            >
              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={handleChangePassword}
                requiredMark={false}
              >
                {!requiresCurrentPassword && (
                  <Alert
                    message="Atenção"
                    description="Você fez login com uma conta social. Recomendamos definir uma senha para garantir acesso direto por e-mail."
                    type="warning"
                    showIcon
                    className="mb-6 rounded-xl border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800 text-amber-800 dark:text-amber-200"
                  />
                )}

                {requiresCurrentPassword && (
                  <Form.Item
                    name="currentPassword"
                    label="Senha Atual"
                    rules={[{ required: true, message: "Informe sua senha atual para continuar" }]}
                  >
                    <Input.Password size="large" className="rounded-xl" placeholder="••••••••" />
                  </Form.Item>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    name="newPassword"
                    label="Nova Senha"
                    rules={[
                      { required: true, message: "Informe a nova senha" },
                      { min: 6, message: "Mínimo de 6 caracteres" }
                    ]}
                  >
                    <Input.Password size="large" className="rounded-xl" placeholder="••••••••" />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    label="Confirmar Nova Senha"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: "Confirme a senha" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('As senhas não coincidem'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password size="large" className="rounded-xl" placeholder="••••••••" />
                  </Form.Item>
                </div>

                <div className="flex justify-end pt-2">
                  <Form.Item shouldUpdate className="m-0">
                    {() => (
                      <Button
                        htmlType="submit"
                        loading={isChangingPassword}
                        size="large"
                        className="rounded-xl"
                        disabled={
                          !passwordForm.isFieldsTouched(true) ||
                          !!passwordForm.getFieldsError().filter(({ errors }) => errors.length).length
                        }
                      >
                        {requiresCurrentPassword ? "Atualizar Senha" : "Definir Senha"}
                      </Button>
                    )}
                  </Form.Item>
                </div>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
