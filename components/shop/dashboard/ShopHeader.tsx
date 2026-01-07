"use client";

import React from "react";
import { Typography, Button, Space } from "antd";
import { ShopOutlined, CalendarOutlined, SettingOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Title, Text } = Typography;

interface ShopHeaderProps {
  shopName: string;
  isActive?: boolean;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({ shopName, isActive = true }) => {
  return (
    <div className="card bg-gradient-to-r from-primary to-secondary shadow-lg mb-6">
      <div className="card-body py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <ShopOutlined className="text-3xl text-white" />
            </div>
            <div>
              <Title level={3} className="!text-white !mb-1">
                {shopName}
              </Title>
              <div className="flex items-center gap-2">
                <span className={`badge ${isActive ? "badge-success" : "badge-error"} text-white border-white/30`}>
                  {isActive ? "Ativo" : "Inativo"}
                </span>
                <Text className="text-white/80">
                  Bem-vindo ao seu painel administrativo
                </Text>
              </div>
            </div>
          </div>
          <Space>
            <Link href="/owner/settings">
              <Button
                icon={<SettingOutlined />}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                Configurações
              </Button>
            </Link>
            <Link href="/owner/appointments">
              <Button
                type="primary"
                icon={<CalendarOutlined />}
                className="bg-white text-primary hover:bg-white/90 border-0"
              >
                Ver Agenda
              </Button>
            </Link>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
