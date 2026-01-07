"use client";

import React from "react";
import { Typography, Card, Progress } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface PerformanceCardProps {
  completionRate: number;
  occupancyRate: number;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({
  completionRate,
  occupancyRate,
}) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <CheckCircleOutlined className="text-success" />
          <span>Desempenho de Hoje</span>
        </div>
      }
      className="border-base-200"
    >
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <Text type="secondary" className="text-sm">
              Taxa de conclusão
            </Text>
            <Text strong>{completionRate}%</Text>
          </div>
          <Progress percent={completionRate} showInfo={false} strokeColor="#22c55e" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <Text type="secondary" className="text-sm">
              Ocupação do dia
            </Text>
            <Text strong>{occupancyRate}%</Text>
          </div>
          <Progress percent={occupancyRate} showInfo={false} strokeColor="#6366f1" />
        </div>
      </div>
    </Card>
  );
};

export default PerformanceCard;
