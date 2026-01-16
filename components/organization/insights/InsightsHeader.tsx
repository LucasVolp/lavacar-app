"use client";

import React from "react";
import { Select } from "antd";

export const InsightsHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Insights & Performance</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Acompanhe as métricas principais da sua organização.</p>
      </div>

      <div>
        <Select
          defaultValue="30d"
          className="w-40 !bg-white dark:!bg-zinc-900 custom-select"
          options={[
            { value: "7d", label: "Últimos 7 dias" },
            { value: "30d", label: "Últimos 30 dias" },
            { value: "90d", label: "Últimos 3 meses" },
            { value: "ytd", label: "Este ano" },
          ]}
        />
      </div>
    </div>
  );
};
