"use client";

import React from "react";
import { Button, Card } from "antd";
import { LockOutlined, LogoutOutlined, SafetyOutlined } from "@ant-design/icons";

interface ClientProfileSecurityCardProps {
  onScrollToPassword: () => void;
  onLogout: () => void;
}

export const ClientProfileSecurityCard: React.FC<ClientProfileSecurityCardProps> = ({
  onScrollToPassword,
  onLogout,
}) => {
  return (
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
        <Button block icon={<LockOutlined />} onClick={onScrollToPassword}>
          Redefinir Senha
        </Button>
        <Button block danger icon={<LogoutOutlined />} onClick={onLogout}>
          Encerrar Sessão
        </Button>
      </div>
    </Card>
  );
};
