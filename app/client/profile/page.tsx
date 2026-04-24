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
import { authService } from "@/services/auth";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { maskPhone, unmask } from "@/lib/masks";
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

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

export default function ClientProfilePage() {
  const { user, refreshUser, isLoading: authLoading, logout } = useAuth();
  const updateUser = useUpdateUser();
  const [form] = Form.useForm();

  const [isSendingPasswordReset, setIsSendingPasswordReset] = useState(false);
  const [hasSentPasswordReset, setHasSentPasswordReset] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState<string | null>(null);

  const [isRequestingEmailChange, setIsRequestingEmailChange] = useState(false);
  const [pendingEmailChange, setPendingEmailChange] = useState<string | null>(null);

  const isGoogleLogin = user?.provider?.toLowerCase() === "google";

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone ? maskPhone(user.phone) : "",
        email: user.email,
      });
    }
  }, [user, form]);

  const handleSaveProfile = async (values: ProfileFormValues) => {
    if (!user) return;

    const sanitizedPhone = values.phone ? unmask(values.phone) : undefined;

    try {
      await updateUser.mutateAsync({
        id: user.id,
        payload: {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: sanitizedPhone,
        },
      });
      await refreshUser();
      message.success("Perfil atualizado com sucesso!");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      message.error(apiError.response?.data?.message || "Erro ao atualizar perfil");
    }
  };

  const handleRequestPasswordReset = async () => {
    if (!user?.email) {
      setPasswordResetError("Sua conta não tem e-mail cadastrado. Adicione um e-mail antes de alterar a senha.");
      return;
    }
    setPasswordResetError(null);
    setIsSendingPasswordReset(true);
    try {
      await authService.requestPasswordReset({ email: user.email });
      setHasSentPasswordReset(true);
      message.success("Link de redefinição enviado para seu e-mail.");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setPasswordResetError(
        apiError.response?.data?.message || "Não foi possível enviar o link. Tente novamente em instantes.",
      );
    } finally {
      setIsSendingPasswordReset(false);
    }
  };

  const handleRequestEmailChange = async (newEmail: string): Promise<boolean> => {
    setIsRequestingEmailChange(true);
    try {
      await authService.requestEmailChange({ newEmail });
      setPendingEmailChange(newEmail);
      message.success(`Enviamos um link de confirmação para ${newEmail}.`);
      return true;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const msg =
        apiError.response?.status === 409
          ? "Este e-mail já está em uso por outra conta."
          : apiError.response?.data?.message || "Não foi possível solicitar a troca de e-mail.";
      message.error(msg);
      return false;
    } finally {
      setIsRequestingEmailChange(false);
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
            currentEmail={user.email}
            isRequestingEmailChange={isRequestingEmailChange}
            pendingEmailChange={pendingEmailChange}
            onFinish={handleSaveProfile}
            onRequestEmailChange={handleRequestEmailChange}
            onDismissPendingEmailChange={() => setPendingEmailChange(null)}
          />

          <div id="password-section">
            <ClientProfilePasswordCard
              userEmail={user.email}
              isGoogleLogin={isGoogleLogin}
              isSending={isSendingPasswordReset}
              hasRequested={hasSentPasswordReset}
              errorMessage={passwordResetError}
              onRequestReset={handleRequestPasswordReset}
              onDismissError={() => setPasswordResetError(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
