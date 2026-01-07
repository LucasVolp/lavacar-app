"use client";

import React from "react";
import { Card, Input, Select, Space, Segmented, Button } from "antd";
import { 
  SearchOutlined, 
  FilterOutlined, 
  AppstoreOutlined, 
  UnorderedListOutlined,
  PlusOutlined,
} from "@ant-design/icons";

interface ServiceFiltersProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (value: "all" | "active" | "inactive") => void;
  viewType: "table" | "grid";
  onViewTypeChange: (value: "table" | "grid") => void;
  onAddService: () => void;
}

export const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  searchText,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewType,
  onViewTypeChange,
  onAddService,
}) => {
  return (
    <>
      {/* Controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Space wrap>
          <Segmented
            value={viewType}
            onChange={(v) => onViewTypeChange(v as "table" | "grid")}
            options={[
              { value: "table", icon: <UnorderedListOutlined />, label: "Lista" },
              { value: "grid", icon: <AppstoreOutlined />, label: "Cards" },
            ]}
          />
        </Space>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          size="large"
          onClick={onAddService}
        >
          Novo Serviço
        </Button>
      </div>

      {/* Filtros */}
      <Card size="small">
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            placeholder="Buscar serviço..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-xs"
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={onStatusFilterChange}
            style={{ width: 140 }}
            options={[
              { value: "all", label: "Todos" },
              { value: "active", label: "Ativos" },
              { value: "inactive", label: "Inativos" },
            ]}
            prefix={<FilterOutlined />}
          />
        </div>
      </Card>
    </>
  );
};
