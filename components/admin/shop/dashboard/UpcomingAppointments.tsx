"use client";

import React, { useState } from "react";
import { Card, Button, Empty, Typography, Pagination, Spin, Avatar } from "antd";
import {
  CalendarOutlined,
  RightOutlined,
  CarOutlined,
  UserOutlined,
  PhoneOutlined,
  FileAddOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { Appointment } from "@/types/appointment";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useGetChecklist } from "@/hooks/useChecklist";
import { ChecklistModal } from "@/components/modals/ChecklistModal";
import { StatusBadge } from "@/components/ui";
import { formatVehiclePlate } from "@/utils/vehiclePlate";
import { maskPhone } from "@/lib/masks";

const { Text } = Typography;

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  shopId: string;
  clientPictureByUserId?: Record<string, string>;
}

interface AppointmentChecklistActionProps {
  appointmentId: string;
}

const AppointmentChecklistAction: React.FC<AppointmentChecklistActionProps> = ({
  appointmentId,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: checklist, isLoading } = useGetChecklist(appointmentId);

  if (isLoading) {
    return <Spin size="small" />;
  }

  const hasChecklist = !!checklist;

  return (
    <>
      <Button
        size="middle"
        icon={hasChecklist ? <FileImageOutlined /> : <FileAddOutlined />}
        onClick={(event) => {
          event.stopPropagation();
          setModalOpen(true);
        }}
        className={`h-9 px-4 font-medium rounded-lg ${ 
          hasChecklist
            ? "border-zinc-300 dark:border-zinc-700 dark:text-zinc-200"
            : "border-indigo-300 text-indigo-600 dark:border-indigo-500/40 dark:text-indigo-300"
        }`}
      >
        {hasChecklist ? "Ver Vistoria" : "Adicionar Vistoria"}
      </Button>

      <ChecklistModal
        appointmentId={appointmentId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        readOnly={hasChecklist}
      />
    </>
  );
};

export const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  appointments,
  shopId,
  clientPictureByUserId = {},
}) => {
  const router = useRouter();
  const { organizationId } = useShopAdmin();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentAppointments = appointments.slice(startIndex, endIndex);

  return (
    <Card
      variant="outlined"
      title={
        <div className="flex items-center gap-3 py-2">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
            <CalendarOutlined />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg dark:text-white">Próximos Agendamentos</span>
            <span className="text-xs text-zinc-500 font-normal">Agendamentos futuros</span>
          </div>
          <div className="ml-2 inline-flex items-center gap-2 rounded-xl border border-indigo-200/80 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 uppercase tracking-wide">Total</span>
            <span className="text-lg leading-none font-black text-indigo-700 dark:text-indigo-200">
              {appointments.length}
            </span>
          </div>
        </div>
      }
      extra={
        <Button
          type="text"
          className="text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 font-medium"
          onClick={() => router.push(`/organization/${organizationId}/shop/${shopId}/appointments`)}
        >
          Ver Todos <RightOutlined />
        </Button>
      }
      className="h-full rounded-2xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden shadow-sm"
      styles={{ body: { padding: '16px 24px 24px 24px' } }}
    >
      {appointments.length === 0 ? (
        <Empty
          description={<span className="text-zinc-500">Nenhum agendamento futuro</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="my-10"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {currentAppointments.map((appointment) => {
            const isToday = dayjs(appointment.scheduledAt).isSame(dayjs(), 'day');
            
            return (
              <div
                key={appointment.id}
                className="group flex flex-col p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all cursor-pointer"
                onClick={() => router.push(`/organization/${organizationId}/shop/${shopId}/appointments/${appointment.id}`)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 min-w-[60px] border border-zinc-200 dark:border-zinc-700 shadow-sm">
                      {!isToday && (
                        <Text className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                          {dayjs(appointment.scheduledAt).format("DD/MM")}
                        </Text>
                      )}
                      <Text strong className="text-indigo-600 dark:text-indigo-400 text-lg leading-none">
                        {dayjs(appointment.scheduledAt).format("HH:mm")}
                      </Text>
                      <Text type="secondary" className="text-xs">
                        {dayjs(appointment.endTime).format("HH:mm")}
                      </Text>
                    </div>
                    <div>
                      <Text strong className="text-zinc-800 dark:text-zinc-100 text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors block">
                        {appointment.services.map((s) => s.serviceName).join(", ")}
                      </Text>
                      <div className="flex items-center gap-2 text-zinc-500 text-sm mt-0.5">
                        <span>{appointment.totalDuration} min</span>
                        <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          R$ {parseFloat(appointment.totalPrice).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={appointment.status} className="px-3 py-1 rounded-full font-medium" />
                    <RightOutlined className="text-zinc-300 group-hover:text-indigo-400 transition-colors hidden sm:block" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        router.push(`/organization/${organizationId}/shop/${shopId}/clients`);
                      }}
                      className="flex items-center gap-2 min-w-0 flex-1 text-left p-0 bg-transparent border-0 cursor-pointer"
                    >
                      <Avatar
                        size={32}
                        src={appointment.user?.picture || clientPictureByUserId[appointment.userId] || undefined}
                        icon={!appointment.user?.picture ? <UserOutlined className="text-indigo-600 dark:text-indigo-400 text-sm" /> : undefined}
                        className="bg-indigo-100 dark:bg-indigo-900/30 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <Text className="text-zinc-700 dark:text-zinc-200 font-medium block truncate hover:text-indigo-600 dark:hover:text-indigo-400">
                          {appointment.user?.firstName} {appointment.user?.lastName || ''}
                        </Text>
                        {appointment.user?.phone && (
                          <Text type="secondary" className="text-xs flex items-center gap-1">
                            <PhoneOutlined /> {maskPhone(appointment.user.phone)}
                          </Text>
                        )}
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                      <CarOutlined className="text-emerald-600 dark:text-emerald-400 text-sm" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Text className="text-zinc-700 dark:text-zinc-200 font-medium block truncate">
                        {appointment.vehicle?.brand} {appointment.vehicle?.model}
                      </Text>
                      <Text type="secondary" className="text-xs uppercase tracking-wide">
                        {formatVehiclePlate(appointment.vehicle?.plate)}
                      </Text>
                    </div>
                  </div>
                </div>

                <div
                  className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700 flex justify-end"
                  onClick={(event) => event.stopPropagation()}
                >
                  <AppointmentChecklistAction appointmentId={appointment.id} />
                </div>
              </div>
            );
          })}
          
          <div className="flex justify-center mt-2 border-t border-zinc-100 dark:border-zinc-800 pt-4">
            <Pagination
              simple
              current={currentPage}
              total={appointments.length}
              pageSize={pageSize}
              onChange={(page) => setCurrentPage(page)}
              size="small"
              hideOnSinglePage={true}
            />
          </div>
        </div>
      )}
    </Card>
  );
};
