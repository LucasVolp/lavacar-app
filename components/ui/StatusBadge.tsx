import React from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<
  string,
  {
    className: string;
    label: string;
    icon: React.ReactNode;
  }
> = {
  PENDING: {
    className:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    label: "Pendente",
    icon: <ExclamationCircleOutlined />,
  },
  CONFIRMED: {
    className:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    label: "Confirmado",
    icon: <CheckCircleOutlined />,
  },
  IN_PROGRESS: {
    className:
      "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
    label: "Em Andamento",
    icon: <SyncOutlined spin />,
  },
  COMPLETED: {
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    label: "Concluído",
    icon: <CheckCircleOutlined />,
  },
  CANCELED: {
    className:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    label: "Cancelado",
    icon: <CloseCircleOutlined />,
  },
  WAITING: {
    className:
      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    label: "Aguardando",
    icon: <ClockCircleOutlined />,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status] || {
    className: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    label: status,
    icon: null,
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className} ${className || ""}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};
