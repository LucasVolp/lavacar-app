"use client";

import React from "react";
import { Input, Select, Segmented, Button } from "antd";
import { SearchOutlined, AppstoreOutlined, UnorderedListOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

interface ServicesFiltersProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (status: "all" | "active" | "inactive") => void;
  viewType: "table" | "grid";
  onViewTypeChange: (type: "table" | "grid") => void;
  onAddService?: () => void;
}

export const ServicesFilters: React.FC<ServicesFiltersProps> = ({
  searchText,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewType,
  onViewTypeChange,
  onAddService,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
      <div className="flex flex-wrap gap-3 flex-1">
        <Input
          placeholder="Buscar serviços..."
          prefix={<SearchOutlined className="text-zinc-400" />}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-[300px]"
          allowClear
        />
        <Select
          value={statusFilter}
          onChange={onStatusFilterChange}
          className="w-[150px]"
          popupMatchSelectWidth={false}
        >
          <Option value="all">Todos</Option>
          <Option value="active">Ativos</Option>
          <Option value="inactive">Inativos</Option>
        </Select>
      </div>
      <div className="flex gap-3">
        <Segmented
          value={viewType}
          onChange={(v) => onViewTypeChange(v as "table" | "grid")}
          options={[
            { value: "grid", icon: <AppstoreOutlined /> },
            { value: "table", icon: <UnorderedListOutlined /> },
          ]}
        />
        {onAddService && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddService}
            className="bg-blue-600 hover:bg-blue-500 shadow-sm"
          >
            Novo Serviço
          </Button>
        )}
      </div>
    </div>
  );
};