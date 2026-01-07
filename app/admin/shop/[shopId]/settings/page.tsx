"use client";

import React from "react";
import { Card, Typography, Empty } from "antd";
import { SettingOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

/**
 * Configurações do Shop
 * 
 * Rota: /shop/[shopId]/settings
 * 
 * ⚠️ Placeholder - Fora do escopo desta fase
 */
export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <Title level={3} className="!mb-1">
          <SettingOutlined className="mr-2" />
          Configurações
        </Title>
        <Text type="secondary">
          Configure as preferências do estabelecimento
        </Text>
      </div>

      <Card>
        <Empty
          description="Funcionalidade em desenvolvimento"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    </div>
  );
}
