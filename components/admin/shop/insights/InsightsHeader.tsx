"use client";

import React from "react";
import { Typography } from "antd";
import {
  LineChartOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import { Shop } from "@/types/shop";
import { formatCurrency, sanitizeText } from "@/lib/security";

const { Title, Text } = Typography;

interface InsightsHeaderProps {
  shop: Shop | null;
  monthRevenue: number;
  revenueGrowth: number;
}

export const InsightsHeader: React.FC<InsightsHeaderProps> = ({
  shop,
  monthRevenue,
  revenueGrowth
}) => {
  const shopName = shop?.name ? sanitizeText(shop.name) : "Estabelecimento";
  const isPositiveGrowth = revenueGrowth >= 0;
  const formattedGrowth = Math.abs(revenueGrowth).toFixed(1);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 relative overflow-hidden transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute -top-6 -right-6 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <BarChartOutlined style={{ fontSize: "220px" }} />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        {/* Left Section - Title */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/25">
              <LineChartOutlined className="text-xl text-white" />
            </div>
            <Title level={2} className="!m-0 !text-zinc-900 dark:!text-zinc-100 !font-bold">
              Insights & Analytics
            </Title>
          </div>
          <Text className="text-zinc-500 dark:text-zinc-400">
            Análise de performance de{" "}
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {shopName}
            </span>
          </Text>
        </div>

        {/* Right Section - KPIs */}
        <div className="flex flex-col items-center lg:items-end">
          {/* Main Revenue Value - Hero Typography */}
          <div className="text-center lg:text-right">
            <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium mb-1">
              Receita do Mês
            </p>
            <div className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-zinc-100 leading-none tracking-tight">
              {formatCurrency(monthRevenue)}
            </div>
          </div>

          {/* Growth Indicator - Centered Below */}
          <div className="mt-4 flex items-center justify-center lg:justify-end">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                isPositiveGrowth
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {isPositiveGrowth ? (
                <RiseOutlined className="text-lg" />
              ) : (
                <FallOutlined className="text-lg" />
              )}
              <span className="text-lg font-bold">{formattedGrowth}%</span>
              <span className="text-xs opacity-75">vs mês anterior</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
