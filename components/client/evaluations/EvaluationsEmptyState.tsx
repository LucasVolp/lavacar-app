import React from "react";
import { StarOutlined } from "@ant-design/icons";

export function EvaluationsEmptyState() {
  return (
    <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-3xl p-12 shadow-sm text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 dark:bg-[#27272a] flex items-center justify-center">
        <StarOutlined className="text-4xl text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">Nenhuma avaliação</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        Você ainda não avaliou nenhum serviço. Após concluir um agendamento, você poderá
        deixar seu feedback.
      </p>
    </div>
  );
}
