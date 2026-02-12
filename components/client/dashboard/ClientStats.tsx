"use client";

import React from "react";
import { Card, Tooltip } from "antd";
import {
  CarOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";

interface ClientStatsProps {
  vehiclesCount: number;
  upcomingAppointments: number;
  totalVisits: number;
  averageRating: number;
  totalEvaluations: number;
}

const stats = (props: ClientStatsProps) => [
  {
    label: "Meus Veículos",
    value: props.vehiclesCount,
    icon: <CarOutlined />,
    color: "text-cyan-500",
    bg: "bg-cyan-50 dark:bg-cyan-500/10",
    tooltip: "Veículos cadastrados na sua conta",
  },
  {
    label: "Agendamentos Pendentes",
    value: props.upcomingAppointments,
    icon: <CalendarOutlined />,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    tooltip: "Agendamentos aguardando atendimento",
  },
  {
    label: "Visitas Concluídas",
    value: props.totalVisits,
    icon: <CheckCircleOutlined />,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    tooltip: "Total de serviços finalizados",
  },
  {
    label: "Avaliação Média",
    value: props.totalEvaluations > 0 ? props.averageRating.toFixed(1) : "—",
    icon: <StarOutlined />,
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-500/10",
    tooltip:
      props.totalEvaluations > 0
        ? `Baseado em ${props.totalEvaluations} avaliação(ões)`
        : "Nenhuma avaliação realizada ainda",
  },
];

export const ClientStats: React.FC<ClientStatsProps> = (props) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats(props).map((stat) => (
        <Tooltip key={stat.label} title={stat.tooltip}>
          <Card
            className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl hover:shadow-md transition-shadow bg-white dark:bg-zinc-900"
            styles={{ body: { padding: "20px" } }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}
              >
                <span className={`${stat.color} text-lg`}>{stat.icon}</span>
              </div>
              <div className="min-w-0">
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {stat.label}
                </div>
              </div>
            </div>
          </Card>
        </Tooltip>
      ))}
    </div>
  );
};

export default ClientStats;
