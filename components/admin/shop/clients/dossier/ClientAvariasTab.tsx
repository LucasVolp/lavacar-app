"use client";

import React from "react";
import { Card, Empty, Image, Pagination, Typography } from "antd";
import { CameraOutlined, CarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getApiImageUrl } from "@/utils/image";
import type { Appointment } from "@/types/appointment";

const { Text } = Typography;

interface VistoriaGalleryItem {
  key: string;
  photo: string;
  appointment: Appointment;
}

interface ClientVistoriasTabProps {
  items: VistoriaGalleryItem[];
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
}

export const ClientVistoriasTab: React.FC<ClientVistoriasTabProps> = ({
  items,
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  if (items.length === 0) {
    return (
      <Card className="!rounded-2xl !shadow-sm">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Sem registros de vistorias"
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <CameraOutlined className="text-indigo-500" />
        <Text className="text-sm font-medium dark:text-zinc-300">
          {totalItems} foto{totalItems !== 1 ? "s" : ""} de vistoria{totalItems !== 1 ? "s" : ""}
        </Text>
      </div>

      <Image.PreviewGroup>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card
              key={item.key}
              className="!rounded-2xl !shadow-sm hover:!shadow-md transition-all !overflow-hidden !p-0"
              cover={
                <Image
                  src={getApiImageUrl(item.photo)}
                  alt="Vistoria registrada"
                  className="!h-48 !object-cover"
                  style={{ objectFit: "cover", height: 192 }}
                />
              }
            >
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <ClockCircleOutlined />
                  {dayjs(item.appointment.scheduledAt).format("DD/MM/YYYY")}
                </span>
                <span className="flex items-center gap-1.5">
                  <CarOutlined />
                  {item.appointment.vehicle?.model || "Veículo"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Image.PreviewGroup>

      {totalItems > pageSize && (
        <div className="flex justify-center pt-2">
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={pageSize}
            onChange={onPageChange}
            showTotal={(total, range) => `${range[0]}-${range[1]} de ${total}`}
          />
        </div>
      )}
    </div>
  );
};
