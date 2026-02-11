"use client";

import React from "react";
import { Alert, Button, Badge, Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
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
    <Alert
      type="warning"
      showIcon
      banner
      icon={
        <Badge count={count} size="small" offset={[2, -2]}>
          <ExclamationCircleOutlined className="text-amber-500 dark:text-amber-400 text-lg" />
        </Badge>
      }
      message={
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Text className="text-amber-700 dark:text-amber-300 text-sm font-medium">
            Existem {count} agendamento{count > 1 ? "s" : ""} pendente{count > 1 ? "s" : ""} de
            baixa. O faturamento exibido pode estar desatualizado.
          </Text>
          <Button
            type="primary"
            size="small"
            className="w-full sm:w-auto !bg-amber-500 hover:!bg-amber-600 !border-0 !text-white !shadow-sm !rounded-lg font-medium flex-shrink-0"
            onClick={onResolveClick}
          >
            Resolver Pendências
          </Button>
        </div>
      }
      className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 [&_.ant-alert-message]:flex-1"
    />
  );
};
