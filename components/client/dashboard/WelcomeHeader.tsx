"use client";

import React from "react";
import { Button, Avatar, Tooltip } from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";

interface WelcomeHeaderProps {
  clientName: string;
  avatarUrl?: string;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ clientName, avatarUrl }) => {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl shadow-lg mb-8 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div className="flex items-center gap-4">
          <div className="p-0.5 bg-white/20 rounded-full backdrop-blur-sm">
            <Avatar
              size={64}
              icon={!avatarUrl && <UserOutlined />}
              src={avatarUrl}
              className="bg-white/90 !text-cyan-600"
            />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-0.5">
              {greeting()}, {clientName}!
            </h2>
            <p className="text-cyan-100 text-sm sm:text-base font-normal m-0">
              Gerencie seus agendamentos e veículos
            </p>
          </div>
        </div>
        <Tooltip title="Agendar um novo serviço">
          <Link href="/">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              className="!bg-white !text-cyan-600 hover:!bg-cyan-50 !border-0 !shadow-md font-semibold h-11 px-6 rounded-xl"
            >
              Novo Agendamento
            </Button>
          </Link>
        </Tooltip>
      </div>
    </div>
  );
};

export default WelcomeHeader;
