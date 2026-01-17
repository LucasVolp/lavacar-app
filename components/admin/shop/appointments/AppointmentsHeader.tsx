"use client";

import React from "react";
import { Typography, Space, Button, Badge, Segmented } from "antd";
import { CalendarOutlined, ReloadOutlined, UnorderedListOutlined, AppstoreOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface AppointmentsHeaderProps {
  todayTotal: number;
  viewType: "table" | "calendar";
  onViewTypeChange: (view: "table" | "calendar") => void;
  onRefresh: () => void;
}

export const AppointmentsHeader: React.FC<AppointmentsHeaderProps> = ({
  todayTotal,
  viewType,
  onViewTypeChange,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Title level={3} className="!mb-1 flex items-center gap-2">
          <CalendarOutlined className="text-blue-500" />
          Agendamentos
          <Badge count={todayTotal} className="ml-2" title="Hoje" style={{ backgroundColor: '#52c41a' }} />
        </Title>
        <Text type="secondary">
          Gerencie todos os agendamentos do estabelecimento
        </Text>
      </div>
      <Space>
        <Segmented
          value={viewType}
          onChange={(v) => onViewTypeChange(v as "table" | "calendar")}
          options={[
            { value: "table", icon: <UnorderedListOutlined />, label: "Lista" },
            { value: "calendar", icon: <AppstoreOutlined />, label: "Agenda" },
          ]}
        />
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>
          Atualizar
        </Button>
      </Space>
    </div>
  );
};
