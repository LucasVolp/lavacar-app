"use client";

import React from "react";
import { Card, Empty, Image, Pagination, Typography } from "antd";
import {
  CarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ToolOutlined,
  CameraOutlined,
  RightOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { StatusBadge } from "@/components/ui";
import { getApiImageUrl } from "@/utils/image";
import type { Appointment } from "@/types/appointment";
import type { Checklist } from "@/types/checklist";

const { Text } = Typography;

interface ClientTimelineTabProps {
  appointments: Appointment[];
  checklistByAppointmentId: Record<string, Checklist | null>;
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onAppointmentClick?: (appointmentId: string) => void;
}

export const ClientTimelineTab: React.FC<ClientTimelineTabProps> = ({
  appointments,
  checklistByAppointmentId,
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onAppointmentClick,
}) => {
  if (appointments.length === 0) {
    return (
      <Card className="!rounded-2xl !shadow-sm">
        <Empty description="Sem histórico de atendimentos" />
      </Card>
    );
  }

  const paginationEl = totalItems > pageSize ? (
    <div className="flex justify-center space-y-4">
      <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={onPageChange}
        showSizeChanger
        pageSizeOptions={["5", "10", "20"]}
        size="small"
        showTotal={(total, range) => `${range[0]}-${range[1]} de ${total}`}
      />
    </div>
  ) : null;

  return (
    <div className="space-y-4">
      {paginationEl}

      {appointments.map((appointment, index) => {
        const checklist = checklistByAppointmentId[appointment.id];
        const services = appointment.services.map((s) => s.serviceName).join(", ");
        const isFirst = index === 0 && currentPage === 1;

        return (
          <div className="space-y-4" key={appointment.id}>
            <Card
              key={appointment.id}
              className={`!rounded-2xl !shadow-sm hover:!shadow-md transition-all !overflow-hidden ${
                isFirst ? "!border-l-4 !border-l-indigo-500" : ""
              } ${onAppointmentClick ? "cursor-pointer" : ""}`}
              onClick={() => onAppointmentClick?.(appointment.id)}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Date indicator */}
                <div className="sm:w-20 flex sm:flex-col items-center sm:items-center gap-2 sm:gap-0 sm:pt-1 shrink-0">
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 leading-none">
                      {dayjs(appointment.scheduledAt).format("DD")}
                    </div>
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
                      {dayjs(appointment.scheduledAt).format("MMM YYYY")}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={appointment.status} />
                    <Text className="text-xs text-zinc-400 dark:text-zinc-500">
                      {dayjs(appointment.scheduledAt).format("HH:mm")}
                    </Text>
                    {onAppointmentClick && (
                      <RightOutlined className="ml-auto text-zinc-300 dark:text-zinc-600 text-xs" />
                    )}
                  </div>

                  {/* Services */}
                  <div className="flex items-start gap-2">
                    <ToolOutlined className="text-zinc-400 mt-0.5 shrink-0" />
                    <Text className="text-sm dark:text-zinc-300">
                      {services || "Serviços não informados"}
                    </Text>
                  </div>

                  {/* Info row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <DollarOutlined className="text-emerald-500" />
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        R$ {parseFloat(appointment.totalPrice).toFixed(2)}
                      </span>
                    </span>
                    {appointment.vehicle && (
                      <span className="flex items-center gap-1">
                        <CarOutlined />
                        {appointment.vehicle.model}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <ClockCircleOutlined />
                      {appointment.totalDuration}min
                    </span>
                  </div>

                  {/* Checklist Photos */}
                  {checklist?.photos?.length ? (
                    <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <CameraOutlined className="text-zinc-400 text-xs" />
                        <Text className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                          Fotos da vistoria ({checklist.photos.length})
                        </Text>
                      </div>
                      <Image.PreviewGroup>
                        <div className="flex gap-2 flex-wrap">
                          {checklist.photos.slice(0, 6).map((photo, photoIdx) => (
                            <Image
                              key={`${appointment.id}-photo-${photoIdx}`}
                              src={getApiImageUrl(photo)}
                              alt={`Foto da vistoria ${photoIdx + 1}`}
                              width={80}
                              height={80}
                              className="!rounded-lg !object-cover border border-zinc-200 dark:border-zinc-700"
                              style={{ objectFit: "cover" }}
                            />
                          ))}
                          {checklist.photos.length > 6 && (
                            <div className="w-20 h-20 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                              <Text className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                +{checklist.photos.length - 6}
                              </Text>
                            </div>
                          )}
                        </div>
                      </Image.PreviewGroup>
                    </div>
                  ) : null}
                </div>
              </div>
            </Card>
          </div>

        );
      })}

      {paginationEl}
    </div>
  );
};
