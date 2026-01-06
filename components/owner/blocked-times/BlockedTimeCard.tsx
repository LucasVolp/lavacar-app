"use client";

import React from "react";
import { Card, Typography, Tag, Button, Space, Popconfirm } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

export interface BlockedTime {
  id: string;
  title: string;
  reason?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  isFullDay: boolean;
  type: "holiday" | "maintenance" | "personal" | "other";
}

interface BlockedTimeCardProps {
  blockedTime: BlockedTime;
  onEdit?: (blockedTime: BlockedTime) => void;
  onDelete?: (id: string) => void;
}

const typeConfig: Record<string, { color: string; label: string }> = {
  holiday: { color: "red", label: "Feriado" },
  maintenance: { color: "orange", label: "Manutenção" },
  personal: { color: "blue", label: "Pessoal" },
  other: { color: "default", label: "Outro" },
};

export const BlockedTimeCard: React.FC<BlockedTimeCardProps> = ({
  blockedTime,
  onEdit,
  onDelete,
}) => {
  const isSingleDay = blockedTime.startDate === blockedTime.endDate;

  return (
    <Card className="border-base-200 hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <Title level={5} className="!mb-0">
              {blockedTime.title}
            </Title>
            <Tag color={typeConfig[blockedTime.type]?.color || "default"}>
              {typeConfig[blockedTime.type]?.label || blockedTime.type}
            </Tag>
          </div>

          {blockedTime.reason && (
            <Text type="secondary" className="block text-sm mb-3">
              {blockedTime.reason}
            </Text>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-primary" />
              <Text className="text-sm">
                {isSingleDay
                  ? blockedTime.startDate
                  : `${blockedTime.startDate} até ${blockedTime.endDate}`}
              </Text>
            </div>

            {!blockedTime.isFullDay && blockedTime.startTime && blockedTime.endTime && (
              <div className="flex items-center gap-2">
                <ClockCircleOutlined className="text-info" />
                <Text className="text-sm">
                  {blockedTime.startTime} - {blockedTime.endTime}
                </Text>
              </div>
            )}

            {blockedTime.isFullDay && (
              <Tag color="purple">Dia inteiro</Tag>
            )}
          </div>
        </div>

        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit?.(blockedTime)}
          />
          <Popconfirm
            title="Excluir bloqueio"
            description="Tem certeza que deseja excluir este bloqueio?"
            onConfirm={() => onDelete?.(blockedTime.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      </div>
    </Card>
  );
};

export default BlockedTimeCard;
