"use client";

import React from "react";
import { Typography } from "antd";
import type { OrganizationRevenueSeriesPoint } from "@/types/organization";

const { Text } = Typography;

interface RevenueChartProps {
  data: OrganizationRevenueSeriesPoint[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const maxRevenue = Math.max(...data.map((point) => point.revenue), 1);

  return (
    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl min-h-[420px] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Receita no Período</h3>
          <Text className="text-zinc-500 dark:text-zinc-400">Consolidado por intervalo</Text>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
          Nenhum dado para o período selecionado.
        </div>
      ) : (
        <>
          <div className="relative h-72 w-full mt-4">
            <div className="absolute inset-0 flex items-end justify-between px-2 gap-2 sm:gap-3 z-10">
              {data.map((point) => (
                <div key={point.dateKey} className="relative w-full h-full flex items-end group">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 dark:from-indigo-600 dark:to-indigo-500 rounded-t-lg opacity-80 group-hover:opacity-100 group-hover:scale-y-[1.02] transition-all duration-300 origin-bottom"
                    style={{ height: `${(point.revenue / maxRevenue) * 100}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        point.revenue,
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-4 text-xs text-zinc-500 font-medium">
            {data.map((point) => (
              <span key={point.dateKey} className="flex-1 text-center truncate">
                {point.label}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
