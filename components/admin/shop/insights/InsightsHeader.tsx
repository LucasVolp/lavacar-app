"use client";

import React from "react";
import { Row, Col, Typography, Space } from "antd";
import { LineChartOutlined, RiseOutlined, FallOutlined, BarChartOutlined } from "@ant-design/icons";
import { Shop } from "@/types/shop";

const { Title, Text } = Typography;

interface InsightsHeaderProps {
  shop: Shop | null;
  monthRevenue: number;
  revenueGrowth: number;
}

export const InsightsHeader: React.FC<InsightsHeaderProps> = ({
  shop,
  monthRevenue,
  revenueGrowth,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background Pattern (Subtle) */}
      <div className="absolute -top-3 -right-3 opacity-5 text-zinc-900 dark:text-zinc-100 pointer-events-none">
        <BarChartOutlined style={{ fontSize: "180px" }} />
      </div>

      <Row justify="space-between" align="middle" className="relative z-10">
        <Col>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-full flex items-center justify-center">
              <LineChartOutlined className="text-2xl text-indigo-600 dark:text-indigo-400" />
            </div>
            <Title level={3} className="!m-0 !text-zinc-900 dark:!text-zinc-100">
              Insights & Analytics
            </Title>
          </div>
          <Text className="text-zinc-500 dark:text-zinc-400">
            Análise de performance de <span className="font-semibold text-zinc-700 dark:text-zinc-300">{shop?.name}</span>
          </Text>
        </Col>
        <Col>
          <Space size="large" split={<div className="w-px h-10 bg-zinc-200 dark:bg-zinc-700" />}>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                R$ {monthRevenue.toFixed(0)}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Receita do mês
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                  revenueGrowth >= 0 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {revenueGrowth >= 0 ? <RiseOutlined /> : <FallOutlined />}
                {Math.abs(revenueGrowth).toFixed(0)}%
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                vs mês anterior
              </div>
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  );
};
