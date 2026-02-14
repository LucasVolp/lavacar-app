"use client";

import React from "react";
import { Avatar, Button, Typography } from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface ClientDossierHeaderProps {
  fullName: string;
  picture?: string;
  onBack: () => void;
}

export const ClientDossierHeader: React.FC<ClientDossierHeaderProps> = ({
  fullName,
  picture,
  onBack,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
          Voltar
        </Button>
        <div className="flex items-center gap-3">
          <Avatar size={52} src={picture} icon={!picture ? <UserOutlined /> : undefined} />
          <div>
            <Title level={4} className="!m-0 dark:!text-zinc-100">
              Dossiê do Cliente
            </Title>
            <Text className="text-zinc-500 dark:text-zinc-400">{fullName}</Text>
          </div>
        </div>
      </div>
    </div>
  );
};
