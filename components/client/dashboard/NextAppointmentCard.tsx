"use client";

import React, { useState, useEffect } from "react";
import { Button } from "antd";
import {
  CalendarOutlined,
  ShopOutlined,
  CarOutlined,
  CheckOutlined,
  CloseOutlined,
  RedoOutlined,
  RightOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface NextAppointment {
  id: string;
  shop: string;
  service: string;
  vehicle: string;
  date: string;
  time: string;
  status: string;
}

interface NextAppointmentCardProps {
  appointment: NextAppointment | null;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
  onClick?: (id: string) => void;
  isConfirming?: boolean;
  lastShopInfo?: { name: string; slug: string } | null;
}

export const NextAppointmentCard: React.FC<NextAppointmentCardProps> = ({
  appointment,
  onConfirm,
  onCancel,
  onClick,
  isConfirming = false,
  lastShopInfo,
}) => {
  const [countdown, setCountdown] = useState<{ value: string; unit: string }>({ value: "--", unit: "--" });

  useEffect(() => {
    if (!appointment) return;

    const target = dayjs(`${appointment.date} ${appointment.time}`, "DD/MM/YYYY HH:mm");

    const updateCountdown = () => {
      const now = dayjs();
      const diff = target.diff(now);

      if (diff <= 0) {
        setCountdown({ value: "Agora", unit: "Chegou a hora" });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      if (days > 0) {
        setCountdown({ value: days.toString(), unit: "Dias Restantes" });
      } else if (hours > 0) {
        setCountdown({ value: hours.toString(), unit: "Horas Restantes" });
      } else {
        setCountdown({ value: minutes.toString(), unit: "Min Restantes" });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [appointment]);

  if (!appointment) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm transition-colors">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
            <CalendarOutlined className="text-2xl text-zinc-400 dark:text-zinc-500" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            Agenda Livre
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 max-w-xs">
            {lastShopInfo
              ? "Que tal agendar aquele cuidado especial para o seu carro hoje?"
              : "Nenhum agendamento futuro encontrado."}
          </p>
          
          {lastShopInfo && (
            <Link href={`/shop/${lastShopInfo.slug}/booking`}>
              <Button
                type="primary"
                icon={<RedoOutlined />}
                className="bg-indigo-600 hover:bg-indigo-500 border-none h-10 px-6 rounded-lg font-medium shadow-sm"
              >
                Reagendar em {lastShopInfo.name}
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  const isPending = appointment.status === "PENDING";

  return (
    <div
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => onClick?.(appointment.id)}
    >
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Col 1-3: Countdown Visual */}
        <div className="md:col-span-3 bg-indigo-50 dark:bg-indigo-900/20 p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-indigo-100 dark:border-indigo-500/10">
          <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight leading-none">
            {countdown.value}
          </span>
          <span className="text-xs font-semibold text-indigo-400 dark:text-indigo-300 uppercase tracking-wider mt-1">
            {countdown.unit}
          </span>
        </div>

        {/* Col 4-9: Main Info */}
        <div className="md:col-span-6 p-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={appointment.status} />
          </div>
          
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 line-clamp-1">
            {appointment.service}
          </h3>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <ShopOutlined className="text-indigo-500" />
              <span className="truncate font-medium">{appointment.shop}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <CalendarOutlined className="text-indigo-500" />
              <span>{appointment.date} às {appointment.time}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <CarOutlined className="text-indigo-500" />
              <span className="truncate">{appointment.vehicle}</span>
            </div>
          </div>
        </div>

        {/* Col 10-12: Actions */}
        <div className="md:col-span-3 p-6 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          {isPending ? (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm?.(appointment.id);
                }}
                loading={isConfirming}
                className="w-full bg-emerald-600 hover:bg-emerald-500 border-none h-10 rounded-lg font-medium shadow-sm"
              >
                Confirmar
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel?.(appointment.id);
                }}
                className="w-full h-10 rounded-lg font-medium bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-red-500 dark:hover:border-red-500"
              >
                Cancelar
              </Button>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
               <Button
                type="text"
                className="text-zinc-400 hover:text-indigo-500 dark:text-zinc-500 dark:hover:text-indigo-400"
               >
                 Ver Detalhes <RightOutlined className="ml-1 text-xs" />
               </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NextAppointmentCard;
