"use client";

import { Spin } from "antd";

export function TrackingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#09090b] p-4">
      <div className="text-center" role="status" aria-live="polite">
        <Spin size="large" />
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base">
          Carregando seu agendamento...
        </p>
      </div>
    </div>
  );
}
