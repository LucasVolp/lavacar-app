import React from "react";
import { Card } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Appointment } from "@/types/appointment";
import {
  formatCurrency,
  formatDuration,
  formatReceiptNumber,
} from "./formatters";

interface AppointmentServiceReceiptCardProps {
  appointment: Appointment;
}

export function AppointmentServiceReceiptCard({ appointment }: AppointmentServiceReceiptCardProps) {
  const servicesTotal = appointment.services.reduce(
    (sum, service) => sum + Number(service.servicePrice || 0),
    0
  );
  const estimatedTotal = Number(appointment.totalPrice || 0);
  const adjustment = servicesTotal - estimatedTotal;

  return (
    <Card
      title={
        <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
          <CalendarOutlined className="text-cyan-500" />
          <span>Resumo do Serviço</span>
        </div>
      }
      className="border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm rounded-2xl"
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-3 bg-zinc-50 dark:bg-zinc-800/40 text-sm space-y-1">
          <p className="m-0 text-zinc-500 dark:text-zinc-400">
            Comprovante #{formatReceiptNumber(appointment.id)}
          </p>
          <p className="m-0 text-zinc-600 dark:text-zinc-300">
            Serviço agendado para {dayjs(appointment.scheduledAt).format("DD/MM/YYYY [às] HH:mm")}
          </p>
          <p className="m-0 text-zinc-600 dark:text-zinc-300">
            Duração estimada total: {formatDuration(appointment.totalDuration)}
          </p>
        </div>

        {appointment.services.map((service) => (
          <div
            key={service.id}
            className="flex justify-between items-start pb-4 border-b border-dashed border-zinc-100 dark:border-zinc-800 last:border-0 last:pb-0"
          >
            <div>
              <p className="font-medium m-0 text-zinc-700 dark:text-zinc-200">{service.serviceName}</p>
              <p className="text-xs text-zinc-400 m-0 mt-1">{formatDuration(service.duration)}</p>
            </div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {formatCurrency(Number(service.servicePrice || 0))}
            </span>
          </div>
        ))}

        <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-sm">
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300">
            <span>Subtotal dos serviços</span>
            <span>{formatCurrency(servicesTotal)}</span>
          </div>
          {adjustment !== 0 && (
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span>Ajuste/Desconto</span>
              <span>{formatCurrency(-adjustment)}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-lg pt-1">
            <span className="font-bold text-zinc-800 dark:text-zinc-100">Total Estimado</span>
            <span className="font-bold text-green-600 dark:text-green-500">
              {formatCurrency(estimatedTotal)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
