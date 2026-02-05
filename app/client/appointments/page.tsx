"use client";

import React, { useState, useMemo } from "react";
import { message, Spin, Modal, Input, Tabs } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  useAppointments,
  useUpdateAppointmentStatus,
  useCancelAppointment,
} from "@/hooks/useAppointments";
import {
  ClientAppointmentsHeader,
  ClientAppointmentsListFull,
  type ClientAppointmentFull,
} from "@/components/client/appointments";
import dayjs from "dayjs";
import { Appointment } from "@/types/appointment";

const { TextArea } = Input;

export default function ClientAppointmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const { data: appointmentsResult, isLoading } = useAppointments(
    { userId: user?.id, perPage: 100 },
    !!user?.id
  );

  const updateStatus = useUpdateAppointmentStatus();
  const cancelAppointment = useCancelAppointment();

  const appointments: ClientAppointmentFull[] = useMemo(() => {
    const appointmentsRaw: Appointment[] = appointmentsResult?.data ?? [];
    return appointmentsRaw.map((app) => ({
      id: app.id,
      shop: app.shop?.name || "Loja desconhecida",
      shopAddress: app.shop
        ? `${app.shop.street}, ${app.shop.neighborhood}`
        : "",
      services: app.services?.map((s: { serviceName?: string; name?: string } | string) => ({
        name: typeof s === 'string' ? s : (s.serviceName || s.name || "Serviço"),
      })) || [],
      vehicle: app.vehicle
        ? `${app.vehicle.brand} ${app.vehicle.model}`
        : "Veículo removido",
      vehiclePlate: app.vehicle?.plate || "",
      date: dayjs(app.scheduledAt).format("DD/MM/YYYY"),
      time: dayjs(app.scheduledAt).format("HH:mm"),
      scheduledAt: app.scheduledAt,
      duration: app.totalDuration,
      price: parseFloat(app.totalPrice),
      status: app.status,
      createdAt: dayjs(app.createdAt).format("DD/MM/YYYY"),
    }));
  }, [appointmentsResult]);

  // Separate upcoming and history
  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter((a) => ["PENDING", "CONFIRMED", "IN_PROGRESS"].includes(a.status))
      .sort(
        (a, b) =>
          dayjs(a.scheduledAt).valueOf() - dayjs(b.scheduledAt).valueOf()
      );
  }, [appointments]);

  const historyAppointments = useMemo(() => {
    return appointments
      .filter((a) => ["COMPLETED", "CANCELED"].includes(a.status))
      .sort(
        (a, b) =>
          dayjs(b.scheduledAt).valueOf() - dayjs(a.scheduledAt).valueOf()
      );
  }, [appointments]);

  const displayedAppointments = useMemo(() => {
    const list =
      activeTab === "upcoming" ? upcomingAppointments : historyAppointments;
    if (!statusFilter) return list;
    return list.filter((a) => a.status === statusFilter);
  }, [activeTab, upcomingAppointments, historyAppointments, statusFilter]);

  const handleConfirm = async (id: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: "CONFIRMED" });
      message.success("Agendamento confirmado com sucesso!");
    } catch {
      message.error("Erro ao confirmar agendamento");
    }
  };

  const handleOpenCancelModal = (id: string) => {
    setCancelingId(id);
    setCancelReason("");
    setCancelModalOpen(true);
  };

  const handleCancel = async () => {
    if (!cancelingId) return;
    try {
      await cancelAppointment.mutateAsync({
        id: cancelingId,
        reason: cancelReason,
        userId: user?.id,
      });
      message.success("Agendamento cancelado");
      setCancelModalOpen(false);
      setCancelingId(null);
    } catch {
      message.error("Erro ao cancelar agendamento");
    }
  };

  const handleClick = (id: string) => {
    router.push(`/client/appointments/${id}`);
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ClientAppointmentsHeader onFilterChange={setStatusFilter} />

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="mb-4"
        items={[
          {
            key: "upcoming",
            label: `Próximos (${upcomingAppointments.length})`,
          },
          {
            key: "history",
            label: `Histórico (${historyAppointments.length})`,
          },
        ]}
      />

      <ClientAppointmentsListFull
        appointments={displayedAppointments}
        onCancel={handleOpenCancelModal}
        onConfirm={handleConfirm}
        onClick={handleClick}
        isHistory={activeTab === "history"}
        isConfirming={updateStatus.isPending}
      />

      <Modal
        title="Cancelar Agendamento"
        open={cancelModalOpen}
        onCancel={() => setCancelModalOpen(false)}
        onOk={handleCancel}
        okText="Confirmar Cancelamento"
        cancelText="Voltar"
        okButtonProps={{
          danger: true,
          loading: cancelAppointment.isPending,
        }}
      >
        <p className="mb-4">
          Tem certeza que deseja cancelar este agendamento? Esta ação não pode
          ser desfeita.
        </p>
        <TextArea
          placeholder="Motivo do cancelamento (opcional)"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          rows={3}
        />
      </Modal>
    </div>
  );
}
