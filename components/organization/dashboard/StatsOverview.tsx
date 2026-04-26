"use client";

import React from "react";
import { CalendarOutlined, DollarOutlined, ShopOutlined, UserOutlined } from "@ant-design/icons";
import type { OrganizationDashboardMetrics } from "@/types/organization";

interface StatsOverviewProps {
  shopsCount: number;
  metrics: OrganizationDashboardMetrics["summary"];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const StatsOverview: React.FC<StatsOverviewProps> = ({ shopsCount, metrics }) => {
  const toneStyles: Record<string, string> = {
    emerald: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
    blue: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500",
    amber: "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500",
    indigo: "bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-500",
  };

  const cards = [
    {
      title: "Faturamento",
      value: formatCurrency(metrics.totalRevenue),
      subtitle: `${metrics.completedAppointments} concluídos`,
      icon: <DollarOutlined className="text-xl" />,
      tone: "emerald",
    },
    {
      title: "Agendamentos",
      value: String(metrics.totalAppointments),
      subtitle: `${metrics.inProgressNow} em andamento agora`,
      icon: <CalendarOutlined className="text-xl" />,
      tone: "blue",
    },
    {
      title: "Clientes",
      value: String(metrics.uniqueClients),
      subtitle: `${metrics.newClients} novos / ${metrics.recurringClients} recorrentes`,
      icon: <UserOutlined className="text-xl" />,
      tone: "amber",
    },
    {
      title: "Estabelecimentos",
      value: String(shopsCount),
      subtitle: "Cadastrados na organização",
      icon: <ShopOutlined className="text-xl" />,
      tone: "indigo",
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="min-w-0 bg-white dark:bg-zinc-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group shadow-sm dark:shadow-none"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl flex items-center justify-center ${toneStyles[card.tone]}`}
            >
              {card.icon}
            </div>
            <span className="font-medium text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm truncate">{card.title}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight truncate">{card.value}</div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 m-0 truncate">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
};
