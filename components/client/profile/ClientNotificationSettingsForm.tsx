"use client";

import React from "react";
import { Card, Typography, Switch, Space, Divider } from "antd";
import { BellOutlined, MailOutlined, WhatsAppOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export interface ClientNotificationSettings {
  emailAppointmentConfirm: boolean;
  emailReminder: boolean;
  whatsappAppointmentConfirm: boolean;
  whatsappReminder: boolean;
}

interface ClientNotificationSettingsFormProps {
  settings: ClientNotificationSettings;
  onChange: (settings: ClientNotificationSettings) => void;
}

export const ClientNotificationSettingsForm: React.FC<ClientNotificationSettingsFormProps> = ({
  settings,
  onChange,
}) => {
  const handleChange = (key: keyof ClientNotificationSettings, value: boolean) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <Card className="border-base-200">
      <div className="flex items-center gap-2 mb-4">
        <BellOutlined className="text-primary" />
        <Title level={5} className="!mb-0">
          Notificações
        </Title>
      </div>

      <Space direction="vertical" className="w-full" size="middle">
        {/* Email */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MailOutlined className="text-info" />
            <Text strong>E-mail</Text>
          </div>
          <Space direction="vertical" className="w-full pl-6">
            <div className="flex items-center justify-between">
              <Text>Confirmação de agendamento</Text>
              <Switch
                checked={settings.emailAppointmentConfirm}
                onChange={(value) => handleChange("emailAppointmentConfirm", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Text>Lembretes (24h antes)</Text>
              <Switch
                checked={settings.emailReminder}
                onChange={(value) => handleChange("emailReminder", value)}
              />
            </div>
          </Space>
        </div>

        <Divider className="my-2" />

        {/* WhatsApp */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <WhatsAppOutlined className="text-success" />
            <Text strong>WhatsApp</Text>
          </div>
          <Space direction="vertical" className="w-full pl-6">
            <div className="flex items-center justify-between">
              <Text>Confirmação de agendamento</Text>
              <Switch
                checked={settings.whatsappAppointmentConfirm}
                onChange={(value) => handleChange("whatsappAppointmentConfirm", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Text>Lembretes (24h antes)</Text>
              <Switch
                checked={settings.whatsappReminder}
                onChange={(value) => handleChange("whatsappReminder", value)}
              />
            </div>
          </Space>
        </div>
      </Space>
    </Card>
  );
};

export default ClientNotificationSettingsForm;
