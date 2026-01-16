"use client";

import React, { useState } from "react";
import { 
  Input, 
  Select, 
  Button, 
  Tag,
  Space,
  Tooltip,
  Row,
  Col
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { ShopStatus, SHOP_STATUS_MAP } from "@/types/shop";

const { Search } = Input;

interface ShopFiltersProps {
  onSearch?: (query?: string) => void;
  onFilter?: (status?: ShopStatus) => void;
  onCityFilter?: (city?: string) => void;
  onStateFilter?: (state?: string) => void;
  onClearFilters?: () => void;
  isLoading?: boolean;
}

const STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function ShopFilters({
  onSearch,
  onFilter,
  onCityFilter,
  onStateFilter,
  onClearFilters,
  isLoading = false,
}: ShopFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusValue, setStatusValue] = useState<ShopStatus | undefined>();
  const [stateValue, setStateValue] = useState<string | undefined>();
  const [cityValue, setCityValue] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value || undefined);
    updateActiveFilters("search", !!value);
  };

  const handleStatusChange = (value: ShopStatus | undefined) => {
    setStatusValue(value);
    onFilter?.(value);
    updateActiveFilters("status", !!value);
  };

  const handleStateChange = (value: string | undefined) => {
    setStateValue(value);
    onStateFilter?.(value);
    updateActiveFilters("state", !!value);
  };

  const handleCityChange = (value: string) => {
    setCityValue(value);
    onCityFilter?.(value || undefined);
    updateActiveFilters("city", !!value);
  };

  const updateActiveFilters = (key: string, isActive: boolean) => {
    setActiveFilters((prev) =>
      isActive ? [...prev.filter((f) => f !== key), key] : prev.filter((f) => f !== key)
    );
  };

  const clearAllFilters = () => {
    setSearchValue("");
    setStatusValue(undefined);
    setStateValue(undefined);
    setCityValue("");
    setActiveFilters([]);
    onSearch?.(undefined);
    onFilter?.(undefined);
    onStateFilter?.(undefined);
    onCityFilter?.(undefined);
    onClearFilters?.();
  };

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 mb-6">
      <div className="card-body p-4">
        {/* Main filters row */}
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={10} lg={8}>
            <Search
              placeholder="Buscar por nome, descrição..."
              prefix={<SearchOutlined className="text-base-content/40" />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
              allowClear
              loading={isLoading}
              className="w-full"
              size="large"
            />
          </Col>

          <Col xs={24} sm={12} md={7} lg={5}>
            <Select
              placeholder="Status da loja"
              value={statusValue}
              onChange={handleStatusChange}
              allowClear
              className="w-full"
              size="large"
            >
              {Object.entries(SHOP_STATUS_MAP).map(([key, { label, color }]) => (
                <Select.Option key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {label}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={7} lg={5}>
            <Select
              placeholder="Estado"
              value={stateValue}
              onChange={handleStateChange}
              allowClear
              showSearch
              className="w-full"
              size="large"
              suffixIcon={<EnvironmentOutlined />}
            >
              {STATES.map((state) => (
                <Select.Option key={state} value={state}>
                  {state}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={24} md={24} lg={6}>
            <Space className="w-full justify-end">
              {activeFilters.length > 0 && (
                <Tooltip title="Limpar todos os filtros">
                  <Button
                    icon={<ClearOutlined />}
                    onClick={clearAllFilters}
                    danger
                    type="text"
                  >
                    Limpar ({activeFilters.length})
                  </Button>
                </Tooltip>
              )}
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={() => handleSearch(searchValue)}
                loading={isLoading}
              >
                Filtrar
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Active filters tags */}
        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-base-content/60 text-sm">Filtros ativos:</span>
            {searchValue && (
              <Tag closable onClose={() => handleSearch("")} color="blue">
                Busca: &quot;{searchValue}&quot;
              </Tag>
            )}
            {statusValue && (
              <Tag
                closable
                onClose={() => handleStatusChange(undefined)}
                color={SHOP_STATUS_MAP[statusValue].color}
              >
                Status: {SHOP_STATUS_MAP[statusValue].label}
              </Tag>
            )}
            {stateValue && (
              <Tag closable onClose={() => handleStateChange(undefined)} color="purple">
                Estado: {stateValue}
              </Tag>
            )}
            {cityValue && (
              <Tag closable onClose={() => handleCityChange("")} color="cyan">
                Cidade: {cityValue}
              </Tag>
            )}
          </div>
        )}
      </div>
    </div>
  );
}