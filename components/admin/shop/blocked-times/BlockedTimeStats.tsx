"use client";

import React from "react";
import { 
  StopOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined,
  ExclamationCircleOutlined 
} from "@ant-design/icons";

interface BlockedTimeStatsProps {
  stats: {
    total: number;
    future: number;
    past: number;
    fullDay: number;
  };
}

export const BlockedTimeStats: React.FC<BlockedTimeStatsProps> = ({ stats }) => {
  const statItems = [
    {
      label: "Total de Bloqueios",
      value: stats.total,
      icon: <StopOutlined className="text-xl" />,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-500/10",
      border: "border-red-100 dark:border-red-500/20",
      iconBg: "bg-white dark:bg-red-500/20",
    },
    {
      label: "Bloqueios Futuros",
      value: stats.future,
      icon: <CalendarOutlined className="text-xl" />,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/10",
      border: "border-blue-100 dark:border-blue-500/20",
      iconBg: "bg-white dark:bg-blue-500/20",
    },
    {
      label: "Bloqueios Passados",
      value: stats.past,
      icon: <ClockCircleOutlined className="text-xl" />,
      color: "text-zinc-600 dark:text-zinc-400",
      bg: "bg-zinc-50 dark:bg-zinc-500/10",
      border: "border-zinc-200 dark:border-zinc-500/20",
      iconBg: "bg-white dark:bg-zinc-500/20",
    },
    {
      label: "Dias Inteiros",
      value: stats.fullDay,
      icon: <ExclamationCircleOutlined className="text-xl" />,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-100 dark:border-amber-500/20",
      iconBg: "bg-white dark:bg-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div 
          key={index}
          className={`
            ${item.bg} ${item.border} border rounded-xl p-5 
            flex flex-col items-center justify-center text-center 
            transition-all duration-300 hover:shadow-lg hover:-translate-y-1
            group cursor-default
          `}
        >
          <div className={`
            ${item.color} ${item.iconBg} mb-3 p-3 rounded-xl 
            shadow-sm group-hover:scale-110 transition-transform duration-300
          `}>
            {item.icon}
          </div>
          <div className={`text-2xl sm:text-3xl font-bold ${item.color} mb-1 tracking-tight`}>
            {item.value}
          </div>
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};
