"use client";

import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";

export const ScheduleAlert: React.FC = () => {
  return (
    <div className="flex gap-4 p-6 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 transition-colors duration-300">
      <div className="flex-shrink-0">
        <InfoCircleOutlined className="text-2xl text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <h5 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          Como funcionam os agendamentos?
        </h5>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Os horários configurados aqui definem os limites de operação da loja. Os slots de
          agendamento serão gerados automaticamente dentro destes períodos, respeitando a
          duração de cada serviço e os intervalos configurados.
        </p>
      </div>
    </div>
  );
};
