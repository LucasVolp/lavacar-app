"use client";

import React from "react";
import {
  CarOutlined,
  DollarOutlined,
  StarOutlined,
} from "@ant-design/icons";

interface QuickStatsWidgetProps {
  totalVisits: number;
  monthlySpending: number;
  avgRating: number;
}

export const QuickStatsWidget: React.FC<QuickStatsWidgetProps> = ({
  totalVisits,
  monthlySpending,
  avgRating,
}) => {
  return (
    <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm transition-colors overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <StarOutlined className="text-amber-600 dark:text-amber-400 text-sm" />
        </div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 m-0">
          Resumo
        </h3>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Total Visits */}
        <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <CarOutlined className="text-indigo-600 dark:text-indigo-400 text-xs" />
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Visitas</span>
          </div>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {totalVisits}
          </span>
        </div>

        {/* Monthly Spending */}
        <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <DollarOutlined className="text-emerald-600 dark:text-emerald-400 text-xs" />
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Gasto/mês</span>
          </div>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            R$ {monthlySpending.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
          </span>
        </div>

        {/* Avg Rating */}
        <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <StarOutlined className="text-amber-600 dark:text-amber-400 text-xs" />
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Média</span>
          </div>
          <span className="text-lg font-bold text-amber-500">
            {avgRating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};
