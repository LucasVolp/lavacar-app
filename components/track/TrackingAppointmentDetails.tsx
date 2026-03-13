"use client";

import { useMemo } from "react";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { Divider } from "antd";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrackingAppointment } from "@/services/auth";

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function formatCurrency(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

interface TrackingAppointmentDetailsProps {
  appointment: TrackingAppointment;
}

export function TrackingAppointmentDetails({ appointment }: TrackingAppointmentDetailsProps) {
  const scheduledDate = useMemo(() => new Date(appointment.scheduledAt), [appointment.scheduledAt]);
  const totalPrice = useMemo(() => parseFloat(appointment.totalPrice), [appointment.totalPrice]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 min-h-[44px]">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
            <CalendarOutlined className="text-lg" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
              Data
            </p>
            <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
              {format(scheduledDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 min-h-[44px]">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-500">
            <ClockCircleOutlined className="text-lg" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
              Horário
            </p>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">
              {format(scheduledDate, "HH:mm")} ({formatDuration(appointment.totalDuration)})
            </p>
          </div>
        </div>
      </div>

      <Divider className="!my-4 dark:border-[#27272a]" />

      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-3">
          Serviços
        </p>
        <ul className="space-y-2">
          {appointment.services.map((service) => (
            <li key={service.id} className="flex justify-between text-sm gap-2">
              <span className="text-slate-700 dark:text-slate-300 truncate">
                {service.serviceName}
              </span>
              <span className="font-medium text-slate-900 dark:text-white shrink-0">
                R$ {formatCurrency(parseFloat(service.servicePrice))}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-200 dark:border-[#27272a]">
          <span className="font-bold text-slate-900 dark:text-white">Total</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            R$ {formatCurrency(totalPrice)}
          </span>
        </div>
      </div>

      {appointment.vehicle && (
        <>
          <Divider className="!my-4 dark:border-[#27272a]" />
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-3">
              Veículo
            </p>
            <div className="flex items-center gap-3 min-h-[44px]">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-500">
                <CarOutlined className="text-lg" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                  {appointment.vehicle.brand} {appointment.vehicle.model}
                </p>
                {appointment.vehicle.plate && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {appointment.vehicle.plate}
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
