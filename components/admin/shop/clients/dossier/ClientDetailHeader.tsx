"use client";

import React from "react";
import { Avatar, Button, Tag, Typography } from "antd";
import { ArrowLeftOutlined, UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, EditOutlined } from "@ant-design/icons";
import { getApiImageUrl } from "@/utils/image";
import { formatPhone } from "@/utils/formatters";

const { Text } = Typography;

interface ClientDetailHeaderProps {
  fullName: string;
  picture?: string;
  email?: string;
  phone?: string;
  memberSince?: string;
  totalAppointments: number;
  onBack: () => void;
  onEdit?: () => void;
}

export const ClientDetailHeader: React.FC<ClientDetailHeaderProps> = ({
  fullName,
  picture,
  email,
  phone,
  memberSince,
  totalAppointments,
  onBack,
  onEdit,
}) => {
  const avatarUrl = getApiImageUrl(picture);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className="!rounded-xl !min-h-[44px] !px-4 !font-medium self-start"
        >
          Voltar
        </Button>

        <div className="flex items-center gap-5 flex-1">
          <div className="relative">
            <Avatar
              size={72}
              src={avatarUrl || undefined}
              icon={!avatarUrl ? <UserOutlined /> : undefined}
              className="!border-3 !border-indigo-100 dark:!border-indigo-900/50 shadow-lg"
              style={{ backgroundColor: avatarUrl ? undefined : "#6366f1" }}
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 m-0 line-clamp-2">
                {fullName}
              </h2>
              {onEdit && (
                <Button
                  icon={<EditOutlined />}
                  onClick={onEdit}
                  className="!rounded-lg shrink-0 min-h-[44px] w-11"
                />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              {phone && (
                <Text className="!text-zinc-500 dark:!text-zinc-400 text-sm flex items-center gap-1.5">
                  <PhoneOutlined className="text-indigo-500" /> {formatPhone(phone)}
                </Text>
              )}
              {email && (
                <Text className="!text-zinc-500 dark:!text-zinc-400 text-sm flex items-center gap-1.5">
                  <MailOutlined className="text-indigo-500" /> {email}
                </Text>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {memberSince && (
                <Tag
                  icon={<CalendarOutlined />}
                  className="!bg-indigo-50 dark:!bg-indigo-900/20 !border-indigo-200 dark:!border-indigo-800 !text-indigo-700 dark:!text-indigo-300 !rounded-full !px-3"
                >
                  Cliente desde {memberSince}
                </Tag>
              )}
              <Tag className="!bg-indigo-50 dark:!bg-indigo-900/20 !border-indigo-200 dark:!border-indigo-800 !text-indigo-700 dark:!text-indigo-300 !rounded-full !px-3">
                {totalAppointments} atendimento{totalAppointments !== 1 ? "s" : ""}
              </Tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
