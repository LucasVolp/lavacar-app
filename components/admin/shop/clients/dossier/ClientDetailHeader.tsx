"use client";

import React from "react";
import { Avatar, Button, Tag, Typography } from "antd";
import { ArrowLeftOutlined, UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, EditOutlined } from "@ant-design/icons";
import { getApiImageUrl } from "@/utils/image";
import { formatPhone } from "@/utils/formatters";

const { Title, Text } = Typography;

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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 sm:p-8">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGwtb3BhY2l0eT0iLjA1IiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==')] opacity-30" />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className="!absolute top-0 right-0 sm:!relative sm:!mr-auto !bg-white/20 !border-white/30 !text-white hover:!bg-white/30 hover:!border-white/50 hover:!text-white !rounded-xl !h-9 !px-4 !font-medium !shadow-sm !backdrop-blur-sm"
          size="small"
        >
          Voltar
        </Button>

        <div className="flex items-center gap-5 flex-1">
          <div className="relative">
            <Avatar
              size={80}
              src={avatarUrl || undefined}
              icon={!avatarUrl ? <UserOutlined /> : undefined}
              className="!border-4 !border-white/30 shadow-xl"
              style={{ backgroundColor: avatarUrl ? undefined : "rgba(255,255,255,0.2)" }}
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-sm" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Title level={3} className="!m-0 !text-white truncate" style={{ color: "white" }}>
                {fullName}
              </Title>
              {onEdit && (
                <Button
                  icon={<EditOutlined />}
                  onClick={onEdit}
                  size="small"
                  className="!bg-white/20 !border-white/30 !text-white hover:!bg-white/30 hover:!border-white/50 !rounded-lg shrink-0"
                />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              {phone && (
                <Text className="!text-white/80 text-sm flex items-center gap-1.5">
                  <PhoneOutlined /> {formatPhone(phone)}
                </Text>
              )}
              {email && (
                <Text className="!text-white/80 text-sm flex items-center gap-1.5">
                  <MailOutlined /> {email}
                </Text>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {memberSince && (
                <Tag
                  icon={<CalendarOutlined />}
                  className="!bg-white/15 !border-white/25 !text-white !rounded-full !px-3"
                >
                  Cliente desde {memberSince}
                </Tag>
              )}
              <Tag className="!bg-white/15 !border-white/25 !text-white !rounded-full !px-3">
                {totalAppointments} atendimento{totalAppointments !== 1 ? "s" : ""}
              </Tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
