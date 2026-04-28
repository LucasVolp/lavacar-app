import React from "react";
import { StarOutlined } from "@ant-design/icons";

export function EvaluationsPageHeader() {
  return (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
        <StarOutlined className="text-amber-500 text-2xl" />
      </div>
      <div>
        <h1 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 m-0">Minhas Avaliações</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Histórico de feedback enviado para lava-jatos
        </p>
      </div>
    </div>
  );
}
