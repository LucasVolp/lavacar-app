"use client";

import React, { useState, useEffect } from "react";
import { Row, Col, message, Spin } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateUser } from "@/hooks/useUsers";
import {
  ProfileHeader,
  ProfileInfoForm,
  PasswordForm,
  ClientNotificationSettingsForm,
  type UserProfile,
  type ClientNotificationSettings,
} from "@/components/client/profile";

const initialNotifications: ClientNotificationSettings = {
  emailAppointmentConfirm: true,
  emailReminder: true,
  whatsappAppointmentConfirm: true,
  whatsappReminder: true,
};

export default function ClientProfilePage() {
  const { user, refreshUser, isLoading: authLoading } = useAuth();
  const updateUser = useUpdateUser();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<ClientNotificationSettings>(initialNotifications);
  const [hasChanges, setHasChanges] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Initialize profile from user data - re-run when user changes to support updates
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev, // Keep existing form state if valid, or overwrite? usually overwrite with fresh data
        name: `${user.firstName}${user.lastName ? " " + user.lastName : ""}`,
        email: user.email,
        phone: user.phone || "",
        // Only overwrite CPF if it comes from backend, otherwise keep local state if user is typing
        // But since CPF isn't in user context, we might need to fetch it separately or relying on it being undefined for now
        // If we want to persist between reloads, we need to update the useAuth context user object to include CPF
        cpf: user.cpf || prev?.cpf || undefined, 
        avatarUrl: user.picture,
      }));
    }
  }, [user]);

  const handleProfileChange = (values: UserProfile) => {
    setProfile(values);
    setHasChanges(true);
  };

  const handleNotificationsChange = (values: ClientNotificationSettings) => {
    setNotifications(values);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    try {
      // Parse name into firstName and lastName
      const nameParts = profile.name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || undefined;

      await updateUser.mutateAsync({
        id: user.id,
        payload: {
          firstName,
          lastName,
          email: profile.email,
          phone: profile.phone || undefined,
          cpf: profile.cpf ? profile.cpf.replace(/\D/g, "") : undefined,
        },
      });

      // Refresh user data in auth context
      await refreshUser();
      setHasChanges(false);
      message.success("Perfil atualizado com sucesso!");
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (error as any).response?.data?.message || "Erro ao atualizar perfil";
      message.error(errorMessage);
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return;

    setIsChangingPassword(true);
    try {
      // Note: This would need a proper password change endpoint in the backend
      // For now, we'll show a message that this feature needs backend support
      await updateUser.mutateAsync({
        id: user.id,
        payload: {
          password: newPassword,
        },
      });
      message.success("Senha alterada com sucesso!");
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (error as any).response?.data?.message || "Erro ao alterar senha";
      message.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (authLoading || !profile) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ProfileHeader
        onSave={handleSave}
        isSaving={updateUser.isPending}
        hasChanges={hasChanges}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <div className="space-y-4">
            <ProfileInfoForm
              initialValues={profile}
              onChange={handleProfileChange}
            />
            <PasswordForm
              onChangePassword={handleChangePassword}
              loading={isChangingPassword}
            />
          </div>
        </Col>

        <Col xs={24} lg={10}>
          <ClientNotificationSettingsForm
            settings={notifications}
            onChange={handleNotificationsChange}
          />
        </Col>
      </Row>
    </div>
  );
}
