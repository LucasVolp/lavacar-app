"use client";

import React from "react";
import { DollarOutlined, ClockCircleOutlined, ShopOutlined } from "@ant-design/icons";

interface StatsOverviewProps {
  shopsCount: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ shopsCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Revenue Card (Placeholder) */}
      <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group shadow-sm dark:shadow-none">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-500">
            <DollarOutlined className="text-xl" />
          </div>
          <span className="font-medium text-zinc-500 dark:text-zinc-400">Faturamento</span>
        </div>
        <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1 tracking-tight">
          --
          <span className="text-sm font-normal text-zinc-500 dark:text-zinc-600 block mt-1">
            Dados indisponíveis
          </span>
        </div>
      </div>

      {/* Pending Actions (Placeholder) */}
      <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group shadow-sm dark:shadow-none">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500">
            <ClockCircleOutlined className="text-xl" />
          </div>
          <span className="font-medium text-zinc-500 dark:text-zinc-400">Demandas</span>
        </div>
        <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1 tracking-tight">
          0
          <span className="text-sm font-normal text-zinc-500 dark:text-zinc-600 block mt-1">
            Nenhuma pendência
          </span>
        </div>
      </div>

      {/* Active Shops */}
      <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group shadow-sm dark:shadow-none">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-500">
            <ShopOutlined className="text-xl" />
          </div>
          <span className="font-medium text-zinc-500 dark:text-zinc-400">Estabelecimentos</span>
        </div>
        <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1 tracking-tight">
          {shopsCount}
          <span className="text-sm font-normal text-zinc-500 dark:text-zinc-600 block mt-1">
            Cadastrados
          </span>
        </div>
      </div>
    </div>
  );
};
