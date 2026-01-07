"use client";

import React from "react";
import { Card, Typography, Empty } from "antd";
import { StopOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

/**
 * Bloqueios de Horário do Shop
 * 
 * Rota: /shop/[shopId]/blocked-times
 * 
 * ⚠️ Placeholder - Fora do escopo desta fase
 */
export default function BlockedTimesPage() {
  return (
    <div>
      <div className="mb-6">
        <Title level={3} className="!mb-1">
          <StopOutlined className="mr-2" />
          Bloqueios
        </Title>
        <Text type="secondary">
          Gerencie os bloqueios de horário do estabelecimento
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
