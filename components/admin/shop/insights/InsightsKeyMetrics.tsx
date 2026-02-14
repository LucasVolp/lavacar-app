"use client";

import React from "react";
import { Row, Col } from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { formatCurrency, formatNumber } from "@/lib/security";
import { CustomTooltip } from "@/components/ui";

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
    revenue: number;
    avgTicket: number;
    avgDuration: number;
    revenueGrowth: number;
    avgTicketGrowth: number;
  };
}

interface InsightsKeyMetricsProps {
  metrics: KeyMetricsData;
}

interface MetricCardProps {
  icon: React.ReactNode;
  iconBg: string;
  accentColor: string;
  title: string;
  value: string | number;
  subtitle?: React.ReactNode;
  tooltip?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  iconBg,
  accentColor,
  title,
  value,
  subtitle,
  tooltip
}) => {
  const content = (
    <div
      className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-default border-l-4 ${accentColor}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${iconBg}`}>{icon}</div>
      </div>

      <div>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-0 leading-tight">
          {value}
        </p>
        {subtitle && <div className="mt-2">{subtitle}</div>}
      </div>
    </div>
  );

  return tooltip ? (
    <CustomTooltip title={tooltip}>{content}</CustomTooltip>
  ) : (
    content
  );
};

export const InsightsKeyMetrics: React.FC<InsightsKeyMetricsProps> = ({
  metrics
}) => {
  const growthBadge = (value: number) => {
    const isPositive = value >= 0;
    const icon = isPositive ? "↗" : "↘";
    const color = isPositive
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${color}`}>
        {icon} {Math.abs(value).toFixed(1)}% vs mês anterior
      </span>
    );
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <MetricCard
          icon={<CalendarOutlined className="text-xl text-blue-600 dark:text-blue-400" />}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          accentColor="!border-l-blue-500"
          title="Agendamentos Hoje"
          value={metrics.today.appointments}
          tooltip="Total de agendamentos para hoje"
          subtitle={
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                {metrics.today.pending} pendentes
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                {metrics.today.completed} concluídos
              </span>
            </div>
          }
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <MetricCard
          icon={<DollarOutlined className="text-xl text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          accentColor="!border-l-emerald-500"
          title="Receita do Mês"
          value={formatCurrency(metrics.month.revenue)}
          tooltip="Receita de agendamentos concluídos no mês atual"
          subtitle={
            <div className="flex flex-col gap-1.5">
              {growthBadge(metrics.month.revenueGrowth)}
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0">
                Hoje:{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {formatCurrency(metrics.today.revenue)}
                </span>
              </p>
            </div>
          }
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <MetricCard
          icon={<ThunderboltOutlined className="text-xl text-purple-600 dark:text-purple-400" />}
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          accentColor="!border-l-purple-500"
          title="Ticket Médio"
          value={formatCurrency(metrics.month.avgTicket)}
          tooltip="Valor médio por atendimento este mês"
          subtitle={
            growthBadge(metrics.month.avgTicketGrowth)
          }
        />
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <MetricCard
          icon={<ClockCircleOutlined className="text-xl text-cyan-600 dark:text-cyan-400" />}
          iconBg="bg-cyan-100 dark:bg-cyan-900/30"
          accentColor="!border-l-cyan-500"
          title="Duração Média"
          value={`${formatNumber(metrics.month.avgDuration, 0)} min`}
          tooltip="Tempo médio de atendimento este mês"
          subtitle={
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0">
              Tempo médio de atendimento
            </p>
          }
        />
      </Col>
    </Row>
  );
};
