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
    <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-3xl shadow-xl shadow-indigo-500/10 mb-8 p-8 transition-transform duration-300 hover:scale-[1.01]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="p-1 bg-white/20 rounded-full backdrop-blur-sm">
            <Avatar
              size={72}
              icon={<UserOutlined />}
              className="bg-white/90 !text-indigo-600 shadow-inner"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-sm m-0">
              Olá, {clientName}! 👋
            </h2>
            <p className="text-white/90 text-lg font-light m-0">
              Bem-vindo à sua área de cliente
            </p>
          </div>
        </div>
        <Link href="/">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            className="bg-white text-indigo-600 hover:bg-white/90 border-0 h-12 px-8 rounded-xl font-bold shadow-lg shadow-black/10"
          >
            Novo Agendamento
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomeHeader;
