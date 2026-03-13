import React from "react";
import { Tag, Button } from "antd";
import {
  ClockCircleOutlined,
  CarOutlined,
  ShopOutlined,
  StarOutlined,
  StarFilled,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { Appointment } from "@/types/appointment";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatVehiclePlate } from "@/utils/vehiclePlate";

interface HistoryItemProps {
  appointment: Appointment;
  onReview?: (appointmentId: string, serviceName: string) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ appointment, onReview }) => {
  const isCompleted = appointment.status === "COMPLETED";
  const hasEvaluation = !!appointment.evaluation;

  const servicesText =
    appointment.services?.map((s) => s.serviceName).join(", ") ?? "Serviço não informado";

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
              {servicesText}
            </span>
            <StatusBadge status={appointment.status} />
          </div>
          <span className="font-bold text-emerald-600 dark:text-emerald-500 text-sm shrink-0">
            <DollarOutlined className="mr-0.5" />
            R$ {(parseFloat(appointment.totalPrice) || 0).toFixed(2)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <ClockCircleOutlined className="text-zinc-400 shrink-0" />
            <span>{dayjs(appointment.scheduledAt).format("DD/MM/YYYY [às] HH:mm")}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <ShopOutlined className="text-zinc-400 shrink-0" />
            <span className="truncate">{appointment.shop?.name ?? "Loja desconhecida"}</span>
          </div>
          {appointment.vehicle && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <CarOutlined className="text-zinc-400 shrink-0" />
              <span className="truncate">
                {appointment.vehicle.brand ?? "Veículo"} {appointment.vehicle.model ?? ""}
              </span>
              {appointment.vehicle.plate && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0" />
                  <span className="font-mono uppercase text-[10px]">
                    {formatVehiclePlate(appointment.vehicle.plate)}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {isCompleted && (
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
            {hasEvaluation ? (
              <div className="flex items-center gap-2">
                <Tag
                  icon={<StarFilled />}
                  className="m-0 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-500 rounded-md px-2 py-0.5 text-xs"
                >
                  Avaliado ({appointment.evaluation?.rating}/5)
                </Tag>
              </div>
            ) : onReview ? (
              <Button
                type="text"
                size="small"
                icon={<StarOutlined className="text-amber-500" />}
                className="!text-xs text-zinc-500 hover:!text-amber-600 !px-0"
                onClick={() => onReview(appointment.id, servicesText)}
              >
                Avaliar Serviço
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};


export default HistoryItem;
