"use client";

import React, { useState } from "react";
import { Modal, Button, List, Tag, Typography, Empty, App } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CarOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import { Appointment } from "@/types/appointment";
import { formatCurrency } from "@/lib/security";
import { format, parseISO } from "date-fns";
import { StatusBadge } from "@/components/ui";
import { formatVehiclePlate } from "@/utils/vehiclePlate";

const { Text } = Typography;

interface ResolveModalProps {
  open: boolean;
  onClose: () => void;
  overdueAppointments: Appointment[];
}

function getClientName(appointment: Appointment): string {
  if (appointment.user?.firstName) {
    const last = appointment.user.lastName ? ` ${appointment.user.lastName}` : "";
    return `${appointment.user.firstName}${last}`;
  }

  if (appointment.shopClient?.customName) {
    return appointment.shopClient.customName;
  }

  return "Cliente não identificado";
}

export const ResolveModal: React.FC<ResolveModalProps> = ({
  open,
  onClose,
  overdueAppointments,
}) => {
  const { message } = App.useApp();
  const updateStatus = useUpdateAppointmentStatus();
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const handleResolve = (appointmentId: string, status: "COMPLETED" | "NO_SHOW") => {
    setResolvingId(appointmentId);

    const label = status === "COMPLETED" ? "concluído" : "marcado como não compareceu";

    updateStatus.mutate(
      { id: appointmentId, status },
      {
        onSuccess: () => {
          message.success(`Agendamento ${label} com sucesso!`);
          setResolvingId(null);
        },
        onError: () => {
          message.error("Erro ao atualizar o agendamento. Tente novamente.");
          setResolvingId(null);
        },
      }
    );
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400">
            <ClockCircleOutlined />
          </div>
          <div className="flex flex-col">
            <span>Resolver Pendências</span>
            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400 mt-0.5">
              Atualize o status dos agendamentos pendentes
            </span>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={640}
      className="[&_.ant-modal-content]:!bg-white dark:[&_.ant-modal-content]:!bg-zinc-900 [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-close]:!text-zinc-400 [&_.ant-modal-close:hover]:!text-zinc-600 dark:[&_.ant-modal-close:hover]:!text-zinc-200"
      styles={{
        body: { padding: "24px" },
      }}
    >
      {overdueAppointments.length === 0 ? (
        <div className="py-12">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text className="text-zinc-500 dark:text-zinc-400">
                Todas as pendências foram resolvidas!
              </Text>
            }
          />
        </div>
      ) : (
        <List
          dataSource={overdueAppointments}
          renderItem={(apt) => {
            const isResolving = resolvingId === apt.id;

            return (
              <div
                key={apt.id}
                className="flex flex-col p-4 mb-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800"
              >
                {/* Header: Client + Status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                      <UserOutlined className="text-indigo-600 dark:text-indigo-400 text-sm" />
                    </div>
                    <div className="min-w-0">
                      <Text
                        strong
                        className="text-zinc-800 dark:text-zinc-100 block truncate"
                      >
                        {getClientName(apt)}
                      </Text>
                    </div>
                  </div>
                  <StatusBadge status={apt.status} className="m-0 px-3 py-0.5 rounded-full font-medium flex-shrink-0" />
                </div>

                {/* Vehicle + Time */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3 text-sm">
                  {apt.vehicle && (
                    <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                      <CarOutlined className="text-emerald-500 dark:text-emerald-400" />
                      <span className="uppercase font-medium">{formatVehiclePlate(apt.vehicle.plate)}</span>
                      <span className="text-zinc-400 dark:text-zinc-500">-</span>
                      <span>{apt.vehicle.model}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                    <ClockCircleOutlined />
                    <span>{format(parseISO(apt.scheduledAt), "HH:mm")}</span>
                    <span className="text-zinc-400 dark:text-zinc-500">-</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {formatCurrency(apt.totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Services */}
                {apt.services.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {apt.services.map((service) => (
                      <Tag
                        key={service.id}
                        className="m-0 rounded-lg bg-zinc-100 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-300 border-0 text-xs px-2 py-0.5"
                      >
                        {service.serviceName}
                      </Tag>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    loading={isResolving && updateStatus.variables?.status === "COMPLETED"}
                    disabled={isResolving && updateStatus.variables?.status !== "COMPLETED"}
                    onClick={() => handleResolve(apt.id, "COMPLETED")}
                    className="flex-1 !bg-emerald-600 hover:!bg-emerald-500 !border-0 !text-white !rounded-lg !shadow-sm font-medium"
                  >
                    Concluir
                  </Button>
                  <Button
                    icon={<CloseCircleOutlined />}
                    loading={isResolving && updateStatus.variables?.status === "NO_SHOW"}
                    disabled={isResolving && updateStatus.variables?.status !== "NO_SHOW"}
                    onClick={() => handleResolve(apt.id, "NO_SHOW")}
                    className="flex-1 !bg-orange-500 hover:!bg-orange-400 !border-0 !text-white !rounded-lg !shadow-sm font-medium"
                  >
                    Não Compareceu
                  </Button>
                </div>
              </div>
            );
          }}
        />
      )}
    </Modal>
  );
};
