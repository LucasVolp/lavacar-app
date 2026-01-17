"use client";

import React from "react";
import { Card, Button, Badge, Empty, Typography, Tag } from "antd";
import { CalendarOutlined, RightOutlined, CarOutlined } from "@ant-design/icons";
import { Appointment } from "@/types/appointment";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const { Text } = Typography;

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  shopId: string;
}

export const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  appointments,
  shopId,
}) => {
  const router = useRouter();

  const statusColors: Record<string, string> = {
    PENDING: "orange",
    CONFIRMED: "blue",
    WAITING: "cyan",
    IN_PROGRESS: "purple",
    COMPLETED: "green",
    CANCELED: "red",
    NO_SHOW: "default",
  };

  const statusLabels: Record<string, string> = {
    PENDING: "Pendente",
    CONFIRMED: "Confirmado",
    WAITING: "Aguardando",
    IN_PROGRESS: "Em Andamento",
    COMPLETED: "Concluído",
    CANCELED: "Cancelado",
    NO_SHOW: "Não Compareceu",
  };

  return (
    <Card
      bordered={false}
      title={
        <div className="flex items-center gap-3 py-2">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
            <CalendarOutlined />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg dark:text-white">Próximos Agendamentos</span>
            <span className="text-xs text-zinc-500 font-normal">Agenda do dia de hoje</span>
          </div>
          <Badge count={appointments.length} className="ml-2 bg-indigo-500" />
        </div>
      }
      extra={
        <Button
          type="text"
          className="text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 font-medium"
          onClick={() => router.push(`/admin/shop/${shopId}/appointments`)}
        >
          Ver Todos <RightOutlined />
        </Button>
      }
      className="h-full rounded-2xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden shadow-sm"
      bodyStyle={{ padding: '0 24px 24px 24px' }}
    >
      {appointments.length === 0 ? (
        <Empty
          description={<span className="text-zinc-500">Nenhum agendamento pendente para hoje</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="my-10"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all cursor-pointer"
              onClick={() => router.push(`/admin/shop/${shopId}/appointments/${appointment.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 min-w-[60px] border border-zinc-200 dark:border-zinc-700 shadow-sm">
                  <Text strong className="text-indigo-600 dark:text-indigo-400 text-lg leading-none">
                    {dayjs(appointment.scheduledAt).format("HH:mm")}
                  </Text>
                  <Text type="secondary" className="text-xs">
                    {dayjs(appointment.endTime).format("HH:mm")}
                  </Text>
                </div>
                
                <div className="flex flex-col">
                  <Text strong className="text-zinc-800 dark:text-zinc-100 text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {appointment.services.map((s) => s.serviceName).join(", ")}
                  </Text>
                  <div className="flex items-center gap-3 text-zinc-500 text-sm mt-1">
                    <span className="flex items-center gap-1"><CarOutlined /> Veículo</span>
                    <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                    <span>{appointment.totalDuration} min</span>
                    <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      R$ {parseFloat(appointment.totalPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 sm:mt-0 flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <Tag color={statusColors[appointment.status]} className="m-0 px-3 py-1 rounded-full border-0 font-medium">
                  {statusLabels[appointment.status]}
                </Tag>
                <RightOutlined className="text-zinc-300 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
