"use client";

import React from "react";
import { Card, Avatar, Typography, Tag, Tooltip } from "antd";
import {
  PhoneOutlined, 
  MailOutlined, 
  CarOutlined,
  CalendarOutlined,
  StarFilled,
  RightOutlined
} from "@ant-design/icons";
import { ShopClient } from "@/types/shopClient";
import dayjs from "dayjs";

const { Text } = Typography;

interface ClientCardProps {
  client: ShopClient;
  onClick: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => {
  const user = client.user;
  if (!user) return null;

  // Prioritize overrides
  const fullName = client.customName || `${user.firstName} ${user.lastName || ""}`.trim();
  const email = client.customEmail || user.email;
  const phone = client.customPhone || user.phone;

  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map(n => n[0])
    .join("")
    .toUpperCase();
  
  // Estatísticas do cliente
  const vehicleCount = user.vehicles?.length || 0;
  const appointmentCount = user.appointments?.length || 0;
  const evaluationCount = user.evaluations?.length || 0;
  
  // Média de avaliações
  const avgRating = evaluationCount > 0
    ? (user.evaluations!.reduce((acc, e) => acc + e.rating, 0) / evaluationCount).toFixed(1)
    : null;

  // Último agendamento
  const lastAppointment = user.appointments?.[0];

  // Gerar cor baseada no nome
  const getAvatarColor = (name: string) => {
    const colors = [
      "#f56a00", "#7265e6", "#ffbf00", "#00a2ae", 
      "#f5222d", "#52c41a", "#1890ff", "#eb2f96"
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Card
      className="group cursor-pointer rounded-2xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-lg transition-all duration-300"
      styles={{ body: { padding: 0 } }}
      onClick={onClick}
    >
      {/* Header com Avatar e Info */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar 
              size={56} 
              src={user.picture}
              style={{ backgroundColor: !user.picture ? getAvatarColor(fullName) : undefined }}
              className="ring-2 ring-zinc-100 dark:ring-zinc-800"
            >
              {!user.picture && initials}
            </Avatar>
            <div className="min-w-0 flex-1">
              <Text strong className="text-lg block truncate dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {fullName}
              </Text>
              {email && (
                <div className="flex items-center gap-1 text-zinc-500 text-sm truncate">
                  <MailOutlined className="flex-shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
              )}
            </div>
          </div>
          <RightOutlined className="text-zinc-300 group-hover:text-cyan-500 transition-colors" />
        </div>

        {/* Contato */}
        {phone && (
          <div className="flex items-center gap-2 mt-3 text-zinc-600 dark:text-zinc-400">
            <PhoneOutlined />
            <Text className="dark:text-zinc-400">{phone}</Text>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 border-t border-zinc-100 dark:border-zinc-800">
        <Tooltip title="Veículos cadastrados">
          <div className="p-3 text-center border-r border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CarOutlined />
              <Text strong className="text-emerald-600 dark:text-emerald-400">{vehicleCount}</Text>
            </div>
            <div className="text-[10px] text-zinc-400 uppercase font-medium">Veículos</div>
          </div>
        </Tooltip>
        
        <Tooltip title="Agendamentos realizados">
          <div className="p-3 text-center border-r border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400">
              <CalendarOutlined />
              <Text strong className="text-blue-600 dark:text-blue-400">{appointmentCount}</Text>
            </div>
            <div className="text-[10px] text-zinc-400 uppercase font-medium">Visitas</div>
          </div>
        </Tooltip>
        
        <Tooltip title={avgRating ? `Média das avaliações: ${avgRating}` : "Sem avaliações"}>
          <div className="p-3 text-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <div className="flex items-center justify-center gap-1 text-amber-500">
              <StarFilled />
              <Text strong className="text-amber-500">{avgRating || "-"}</Text>
            </div>
            <div className="text-[10px] text-zinc-400 uppercase font-medium">Avaliação</div>
          </div>
        </Tooltip>
      </div>

      {/* Último agendamento */}
      {lastAppointment && (
        <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <CalendarOutlined />
              <span>Último: {dayjs(lastAppointment.scheduledAt).format("DD/MM/YYYY")}</span>
            </div>
            <Tag 
              color={
                lastAppointment.status === "COMPLETED" ? "success" :
                lastAppointment.status === "CANCELED" ? "error" :
                "processing"
              }
              className="m-0 text-[10px]"
            >
              {lastAppointment.status === "COMPLETED" ? "Concluído" :
               lastAppointment.status === "CANCELED" ? "Cancelado" :
               lastAppointment.status === "PENDING" ? "Pendente" :
               lastAppointment.status}
            </Tag>
          </div>
        </div>
      )}
    </Card>
  );
};
