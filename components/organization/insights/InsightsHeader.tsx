"use client";

import React from "react";
import { Select, Typography } from "antd";
import { BarChartOutlined, CalendarOutlined } from "@ant-design/icons";
import type { OrganizationInsightsPeriod } from "@/types/organization";

const { Title, Text } = Typography;

interface InsightsHeaderProps {
  organizationName: string;
  period: OrganizationInsightsPeriod;
  onPeriodChange: (period: OrganizationInsightsPeriod) => void;
}

export const InsightsHeader: React.FC<InsightsHeaderProps> = ({
  organizationName,
  period,
  onPeriodChange,
}) => {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-indigo-950 dark:to-black border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm transition-all duration-300">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-5 text-zinc-900 dark:text-white">
        <BarChartOutlined style={{ fontSize: "180px" }} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-indigo-50 dark:bg-white/10 backdrop-blur-md text-indigo-600 dark:text-indigo-100 border border-indigo-100 dark:border-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              Analytics
            </span>
            <span className="flex items-center gap-1 text-zinc-500 dark:text-indigo-200 text-xs font-medium">
              <CalendarOutlined /> Organização
            </span>
          </div>

          <Title level={2} className="!text-zinc-900 dark:!text-white !mb-2 !font-bold tracking-tight">
            Insights de {organizationName}
          </Title>
          <Text className="text-zinc-500 dark:text-indigo-200 text-lg max-w-2xl block">
            Métricas consolidadas de todas as lojas com visão operacional e financeira.
          </Text>
        </div>

        <div className="bg-zinc-50 dark:bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-zinc-200 dark:border-white/20">
          <Select
            value={period}
            className="w-48"
            variant="borderless"
            onChange={(value) => onPeriodChange(value as OrganizationInsightsPeriod)}
            options={[
              { value: "7d", label: "Últimos 7 dias" },
              { value: "30d", label: "Últimos 30 dias" },
              { value: "90d", label: "Últimos 3 meses" },
              { value: "lifetime", label: "Todo o período" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
