"use client";

import React from "react";
import { Card, Segmented, DatePicker, Select, Button, Space } from "antd";import { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

interface AppointmentsFiltersProps {
  viewMode: "all" | "today" | "upcoming";
  setViewMode: (mode: "all" | "today" | "upcoming") => void;
  dateRange: [Dayjs | null, Dayjs | null] | null;
  setDateRange: (dates: [Dayjs | null, Dayjs | null] | null) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  statusConfig: Record<string, { label: string; icon: React.ReactNode }>;
  onClearFilters: () => void;
}

export const AppointmentsFilters: React.FC<AppointmentsFiltersProps> = ({
  viewMode,
  setViewMode,
  dateRange,
  setDateRange,
  statusFilter,
  setStatusFilter,
  statusConfig,
  onClearFilters,
}) => {
  return (
    <div className="space-y-4">
      <Card>
          <div className="flex flex-col lg:flex-row gap-4 sp">
            <Segmented
              value={viewMode}
              onChange={(value) => setViewMode(value as "all" | "today" | "upcoming")}
              options={[
                { label: "Todos", value: "all" },
                { label: "Hoje", value: "today" },
                { label: "Próximos", value: "upcoming" },
              ]}
            />

            <div className="flex flex-wrap gap-3 flex-1">
              <RangePicker
                value={dateRange as [Dayjs, Dayjs]}
                onChange={(dates) => setDateRange(dates)}
                format="DD/MM/YYYY"
                placeholder={["Data início", "Data fim"]}
                allowClear
                className="min-w-[250px]"
              />

              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filtrar por status"
                allowClear
                className="min-w-[180px]"
                options={Object.entries(statusConfig).map(([key, value]) => ({
                  value: key,
                  label: (
                    <Space>
                      {value.icon}
                      {value.label}
                    </Space>
                  ),
                }))}
              />
            </div>

            {(dateRange || statusFilter) && (
              <Button type="link" onClick={onClearFilters}>
                Limpar filtros
              </Button>
            )}
          </div>
        </Card>
    </div>
  );
};