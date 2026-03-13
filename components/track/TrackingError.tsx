"use client";

import { Card } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

interface TrackingErrorProps {
  message?: string;
}

export function TrackingError({ message }: TrackingErrorProps) {
  const displayMessage = message || "Não foi possível carregar o agendamento.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#09090b] p-4 sm:p-6">
      <Card className="max-w-md w-full border-none shadow-2xl rounded-3xl bg-white dark:bg-[#18181b]">
        <div className="text-center py-6 sm:py-8" role="alert">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <ExclamationCircleFilled className="text-4xl sm:text-5xl text-red-500" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">
            Link Inválido
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 px-2">
            {displayMessage}
          </p>
        </div>
      </Card>
    </div>
  );
}
