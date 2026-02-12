"use client";

import React from "react";
import { Button, Badge } from "antd";
import { CalendarOutlined, RedoOutlined, RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { AppointmentCard } from "./AppointmentCard";
import type { Appointment } from "@/types/appointment";

interface UpcomingAppointmentsListProps {
  appointments: Appointment[];
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
  onClick?: (id: string) => void;
  isConfirming?: boolean;
  lastShopInfo?: { name: string; slug: string } | null;
  maxItems?: number;
}

export const UpcomingAppointmentsList: React.FC<UpcomingAppointmentsListProps> = ({
  appointments,
  onConfirm,
  onCancel,
  onClick,
  isConfirming = false,
  lastShopInfo,
  maxItems = 4,
}) => {
  const displayedAppointments = appointments.slice(0, maxItems);
  const hasMore = appointments.length > maxItems;

  // Empty State
  if (appointments.length === 0) {
    return (
      <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors h-full flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 mb-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <CalendarOutlined className="text-2xl text-zinc-400 dark:text-zinc-500" />
          </div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            Nenhum agendamento
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-4 max-w-[200px]">
            Seus próximos serviços aparecerão aqui.
          </p>

          {lastShopInfo && (
            <Link href={`/shop/${lastShopInfo.slug}/booking`}>
              <Button
                type="primary"
                icon={<RedoOutlined />}
                size="small"
                className="bg-indigo-600 hover:bg-indigo-500 border-none h-8 px-4 rounded-lg text-xs font-medium"
              >
                Reagendar
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm transition-colors overflow-hidden h-full flex flex-col">
      {/* Header - Compact */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <CalendarOutlined className="text-indigo-600 dark:text-indigo-400 text-sm" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 m-0">
                Agendamentos
              </h3>
              <Badge
                count={appointments.length}
                style={{ backgroundColor: "#6366f1", fontSize: 10 }}
                size="small"
              />
            </div>
          </div>
        </div>
        {appointments.length > 2 && (
          <Link href="/client/appointments">
            <Button
              type="text"
              size="small"
              className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-medium text-xs h-7 px-2"
            >
              Ver Todos <RightOutlined className="text-[10px]" />
            </Button>
          </Link>
        )}
      </div>

      {/* List - Compact */}
      <div className="flex-1 p-3 overflow-auto">
        <div className="flex flex-col gap-2">
          {displayedAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              id={appointment.id}
              shopName={appointment.shop?.name ?? "Loja"}
              services={
                appointment.services?.map((s) => ({
                  name: s.serviceName,
                  price: s.servicePrice,
                })) ?? []
              }
              vehicleInfo={
                appointment.vehicle
                  ? `${appointment.vehicle.brand ?? ""} ${appointment.vehicle.model ?? ""}`.trim() || appointment.vehicle.plate
                  : "—"
              }
              scheduledAt={appointment.scheduledAt}
              endTime={appointment.endTime}
              totalPrice={appointment.totalPrice}
              totalDuration={appointment.totalDuration}
              status={appointment.status}
              onConfirm={onConfirm}
              onCancel={onCancel}
              onClick={onClick}
              isConfirming={isConfirming}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      {hasMore && (
        <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <Link href="/client/appointments" className="block">
            <Button
              type="text"
              block
              size="small"
              className="text-xs text-zinc-500 hover:text-indigo-600 h-7"
            >
              +{appointments.length - maxItems} mais agendamentos
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointmentsList;
