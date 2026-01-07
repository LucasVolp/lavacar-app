"use client";

import React from "react";
import { Card, Typography, Empty } from "antd";
import { ToolOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

/**
 * Lista de Serviços do Shop
 * 
 * Rota: /shop/[shopId]/services
 * 
 * ⚠️ Placeholder - Fora do escopo desta fase
 */
export default function ServicesPage() {
  return (
    <div>
      <div className="mb-6">
        <Title level={3} className="!mb-1">
          <ToolOutlined className="mr-2" />
          Serviços
        </Title>
        <Text type="secondary">
          Gerencie os serviços oferecidos pelo estabelecimento
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
