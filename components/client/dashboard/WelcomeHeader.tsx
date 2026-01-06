"use client";

import React from "react";
import { Typography, Button, Avatar } from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Title, Text } = Typography;

interface WelcomeHeaderProps {
  clientName: string;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ clientName }) => {
  return (
    <div className="card bg-gradient-to-r from-info to-cyan-500 shadow-lg mb-6">
      <div className="card-body py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              size={64}
              icon={<UserOutlined />}
              className="bg-white/20"
            />
            <div>
              <Title level={3} className="!text-white !mb-1">
                Olá, {clientName}! 👋
              </Title>
              <Text className="text-white/80">
                Bem-vindo à sua área de cliente
              </Text>
            </div>
          </div>
          <Link href="/client/appointments/new">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              className="bg-white text-info hover:bg-white/90 border-0"
            >
              Novo Agendamento
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
