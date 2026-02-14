import React from "react";
import { Button, Tooltip } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Appointment } from "@/types/appointment";

interface AppointmentDetailHeaderProps {
  appointment: Appointment;
  canModify: boolean;
  confirmLoading: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AppointmentDetailHeader({
  appointment,
  canModify,
  confirmLoading,
  onBack,
  onConfirm,
  onCancel,
}: AppointmentDetailHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className="dark:bg-zinc-800 dark:border-zinc-700"
        >
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold m-0 dark:text-zinc-100">
            Agendamento #{appointment.id.substring(0, 6)}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 m-0 text-sm">
            Criado em {dayjs(appointment.createdAt).format("DD/MM/YYYY [às] HH:mm")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge
          status={appointment.status}
          className="px-3 py-1 text-sm font-medium m-0"
        />

        {canModify && appointment.status === "PENDING" && (
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={onConfirm}
            loading={confirmLoading}
            className="bg-green-600 hover:bg-green-500 border-green-600 shadow-sm"
          >
            Confirmar Presença
          </Button>
        )}

        {canModify && (
          <Tooltip title="Cancelar agendamento">
            <Button
              type="text"
              danger
              icon={<CloseCircleOutlined />}
              onClick={onCancel}
              className="hover:bg-red-50 dark:hover:bg-red-900/20 shadow-none border-0"
            >
              Cancelar
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
