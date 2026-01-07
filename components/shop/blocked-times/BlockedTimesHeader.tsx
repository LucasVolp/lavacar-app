"use client";

import React from "react";
import { Typography, Button, Space, Select } from "antd";
import { StopOutlined, PlusOutlined, FilterOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface BlockedTimesHeaderProps {
  onAddNew?: () => void;
  onFilterChange?: (value: string) => void;
}

export const BlockedTimesHeader: React.FC<BlockedTimesHeaderProps> = ({
  onAddNew,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
          <StopOutlined className="text-warning text-xl" />
        </div>
        <div>
          <Title level={3} className="!mb-0">
            Bloqueios de Horários
          </Title>
          <span className="text-base-content/60 text-sm">
            Gerencie feriados, folgas e bloqueios de horários
          </span>
        </div>
      </div>
      <Space>
        <Select
          placeholder="Filtrar período"
          allowClear
          className="w-40"
          onChange={onFilterChange}
          suffixIcon={<FilterOutlined />}
          options={[
            { value: "upcoming", label: "Próximos" },
            { value: "past", label: "Passados" },
            { value: "all", label: "Todos" },
          ]}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
          Novo Bloqueio
        </Button>
      </Space>
    </div>
  );
};

export default BlockedTimesHeader;
