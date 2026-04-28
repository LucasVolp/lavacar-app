"use client";

import React from "react";
import { Select } from "antd";
import { CalendarOutlined, FilterOutlined } from "@ant-design/icons";

interface ClientAppointmentsHeaderProps {
  onFilterChange?: (status: string) => void;
}

export const ClientAppointmentsHeader: React.FC<ClientAppointmentsHeaderProps> = ({
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl flex items-center justify-center">
          <CalendarOutlined className="text-cyan-500 text-xl" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold m-0 text-zinc-800 dark:text-zinc-100">
            Meus Agendamentos
          </h1>
          <span className="text-zinc-500 dark:text-zinc-400 text-sm">
            Visualize e gerencie seus agendamentos
          </span>
        </div>
      </div>
      <Select
        placeholder="Filtrar por status"
        allowClear
        className="w-full md:w-40"
        onChange={onFilterChange}
        options={[
          { value: "PENDING", label: "Pendentes" },
          { value: "CONFIRMED", label: "Confirmados" },
          { value: "COMPLETED", label: "Concluídos" },
          { value: "CANCELED", label: "Cancelados" },
        ]}
        suffixIcon={<FilterOutlined />}
      />
    </div>
  );
};

export default ClientAppointmentsHeader;
