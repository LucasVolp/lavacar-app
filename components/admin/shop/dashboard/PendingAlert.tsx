"use client";

import React from "react";
import { Button, Typography } from "antd";
import { ExclamationCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Appointment } from "@/types/appointment";

const { Text } = Typography;

interface PendingAlertProps {
  overdueAppointments: Appointment[];
  onResolveClick: () => void;
}

export const PendingAlert: React.FC<PendingAlertProps> = ({
  overdueAppointments,
  onResolveClick,
}) => {
  if (overdueAppointments.length === 0) {
    return null;
  }

  const count = overdueAppointments.length;

  return (
    <div className="mb-6 rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 p-4 transition-all duration-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/10">
            <ExclamationCircleOutlined className="text-xl" />
          </div>
          <div className="flex flex-col">
            <Text className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
              Atenção Necessária
            </Text>
            <Text className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
              Existe{count > 1 ? "m" : ""} <span className="font-semibold text-amber-600 dark:text-amber-400">{count} agendamento{count > 1 ? "s" : ""}</span> pendente{count > 1 ? "s" : ""} de baixa. O faturamento pode estar desatualizado.
            </Text>
          </div>
        </div>
        
        <Button
          type="primary"
          onClick={onResolveClick}
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 border-none shadow-amber-500/20 shadow-md rounded-xl h-10 px-6 font-medium flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95"
        >
          Resolver Pendências
          <ArrowRightOutlined className="text-xs" />
        </Button>
      </div>
    </div>
  );
};