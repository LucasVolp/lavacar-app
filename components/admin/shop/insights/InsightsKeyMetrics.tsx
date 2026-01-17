"use client";

import React from "react";
import { Row, Col, Statistic, Tag } from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

interface KeyMetricsData {
  today: {
    appointments: number;
    revenue: number;
    pending: number;
    completed: number;
  };
  week: {
    revenue: number;
  };
  month: {
    avgTicket: number;
    avgDuration: number;
  };
}

interface InsightsKeyMetricsProps {
  metrics: KeyMetricsData;
}

export const InsightsKeyMetrics: React.FC<InsightsKeyMetricsProps> = ({ metrics }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 h-full border-l-4 !border-l-blue-500 hover:shadow-lg transition-all duration-300">
          <Statistic
            title={<span className="text-zinc-500 dark:text-zinc-400">Agendamentos Hoje</span>}
            value={metrics.today.appointments}
            prefix={<CalendarOutlined className="text-blue-500" />}
            valueStyle={{ fontWeight: 600 }}
            className="dark:[&_.ant-statistic-content-value]:text-zinc-100"
          />
          <div className="mt-2 flex gap-2">
            <Tag color="orange" className="border-none">{metrics.today.pending} pendentes</Tag>
            <Tag color="green" className="border-none">{metrics.today.completed} concluídos</Tag>
          </div>
        </div>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 h-full border-l-4 !border-l-green-500 hover:shadow-lg transition-all duration-300">
          <Statistic
            title={<span className="text-zinc-500 dark:text-zinc-400">Receita Hoje</span>}
            value={metrics.today.revenue}
            precision={2}
            prefix={<DollarOutlined className="text-green-500" />}
            valueStyle={{ fontWeight: 600 }}
             className="dark:[&_.ant-statistic-content-value]:text-zinc-100"
          />
          <div className="mt-2 text-xs text-zinc-400">
            Semana: R$ {metrics.week.revenue.toFixed(2)}
          </div>
        </div>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 h-full border-l-4 !border-l-purple-500 hover:shadow-lg transition-all duration-300">
          <Statistic
            title={<span className="text-zinc-500 dark:text-zinc-400">Ticket Médio</span>}
            value={metrics.month.avgTicket}
            precision={2}
            prefix={<ThunderboltOutlined className="text-purple-500" />}
            valueStyle={{ fontWeight: 600 }}
             className="dark:[&_.ant-statistic-content-value]:text-zinc-100"
          />
          <div className="mt-2 text-xs text-zinc-400">
            Média do mês atual
          </div>
        </div>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 h-full border-l-4 !border-l-cyan-500 hover:shadow-lg transition-all duration-300">
          <Statistic
            title={<span className="text-zinc-500 dark:text-zinc-400">Duração Média</span>}
            value={Math.round(metrics.month.avgDuration)}
            suffix="min"
            prefix={<ClockCircleOutlined className="text-cyan-500" />}
            valueStyle={{ fontWeight: 600 }}
             className="dark:[&_.ant-statistic-content-value]:text-zinc-100"
          />
          <div className="mt-2 text-xs text-zinc-400">
            Tempo médio de atendimento
          </div>
        </div>
      </Col>
    </Row>
  );
};