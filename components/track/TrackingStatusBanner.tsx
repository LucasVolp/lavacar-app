"use client";

import { useMemo } from "react";
import { Button } from "antd";
import {
  CheckCircleFilled,
  ClockCircleFilled,
  ExclamationCircleFilled,
  CloseCircleFilled,
  SyncOutlined,
} from "@ant-design/icons";
import { StatusBadge } from "@/components/ui";

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; bgColor: string }> = {
  PENDING: {
    icon: <ClockCircleFilled />,
    bgColor: "bg-orange-50 dark:bg-orange-900/10",
  },
  CONFIRMED: {
    icon: <CheckCircleFilled />,
    bgColor: "bg-blue-50 dark:bg-blue-900/10",
  },
  WAITING: {
    icon: <ClockCircleFilled />,
    bgColor: "bg-cyan-50 dark:bg-cyan-900/10",
  },
  IN_PROGRESS: {
    icon: <SyncOutlined spin />,
    bgColor: "bg-blue-50 dark:bg-blue-900/10",
  },
  COMPLETED: {
    icon: <CheckCircleFilled />,
    bgColor: "bg-emerald-50 dark:bg-emerald-900/10",
  },
  CANCELED: {
    icon: <CloseCircleFilled />,
    bgColor: "bg-red-50 dark:bg-red-900/10",
  },
  NO_SHOW: {
    icon: <ExclamationCircleFilled />,
    bgColor: "bg-slate-50 dark:bg-slate-900/10",
  },
};

interface TrackingStatusBannerProps {
  status: string;
  onRefresh: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLoading?: boolean;
  cancelLoading?: boolean;
}

export function TrackingStatusBanner({
  status,
  onRefresh,
  onConfirm,
  onCancel,
  confirmLoading,
  cancelLoading,
}: TrackingStatusBannerProps) {
  const config = useMemo(() => STATUS_CONFIG[status] || STATUS_CONFIG.PENDING, [status]);
  const isPending = status === "PENDING";

  return (
    <div className={`${config.bgColor} rounded-2xl p-4 sm:p-5`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0">{config.icon}</span>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
              Status do Serviço
            </p>
            <StatusBadge status={status} className="mt-1 text-sm px-3 py-1 rounded-lg" />
          </div>
        </div>
        <Button
          icon={<SyncOutlined />}
          onClick={onRefresh}
          className="rounded-xl min-w-[44px] min-h-[44px] shrink-0"
        >
          <span className="hidden sm:inline">Atualizar</span>
        </Button>
      </div>

      {isPending && (
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button
            type="primary"
            icon={<CheckCircleFilled />}
            onClick={onConfirm}
            loading={confirmLoading}
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 border-none font-semibold rounded-xl"
          >
            Confirmar
          </Button>
          <Button
            danger
            icon={<CloseCircleFilled />}
            onClick={onCancel}
            loading={cancelLoading}
            className="flex-1 h-11 font-semibold rounded-xl"
          >
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
}
