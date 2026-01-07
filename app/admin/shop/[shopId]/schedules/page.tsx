"use client";

import React from "react";
import { Card, Typography, Empty } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

/**
 * Horários de Funcionamento do Shop
 * 
 * Rota: /shop/[shopId]/schedules
 * 
 * ⚠️ Placeholder - Fora do escopo desta fase
 */
export default function SchedulesPage() {
  return (
    <div>
      <div className="mb-6">
        <Title level={3} className="!mb-1">
          <ClockCircleOutlined className="mr-2" />
          Horários
        </Title>
        <Text type="secondary">
          Configure os horários de funcionamento do estabelecimento
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
