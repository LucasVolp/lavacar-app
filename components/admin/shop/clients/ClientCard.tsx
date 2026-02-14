"use client";

import React from "react";
import { Card, Avatar, Typography, Button } from "antd";
import {
  PhoneOutlined, 
  MailOutlined, 
  CarOutlined,
  CalendarOutlined,
  StarFilled,
  EditOutlined,
  WhatsAppOutlined
} from "@ant-design/icons";
import { ShopClient } from "@/types/shopClient";
import { formatPhone } from "@/utils/formatters";
import { CustomTooltip, StatusBadge } from "@/components/ui";
import dayjs from "dayjs";

import { getApiImageUrl } from "@/utils/image";

const { Text } = Typography;

interface ClientCardProps {
  client: ShopClient;
  onClick: () => void;
  onEdit: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onClick, onEdit }) => {
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

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = phone?.replace(/\D/g, "");
    if (cleanPhone) {
      window.open(`https://wa.me/55${cleanPhone}`, "_blank");
    }
  };

  return (
    <Card
      className="group cursor-pointer rounded-2xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-300"
      styles={{ body: { padding: 0 } }}
      onClick={onClick}
    >
      {/* Header com Avatar e Info */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar 
              size={56} 
              src={user.picture ? getApiImageUrl(user.picture) : undefined}
              style={{ backgroundColor: !user.picture ? getAvatarColor(fullName) : undefined }}
              className="ring-2 ring-zinc-100 dark:ring-zinc-800"
            >
              {!user.picture && initials}
            </Avatar>
            <div className="min-w-0 flex-1">
              <Text strong className="text-lg block truncate dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
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
          <div className="flex gap-2">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            />
          </div>
        </div>

        {/* Contato */}
        {phone && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <PhoneOutlined className="text-lg" />
              <Text className="dark:text-zinc-400 font-medium">{formatPhone(phone)}</Text>
            </div>
            <Button
              type="primary"
              icon={<WhatsAppOutlined className="text-xl" />}
              onClick={handleWhatsApp}
              className="bg-green-600 hover:!bg-green-500 border-green-600 flex items-center justify-center gap-2 h-10 px-4 rounded-lg shadow-sm"
            >
              WhatsApp
            </Button>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
        <CustomTooltip title="Veículos cadastrados">
          <div className="py-4 px-3 text-center border-r border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center justify-center gap-1.5">
              <CarOutlined className="text-emerald-600 dark:text-emerald-400 text-lg" />
              <Text strong className="text-lg text-emerald-600 dark:text-emerald-400">{vehicleCount}</Text>
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">Veículos</div>
          </div>
        </CustomTooltip>

        <CustomTooltip title="Agendamentos realizados">
          <div className="py-4 px-3 text-center border-r border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center justify-center gap-1.5">
              <CalendarOutlined className="text-blue-600 dark:text-blue-400 text-lg" />
              <Text strong className="text-lg text-blue-600 dark:text-blue-400">{appointmentCount}</Text>
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">Visitas</div>
          </div>
        </CustomTooltip>

        <CustomTooltip title={avgRating ? `Média das avaliações: ${avgRating}` : "Sem avaliações"}>
          <div className="py-4 px-3 text-center hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center justify-center gap-1.5">
              <StarFilled className="text-amber-500 text-lg" />
              <Text strong className="text-lg text-amber-500">{avgRating || "-"}</Text>
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">Avaliação</div>
          </div>
        </CustomTooltip>
      </div>

      {/* Último agendamento */}
      {lastAppointment && (
        <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <CalendarOutlined />
              <span>Último: {dayjs(lastAppointment.scheduledAt).format("DD/MM/YYYY")}</span>
            </div>
            <StatusBadge status={lastAppointment.status} className="text-[10px] px-2 py-0.5 rounded-full" />
          </div>
        </div>
      )}
    </Card>
  );
};
