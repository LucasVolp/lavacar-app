"use client";

import React from "react";
import { Typography, Button, Space, Select } from "antd";
import { CalendarOutlined, PlusOutlined, FilterOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Title } = Typography;

interface ClientAppointmentsHeaderProps {
  onFilterChange?: (status: string) => void;
}

export const ClientAppointmentsHeader: React.FC<ClientAppointmentsHeaderProps> = ({
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
          <CalendarOutlined className="text-info text-xl" />
        </div>
        <div>
          <Title level={3} className="!mb-0">
            Meus Agendamentos
          </Title>
          <span className="text-base-content/60 text-sm">
            Visualize e gerencie seus agendamentos
          </span>
        </div>
      </div>
      <Space>
        <Select
          placeholder="Filtrar por status"
          allowClear
          className="w-40"
          onChange={onFilterChange}
          options={[
            { value: "PENDING", label: "Pendentes" },
            { value: "CONFIRMED", label: "Confirmados" },
            { value: "COMPLETED", label: "Concluídos" },
            { value: "CANCELED", label: "Cancelados" },
          ]}
          suffixIcon={<FilterOutlined />}
        />
        <Link href="/client/appointments/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Novo Agendamento
          </Button>
        </Link>
      </Space>
    </div>
  );
};

export default ClientAppointmentsHeader;
