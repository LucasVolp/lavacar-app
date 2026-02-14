"use client";

import React from "react";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";

interface InsightsClientMixProps {
  newClients: number;
  recurringClients: number;
}

export const InsightsClientMix: React.FC<InsightsClientMixProps> = ({
  newClients,
  recurringClients,
}) => {
  const total = newClients + recurringClients;
  const newPct = total > 0 ? (newClients / total) * 100 : 0;
  const recurringPct = total > 0 ? (recurringClients / total) * 100 : 0;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-colors duration-300">
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
        <TeamOutlined className="text-blue-500" />
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">Novos vs Recorrentes</span>
      </div>

      <div className="p-6 space-y-4">
        <div className="w-full h-8 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 flex">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-500"
            style={{ width: `${newPct}%` }}
            title={`Novos: ${newPct.toFixed(1)}%`}
          />
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${recurringPct}%` }}
            title={`Recorrentes: ${recurringPct.toFixed(1)}%`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold">
              <UserOutlined />
              Novos
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 m-0">{newClients}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 m-0">{newPct.toFixed(1)}% do total</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">
              <TeamOutlined />
              Recorrentes
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 m-0">{recurringClients}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 m-0">{recurringPct.toFixed(1)}% do total</p>
          </div>
        </div>
      </div>
    </div>
  );
};
