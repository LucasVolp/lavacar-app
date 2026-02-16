"use client";

import React from "react";
import { Button, Typography, Tooltip } from "antd";
import {
  ShopOutlined,
  CarOutlined,
  CheckOutlined,
  CloseOutlined,
  RightOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import "dayjs/locale/pt-br";
import { StatusBadge } from "@/components/ui/StatusBadge";

dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.locale("pt-br");

const { Text } = Typography;

interface AppointmentCardProps {
  id: string;
  shopName: string;
  services: { name: string; price: string }[];
  vehicleInfo: string;
  scheduledAt: string;
  endTime?: string;
  totalPrice: string;
  totalDuration: number;
  status: string;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
  onClick?: (id: string) => void;
  isConfirming?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  id,
  shopName,
  services,
  vehicleInfo,
  scheduledAt,
  totalPrice,
  totalDuration,
  status,
  onConfirm,
  onCancel,
  onClick,
  isConfirming = false,
}) => {
  const date = dayjs(scheduledAt);
  const isPending = status === "PENDING";

  // Check if today/tomorrow
  const dateLabel = date.isToday()
    ? "Hoje"
    : date.isTomorrow()
      ? "Amanhã"
      : date.format("DD/MM");

  const serviceName = services.map((s) => s.name).join(", ");

  return (
    <div
      className="group flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer"
      onClick={() => onClick?.(id)}
    >
      {/* Time Block - Compact */}
      <div className="flex flex-col items-center justify-center bg-white dark:bg-zinc-900 rounded-lg px-2.5 py-1.5 min-w-[52px] border border-zinc-200 dark:border-zinc-700">
        <Text className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide leading-none">
          {dateLabel}
        </Text>
        <Text strong className="text-indigo-600 dark:text-indigo-400 text-base leading-tight font-mono">
          {date.format("HH:mm")}
        </Text>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Text
            strong
            className="text-zinc-900 dark:text-zinc-100 text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
          >
            {serviceName}
          </Text>
          <StatusBadge status={status} className="hidden sm:flex" />
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          <ShopOutlined className="text-[10px]" />
          <span className="truncate max-w-[100px]">{shopName}</span>
          <span className="text-zinc-300 dark:text-zinc-600">•</span>
          <CarOutlined className="text-[10px]" />
          <span className="truncate max-w-[80px]">{vehicleInfo}</span>
        </div>
      </div>

      {/* Right: Price + Duration + Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="hidden md:flex flex-col items-end text-right">
          <Text className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
            R$ {parseFloat(totalPrice).toFixed(2)}
          </Text>
          <Text className="text-[10px] text-zinc-400 flex items-center gap-1">
            <ClockCircleOutlined /> {totalDuration}min
          </Text>
        </div>

        {isPending ? (
          <div className="flex items-center gap-1">
            <Tooltip title="Confirmar presença">
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm?.(id);
                }}
                loading={isConfirming}
                className="bg-emerald-600 hover:bg-emerald-500 border-none h-7 w-7 rounded-lg p-0 flex items-center justify-center"
              />
            </Tooltip>
            <Tooltip title="Cancelar">
              <Button
                size="small"
                icon={<CloseOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel?.(id);
                }}
                className="h-7 w-7 rounded-lg p-0 flex items-center justify-center bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-red-400 hover:text-red-500"
              />
            </Tooltip>
          </div>
        ) : (
          <RightOutlined className="text-zinc-300 dark:text-zinc-600 group-hover:text-indigo-400 transition-colors text-xs" />
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
