"use client";

import React from "react";

export const RevenueChart = () => {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl min-h-[400px] shadow-sm dark:shadow-none">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Receita por Período</h3>

      {/* Mock Bar Chart */}
      <div className="flex items-end justify-between h-64 gap-2 mt-8">
        {[40, 65, 45, 80, 55, 70, 60, 90, 75, 85, 95, 60].map((h, i) => (
          <div
            key={i}
            className="w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-t-lg relative group transition-all hover:bg-indigo-100 dark:hover:bg-indigo-600/20"
          >
            <div
              className="absolute bottom-0 left-0 right-0 bg-indigo-600 rounded-t-lg opacity-80 group-hover:opacity-100 transition-all"
              style={{ height: `${h}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-xs text-zinc-500 font-medium uppercase tracking-wider">
        <span>Jan</span>
        <span>Fev</span>
        <span>Mar</span>
        <span>Abr</span>
        <span>Mai</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Ago</span>
        <span>Set</span>
        <span>Out</span>
        <span>Nov</span>
        <span>Dez</span>
      </div>
    </div>
  );
};
