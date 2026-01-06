"use client";

import React from "react";
import { Typography, Button, Space, Input, DatePicker } from "antd";
import { CalendarOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface AppointmentsHeaderProps {
  title?: string;
  onAddNew?: () => void;
}

export const AppointmentsHeader: React.FC<AppointmentsHeaderProps> = ({
  title = "Agendamentos",
  onAddNew,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <CalendarOutlined className="text-primary text-xl" />
        </div>
        <div>
          <Title level={3} className="!mb-0">
            {title}
          </Title>
          <span className="text-base-content/60 text-sm">
            Gerencie os agendamentos do seu estabelecimento
          </span>
        </div>
      </div>
      <Space>
        <Input
          placeholder="Buscar cliente..."
          prefix={<SearchOutlined className="text-base-content/40" />}
          className="w-48"
        />
        <DatePicker placeholder="Filtrar data" />
        {onAddNew && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
            Novo Agendamento
          </Button>
        )}
      </Space>
    </div>
  );
};

export default AppointmentsHeader;
