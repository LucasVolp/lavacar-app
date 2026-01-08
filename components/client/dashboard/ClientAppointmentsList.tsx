"use client";

import React from "react";
import { Typography, Card, List, Tag, Button, Empty } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CarOutlined,
  PlusOutlined,
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
}

const statusConfig: Record<string, { color: string; label: string }> = {
  PENDING: { color: "gold", label: "Pendente" },
  CONFIRMED: { color: "blue", label: "Confirmado" },
  COMPLETED: { color: "green", label: "Concluído" },
  CANCELED: { color: "red", label: "Cancelado" },
};

export const ClientAppointmentsList: React.FC<ClientAppointmentsListProps> = ({
  appointments,
}) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-indigo-500 text-lg" />
          <span className="font-semibold text-lg">Próximos Agendamentos</span>
        </div>
      }
      extra={
        <Link href="/client/appointments">
          <Button type="text" size="small" className="text-slate-500 hover:text-indigo-500 font-medium">
            Ver Todos
          </Button>
        </Link>
      }
      className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden h-full"
    >
      {appointments.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Nenhum agendamento futuro"
          className="my-8"
        >
          <Link href="/">
            <Button type="primary" className="bg-indigo-500 hover:bg-indigo-600 border-0 shadow-lg shadow-indigo-500/20">
                Agendar Agora
            </Button>
          </Link>
        </Empty>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={appointments}
          renderItem={(item) => (
            <div className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors px-2 -mx-2 rounded-lg">
              <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
                 <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {item.date.split('/')[0]}
                 </span>
                 <span className="text-xs uppercase text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400">
                    {dayjs(item.date.split('/').reverse().join('-')).format('MMM')}
                 </span>
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-1">
                   <Text strong className="text-lg truncate block text-slate-700 dark:text-slate-200">
                     {item.shop}
                   </Text>
                   <Tag color={statusConfig[item.status]?.color || 'default'} className="m-0 rounded-full px-2 text-[10px] font-bold uppercase tracking-wide border-0">
                      {statusConfig[item.status]?.label || item.status}
                   </Tag>
                </div>
                
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <ClockCircleOutlined className="text-indigo-400" />
                    <span className="font-medium">{item.time}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="truncate">{item.service}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CarOutlined />
                    <span className="truncate max-w-[200px]">{item.vehicle}</span>
                </div>
              </div>
            </div>
          )}
        />
      )}
    </Card>
  );
};
