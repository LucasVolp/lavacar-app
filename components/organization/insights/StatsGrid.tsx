"use client";

import React from "react";
import {
  CalendarOutlined,
  DollarOutlined,
  RiseOutlined,
  UserOutlined,
} from "@ant-design/icons";

interface StatsGridProps {
  summary: {
    totalRevenue: number;
    totalAppointments: number;
    averageTicket: number;
    uniqueClients: number;
    newClients: number;
    recurringClients: number;
  };
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const StatsGrid: React.FC<StatsGridProps> = ({ summary }) => {
  const stats = [
    {
      title: "Faturamento Total",
      value: formatCurrency(summary.totalRevenue),
      description: "Receita realizada no período",
      icon: <DollarOutlined />,
      tone: "emerald",
    },
    {
      title: "Agendamentos",
      value: String(summary.totalAppointments),
      description: "Volume total no período",
      icon: <CalendarOutlined />,
      tone: "blue",
    },
    {
      title: "Ticket Médio",
      value: formatCurrency(summary.averageTicket),
      description: "Média por atendimento concluído",
      icon: <RiseOutlined />,
      tone: "amber",
    },
    {
      title: "Clientes",
      value: String(summary.uniqueClients),
      description: `${summary.newClients} novos / ${summary.recurringClients} recorrentes`,
      icon: <UserOutlined />,
      tone: "indigo",
    },
  ] as const;

  const toneStyles: Record<string, string> = {
    emerald: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
    blue: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500",
    amber: "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500",
    indigo: "bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-500",
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group shadow-sm dark:shadow-none"
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${toneStyles[stat.tone]}`}
            >
              {stat.icon}
            </div>
          </div>
          <div>
            <p className="text-zinc-500 font-medium mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{stat.value}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 m-0 mt-1">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
