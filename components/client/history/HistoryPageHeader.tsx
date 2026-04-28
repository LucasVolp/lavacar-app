import React from "react";
import { HistoryOutlined } from "@ant-design/icons";

export function HistoryPageHeader() {
  return (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#27272a] flex items-center justify-center border border-slate-200 dark:border-[#27272a]">
        <HistoryOutlined className="text-slate-500 dark:text-slate-400 text-2xl" />
      </div>
      <div>
        <h1 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 m-0">Histórico</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Seus serviços anteriores</p>
      </div>
    </div>
  );
}
