"use client";

import React from "react";
import { Statistic } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  RiseOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";

interface DashboardStatsProps {
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    revenue: number;
    weekRevenue: number;
    weekAppointmentsCount: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      <div className="min-w-0 bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300">
        <Statistic
          title={<span className="text-zinc-500 dark:text-zinc-400 font-medium text-xs sm:text-sm uppercase tracking-wide">Agendamentos Hoje</span>}
          value={stats.total}
          prefix={<CalendarOutlined className="text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg mr-2 shrink-0" />}
          valueStyle={{ fontWeight: 700, color: 'inherit' }}
          className="dark:text-white"
        />
        <div className="mt-3 text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1 min-w-0">
          <ArrowUpOutlined className="text-emerald-500 shrink-0" />
          <span className="text-emerald-500 font-medium shrink-0">{stats.weekAppointmentsCount}</span>
          <span className="line-clamp-1">esta semana</span>
        </div>
      </div>

      <div className="min-w-0 bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300">
        <Statistic
          title={<span className="text-zinc-500 dark:text-zinc-400 font-medium text-xs sm:text-sm uppercase tracking-wide">Pendentes</span>}
          value={stats.pending}
          prefix={<ClockCircleOutlined className="text-orange-500 bg-orange-50 dark:bg-orange-900/30 p-2 rounded-lg mr-2 shrink-0" />}
          valueStyle={{ fontWeight: 700, color: 'inherit' }}
          className="dark:text-white"
        />
        <div className="mt-3 text-xs text-zinc-400 dark:text-zinc-500 line-clamp-2">
          Aguardando confirmação
        </div>
      </div>

      <div className="min-w-0 bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300">
        <Statistic
          title={<span className="text-zinc-500 dark:text-zinc-400 font-medium text-xs sm:text-sm uppercase tracking-wide">Em Andamento</span>}
          value={stats.inProgress}
          prefix={<RiseOutlined className="text-purple-500 bg-purple-50 dark:bg-purple-900/30 p-2 rounded-lg mr-2 shrink-0" />}
          valueStyle={{ fontWeight: 700, color: 'inherit' }}
          className="dark:text-white"
        />
        <div className="mt-3 text-xs text-zinc-400 dark:text-zinc-500 line-clamp-2">
          Sendo atendidos agora
        </div>
      </div>

      <div className="min-w-0 bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300">
        <Statistic
          title={<span className="text-zinc-500 dark:text-zinc-400 font-medium text-xs sm:text-sm uppercase tracking-wide">Receita do Dia</span>}
          value={stats.revenue}
          prefix={<DollarOutlined className="text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg mr-2 shrink-0" />}
          precision={2}
          valueStyle={{ fontWeight: 700, color: 'inherit', fontSize: 'clamp(16px, 3.5vw, 24px)' }}
          className="dark:text-white"
        />
        <div className="mt-3 text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1 min-w-0">
          <ArrowUpOutlined className="text-emerald-500 shrink-0" />
          <span className="text-emerald-500 font-medium shrink-0">R$ {stats.weekRevenue.toFixed(0)}</span>
          <span className="line-clamp-1">semana</span>
        </div>
      </div>
    </div>
  );
};
