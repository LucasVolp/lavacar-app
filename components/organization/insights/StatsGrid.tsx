"use client";

import React from "react";
import {
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

export const StatsGrid = () => {
  // Mock Data
  const stats = [
    {
      title: "Faturamento Total",
      value: "R$ 45.231,00",
      trend: "+12.5%",
      isUp: true,
      icon: <DollarOutlined />,
      color: "emerald",
    },
    {
      title: "Agendamentos",
      value: "1,234",
      trend: "+5.2%",
      isUp: true,
      icon: <CalendarOutlined />,
      color: "blue",
    },
    {
      title: "Novos Clientes",
      value: "321",
      trend: "-2.4%",
      isUp: false,
      icon: <UserOutlined />,
      color: "indigo",
    },
    {
      title: "Ticket Médio",
      value: "R$ 85,00",
      trend: "+0.8%",
      isUp: true,
      icon: <ShoppingOutlined />,
      color: "amber",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group shadow-sm dark:shadow-none"
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-${stat.color}-100 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-500`}
            >
              {stat.icon}
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                stat.isUp ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"
              } bg-zinc-100 dark:bg-zinc-950/50 px-2 py-1 rounded-full`}
            >
              {stat.isUp ? <RiseOutlined /> : <FallOutlined />}
              {stat.trend}
            </div>
          </div>
          <div>
            <p className="text-zinc-500 font-medium mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
              {stat.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};
