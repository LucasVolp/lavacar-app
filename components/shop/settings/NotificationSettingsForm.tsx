"use client";

import React from "react";
import { Card, Typography, Switch, Space, Divider } from "antd";
import {
  BellOutlined,
  MailOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export interface NotificationSettings {
  emailNewAppointment: boolean;
  emailCancellation: boolean;
  whatsappNewAppointment: boolean;
  whatsappReminder: boolean;
}

interface NotificationSettingsFormProps {
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
}

export const NotificationSettingsForm: React.FC<NotificationSettingsFormProps> = ({
  settings,
  onChange,
}) => {
  const handleChange = (key: keyof NotificationSettings, value: boolean) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <Card className="border-base-200">
      <div className="flex items-center gap-2 mb-4">
        <BellOutlined className="text-warning" />
        <Title level={5} className="!mb-0">
          Notificações
        </Title>
      </div>

      <Space direction="vertical" className="w-full" size="middle">
        {/* Email Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MailOutlined className="text-info" />
            <Text strong>E-mail</Text>
          </div>
          <Space direction="vertical" className="w-full pl-6">
            <div className="flex items-center justify-between">
              <Text>Novos agendamentos</Text>
              <Switch
                checked={settings.emailNewAppointment}
                onChange={(value) => handleChange("emailNewAppointment", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Text>Cancelamentos</Text>
              <Switch
                checked={settings.emailCancellation}
                onChange={(value) => handleChange("emailCancellation", value)}
              />
            </div>
          </Space>
        </div>

        <Divider className="my-2" />

        {/* WhatsApp Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <WhatsAppOutlined className="text-success" />
            <Text strong>WhatsApp</Text>
          </div>
          <Space direction="vertical" className="w-full pl-6">
            <div className="flex items-center justify-between">
              <Text>Novos agendamentos</Text>
              <Switch
                checked={settings.whatsappNewAppointment}
                onChange={(value) => handleChange("whatsappNewAppointment", value)}
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

export default NotificationSettingsForm;
