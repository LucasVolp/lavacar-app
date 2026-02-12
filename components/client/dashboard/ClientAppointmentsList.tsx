"use client";

import React from "react";
import { Typography, Card, Tag, Button, Empty, Tooltip } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import dayjs from "dayjs";

const { Text } = Typography;

export interface ClientAppointment {
  id: string;
  shop: string;
  service: string;
  vehicle: string;
  date: string;
  time: string;
  status: string;
}

interface ClientAppointmentsListProps {
  appointments: ClientAppointment[];
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
  onClick?: (id: string) => void;
  isConfirming?: boolean;
  lastShopInfo?: { name: string; slug: string } | null;
}

const statusConfig: Record<string, { className: string; label: string }> = {
  PENDING: { className: "bg-amber-100/50 text-amber-700 border border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30 dark:shadow-[0_0_10px_rgba(245,158,11,0.2)]", label: "Pendente" },
  CONFIRMED: { className: "bg-blue-100/50 text-blue-700 border border-blue-300 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30 dark:shadow-[0_0_10px_rgba(59,130,246,0.2)]", label: "Confirmado" },
  IN_PROGRESS: { className: "bg-indigo-100/50 text-indigo-700 border border-indigo-300 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30 dark:shadow-[0_0_10px_rgba(99,102,241,0.2)]", label: "Em Andamento" },
  COMPLETED: { className: "bg-emerald-100/50 text-emerald-700 border border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 dark:shadow-[0_0_10px_rgba(16,185,129,0.2)]", label: "Concluído" },
  CANCELED: { className: "bg-red-100/50 text-red-700 border border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30 dark:shadow-[0_0_10px_rgba(239,68,68,0.2)]", label: "Cancelado" },
};

export const ClientAppointmentsList: React.FC<ClientAppointmentsListProps> = ({
  appointments,
  onConfirm,
  onCancel,
  onClick,
  isConfirming = false,
  lastShopInfo,
}) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-cyan-500 text-lg" />
          <span className="font-semibold text-base">Próximos Agendamentos</span>
        </div>
      }
      extra={
        <Link href="/client/appointments">
          <Button type="link" size="small" className="font-medium">
            Ver Todos
          </Button>
        </Link>
      }
      className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl h-full bg-white dark:bg-zinc-900"
    >
      {appointments.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className="text-zinc-500 dark:text-zinc-400">
              Nenhum agendamento futuro
            </span>
          }
          className="my-8"
        >
          {lastShopInfo ? (
            <Link href={`/shop/${lastShopInfo.slug}/booking`}>
              <Button type="primary" icon={<RedoOutlined />}>
                Reagendar Novamente
              </Button>
            </Link>
          ) : (
            <div className="max-w-xs mx-auto text-xs text-zinc-400 text-center italic mt-2">
              Você ainda não possui agendamentos ativos. Solicite o link de agendamento ao seu estabelecimento de confiança.
            </div>
          )}
        </Empty>
      ) : (
        <div className="space-y-3">
          {appointments.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 hover:border-cyan-200 dark:hover:border-cyan-800 transition-colors cursor-pointer"
              onClick={() => onClick?.(item.id)}
            >
              <div className="flex flex-col items-center justify-center w-14 h-14 bg-white dark:bg-zinc-800 rounded-xl shrink-0 border border-zinc-200 dark:border-zinc-700 group-hover:border-cyan-300 dark:group-hover:border-cyan-700 transition-colors">
                <span className="text-lg font-bold text-zinc-700 dark:text-zinc-200 leading-none">
                  {item.date.split("/")[0]}
                </span>
                <span className="text-[10px] uppercase text-zinc-400 dark:text-zinc-500 font-medium leading-tight mt-0.5">
                  {dayjs(item.date.split("/").reverse().join("-")).format("MMM")}
                </span>
              </div>

              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <Text strong className="text-sm truncate block text-zinc-700 dark:text-zinc-200">
                    {item.shop}
                  </Text>
                  <Tag
                    className={`m-0 rounded-full !text-[10px] font-bold uppercase tracking-wide border ${statusConfig[item.status]?.className || statusConfig.PENDING.className}`}
                  >
                    {statusConfig[item.status]?.label || item.status}
                  </Tag>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                  <ClockCircleOutlined className="text-cyan-500" />
                  <span className="font-medium">{item.time}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  <span className="truncate">{item.service}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                    <CarOutlined />
                    <span className="truncate max-w-[180px]">{item.vehicle}</span>
                  </div>

                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.status === "PENDING" && (
                      <Tooltip title="Confirmar presença">
                        <Button
                          type="primary"
                          size="small"
                          className="!bg-emerald-600 hover:!bg-emerald-500 !border-emerald-600 !shadow-none !text-xs"
                          icon={<CheckCircleOutlined />}
                          onClick={() => onConfirm?.(item.id)}
                          loading={isConfirming}
                        >
                          Confirmar
                        </Button>
                      </Tooltip>
                    )}
                    {item.status !== "COMPLETED" && item.status !== "CANCELED" && (
                      <Tooltip title="Cancelar agendamento">
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<CloseCircleOutlined />}
                          onClick={() => onCancel?.(item.id)}
                          className="!shadow-none !text-xs"
                        >
                          Cancelar
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
