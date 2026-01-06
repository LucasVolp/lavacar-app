"use client";

import React, { useState } from "react";
import { Row, Col, message } from "antd";
import {
  ProfileHeader,
  ProfileInfoForm,
  PasswordForm,
  ClientNotificationSettingsForm,
  type UserProfile,
  type ClientNotificationSettings,
} from "@/components/client/profile";

// Mock data
const initialProfile: UserProfile = {
  name: "João Silva",
  email: "joao.silva@email.com",
  phone: "(11) 99999-1234",
  cpf: "123.456.789-00",
};

const initialNotifications: ClientNotificationSettings = {
  emailAppointmentConfirm: true,
  emailReminder: true,
  whatsappAppointmentConfirm: true,
  whatsappReminder: true,
};

export default function ClientProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [notifications, setNotifications] = useState<ClientNotificationSettings>(initialNotifications);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileChange = (values: UserProfile) => {
    setProfile(values);
    setHasChanges(true);
  };

  const handleNotificationsChange = (values: ClientNotificationSettings) => {
    setNotifications(values);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setHasChanges(false);
    message.success("Perfil atualizado com sucesso!");
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    setIsChangingPassword(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsChangingPassword(false);
    message.success("Senha alterada com sucesso!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ProfileHeader
        onSave={handleSave}
        isSaving={isSaving}
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
