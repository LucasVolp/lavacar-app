"use client";

import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

export const RevenueChart = () => {
  const data = [40, 65, 45, 80, 55, 70, 60, 90, 75, 85, 95, 60];
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  return (
    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl min-h-[450px] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Receita Mensal</h3>
            <Text className="text-zinc-500 dark:text-zinc-400">Comparativo do ano corrente</Text>
          </div>
          <div className="flex gap-2 text-sm">
             <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                2025
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium">
                <div className="w-2 h-2 rounded-full bg-zinc-400"></div>
                2024
             </div>
          </div>
      </div>

      {/* Bar Chart Area */}
      <div className="relative h-72 w-full mt-4">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[100, 75, 50, 25, 0].map((val) => (
                  <div key={val} className="w-full h-px bg-zinc-100 dark:bg-zinc-800/50 flex items-center">
                      <span className="text-[10px] text-zinc-400 -ml-8 w-6 text-right">{val}%</span>
                  </div>
              ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-between px-2 gap-2 sm:gap-4 z-10 pl-6">
            {data.map((h, i) => (
            <div
                key={i}
                className="relative w-full h-full flex items-end group"
            >
                <div 
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 dark:from-indigo-600 dark:to-indigo-500 rounded-t-lg opacity-80 group-hover:opacity-100 group-hover:scale-y-[1.02] transition-all duration-300 origin-bottom shadow-[0_4px_20px_-4px_rgba(79,70,229,0.3)]"
                    style={{ height: `${h}%` }}
                >
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                        R$ {h}k
                        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 rotate-45"></div>
                    </div>
                </div>
            </div>
            ))}
        </div>
      </div>
      
      {/* X Axis Labels */}
      <div className="flex justify-between mt-4 pl-6 text-xs text-zinc-500 font-medium uppercase tracking-wider">
        {months.map((m, i) => (
            <span key={i} className="flex-1 text-center">{m}</span>
        ))}
      </div>
    </div>
  );
};