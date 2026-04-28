"use client";

import React from "react";
import { CrownOutlined } from "@ant-design/icons";

interface ShopRankingProps {
  ranking: {
    rank: number;
    shopId: string;
    name: string;
    revenue: number;
    completedAppointments: number;
  }[];
}

const rankStyles: Record<number, string> = {
  1: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  2: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200",
  3: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export function ShopRanking({ ranking }: ShopRankingProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 rounded-2xl shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2 mb-5">
        <CrownOutlined className="text-amber-500" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white m-0">Ranking de Faturamento</h3>
      </div>

      {ranking.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 m-0">Sem dados para ranking no período.</p>
      ) : (
        <div className="space-y-3">
          {ranking.map((item) => (
            <div
              key={item.shopId}
              className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 p-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${rankStyles[item.rank] || "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}
                >
                  {item.rank}
                </span>
                <div className="min-w-0">
                  <p className="m-0 font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">{item.name}</p>
                  <p className="m-0 text-xs text-zinc-500 dark:text-zinc-400">
                    {item.completedAppointments} serviços concluídos
                  </p>
                </div>
              </div>

              <p className="m-0 font-semibold text-emerald-600 dark:text-emerald-500 whitespace-nowrap">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.revenue)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
