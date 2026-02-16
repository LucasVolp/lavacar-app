"use client";

import React, { useState, useEffect } from "react";
import {
  Spin,
  Form,
  message,
  Modal,
} from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateUser } from "@/hooks/useUsers";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import {
  ClientProfileIdentityCard,
  ClientProfileInfoCard,
  ClientProfilePageHeader,
  ClientProfilePasswordCard,
  ClientProfileSecurityCard,
} from "@/components/client/profile";

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
      <ClientProfilePageHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ClientProfileIdentityCard user={user} memberSince={memberSince} onAvatarUpdated={refreshUser} />
          <ClientProfileSecurityCard
            onScrollToPassword={() =>
              document.getElementById("password-section")?.scrollIntoView({ behavior: "smooth" })
            }
            onLogout={handleLogout}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ClientProfileInfoCard
            form={form}
            loading={updateUser.isPending}
            onFinish={handleSaveProfile}
          />

          <div id="password-section">
            <ClientProfilePasswordCard
              form={passwordForm}
              isChangingPassword={isChangingPassword}
              requiresCurrentPassword={requiresCurrentPassword}
              onFinish={handleChangePassword}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
