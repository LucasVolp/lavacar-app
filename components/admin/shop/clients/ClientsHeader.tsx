"use client";

import React from "react";
import { Typography } from "antd";
import { ContactsOutlined, TeamOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface ClientsHeaderProps {
  totalClients: number;
}

export const ClientsHeader: React.FC<ClientsHeaderProps> = ({ totalClients }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center gap-4">
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
          <ContactsOutlined className="text-3xl" />
        </div>
        <div>
          <Title level={3} className="!text-white !mb-0">
            Clientes
          </Title>
          <Text className="text-cyan-100">
            Gerencie sua base de clientes e acompanhe o histórico
          </Text>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold">{totalClients}</div>
          <div className="text-cyan-100 text-sm flex items-center gap-1 justify-center">
            <TeamOutlined /> Total de clientes
          </div>
        </div>
      </div>
    </div>
  );
};
