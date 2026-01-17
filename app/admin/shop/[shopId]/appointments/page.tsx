"use client";

import React, { useMemo, useState } from "react";
import { Spin, message } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useAppointments, useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import { Appointment } from "@/types/appointment";
import dayjs from "dayjs";
import { AppointmentsHeader } from "@/components/admin/shop/appointments/AppointmentsHeader";
import { AppointmentsStats } from "@/components/admin/shop/appointments/AppointmentsStats";
import { AppointmentsFilters } from "@/components/admin/shop/appointments/AppointmentsFilters";
import { AppointmentsTable } from "@/components/admin/shop/appointments/AppointmentsTable";
import { AppointmentsCalendar } from "@/components/admin/shop/appointments/AppointmentsCalendar";
import { AppointmentCancelModal } from "@/components/admin/shop/appointments/AppointmentCancelModal";

type ViewType = "table" | "calendar";
type DateRange = [dayjs.Dayjs | null, dayjs.Dayjs | null] | null;

export default function AppointmentsListPage() {
  const { shopId } = useShopAdmin();
  const { data: appointments = [], isLoading, refetch } = useAppointments({ shopId }, !!shopId);
  const updateStatus = useUpdateAppointmentStatus();

  const [dateRange, setDateRange] = useState<DateRange>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "today" | "upcoming">("all");
  const [viewType, setViewType] = useState<ViewType>("calendar");
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const today = dayjs().startOf("day");

  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];

    if (viewMode === "today") {
      filtered = filtered.filter((apt) => dayjs(apt.scheduledAt).isSame(today, "day"));
    } else if (viewMode === "upcoming") {
      filtered = filtered.filter((apt) => dayjs(apt.scheduledAt).isAfter(today));
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((apt) => {
        const date = dayjs(apt.scheduledAt);
        return date.isAfter(dateRange[0]!.startOf("day")) && date.isBefore(dateRange[1]!.endOf("day"));
      });
    }

    if (statusFilter) {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.services.some((s) => s.serviceName.toLowerCase().includes(search)) ||
          apt.id.toLowerCase().includes(search)
      );
    }

    return filtered.sort((a, b) => dayjs(b.scheduledAt).unix() - dayjs(a.scheduledAt).unix());
  }, [appointments, dateRange, statusFilter, searchText, viewMode, today]);

  const stats = useMemo(() => {
    const data = filteredAppointments;
    const todayData = appointments.filter((a) => dayjs(a.scheduledAt).isSame(today, "day"));

    return {
      total: data.length,
      todayTotal: todayData.length,
      pending: data.filter((a) => a.status === "PENDING").length,
      confirmed: data.filter((a) => a.status === "CONFIRMED" || a.status === "WAITING").length,
      inProgress: data.filter((a) => a.status === "IN_PROGRESS").length,
      completed: data.filter((a) => a.status === "COMPLETED").length,
      canceled: data.filter((a) => a.status === "CANCELED" || a.status === "NO_SHOW").length,
      revenue: data
        .filter((a) => a.status === "COMPLETED")
        .reduce((acc, a) => acc + parseFloat(a.totalPrice), 0),
    };
  }, [appointments, filteredAppointments, today]);

  const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode; bgColor: string }> = {
    PENDING: { color: "orange", label: "Pendente", icon: <ClockCircleOutlined />, bgColor: "#fff7e6" },
    CONFIRMED: { color: "blue", label: "Confirmado", icon: <CheckCircleOutlined />, bgColor: "#e6f7ff" },
    WAITING: { color: "cyan", label: "Aguardando", icon: <ClockCircleOutlined />, bgColor: "#e6fffb" },
    IN_PROGRESS: { color: "purple", label: "Em Andamento", icon: <CarOutlined />, bgColor: "#f9f0ff" },
    COMPLETED: { color: "green", label: "Concluído", icon: <CheckCircleOutlined />, bgColor: "#f6ffed" },
    CANCELED: { color: "red", label: "Cancelado", icon: <CloseCircleOutlined />, bgColor: "#fff1f0" },
    NO_SHOW: { color: "default", label: "Não Compareceu", icon: <ExclamationCircleOutlined />, bgColor: "#fafafa" },
  };

  const appointmentsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    appointments.forEach((apt) => {
      const dateKey = dayjs(apt.scheduledAt).format("YYYY-MM-DD");
      if (!map[dateKey]) {
        map[dateKey] = [];
      }
      map[dateKey].push(apt);
    });
    return map;
  }, [appointments]);

  const handleStatusChange = async (appointmentId: string, newStatus: string, reason?: string) => {
    try {
      await updateStatus.mutateAsync({
        id: appointmentId,
        status: newStatus,
        cancellationReason: reason,
      });
      message.success("Status atualizado com sucesso!");
      setCancelModalVisible(false);
      setCancelReason("");
      setSelectedAppointment(null);
    } catch {
      message.error("Erro ao atualizar status. Tente novamente.");
    }
  };

  const openCancelModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelModalVisible(true);
  };

  const getStatusActions = (record: Appointment) => {
    const items = [];

    if (record.status === "PENDING") {
      items.push({ key: "CONFIRMED", label: "✓ Confirmar" });
    }
    if (["PENDING", "CONFIRMED"].includes(record.status)) {
      items.push({ key: "WAITING", label: "⏳ Marcar Aguardando" });
    }
    if (["CONFIRMED", "WAITING"].includes(record.status)) {
      items.push({ key: "IN_PROGRESS", label: "🚗 Iniciar Atendimento" });
    }
    if (record.status === "IN_PROGRESS") {
      items.push({ key: "COMPLETED", label: "✅ Concluir" });
    }
    if (!["COMPLETED", "CANCELED", "NO_SHOW"].includes(record.status)) {
      items.push({ key: "CANCEL", label: "❌ Cancelar", danger: true });
      items.push({ key: "NO_SHOW", label: "⚠️ Não Compareceu" });
    }

    return items;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando agendamentos..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AppointmentsHeader
        todayTotal={stats.todayTotal}
        viewType={viewType}
        onViewTypeChange={setViewType}
        onRefresh={refetch}
      />

      <AppointmentsStats stats={stats} />

      {viewType === "table" && (
        <AppointmentsFilters
          viewMode={viewMode}
          setViewMode={setViewMode}
          dateRange={dateRange}
          setDateRange={setDateRange}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchText={searchText}
          setSearchText={setSearchText}
          statusConfig={statusConfig}
          onClearFilters={() => {
            setDateRange(null);
            setStatusFilter(null);
            setSearchText("");
            setViewMode("all");
          }}
        />
      )}
      <div className="animate-fade-in space-y-4">
      {viewType === "table" ? (
        <AppointmentsTable
          appointments={filteredAppointments}
          shopId={shopId}
          statusConfig={statusConfig}
          getStatusActions={getStatusActions}
          onStatusChange={handleStatusChange}
          onCancel={openCancelModal}
        />
      ) : (
        <AppointmentsCalendar
          appointmentsByDate={appointmentsByDate}
          statusConfig={statusConfig}
          shopId={shopId}
        />
      )}
      </div>

      <AppointmentCancelModal
        open={cancelModalVisible}
        onCancel={() => {
          setCancelModalVisible(false);
          setCancelReason("");
          setSelectedAppointment(null);
        }}
        onConfirm={() => {
          if (selectedAppointment) {
            handleStatusChange(selectedAppointment.id, "CANCELED", cancelReason);
          }
        }}
        reason={cancelReason}
        setReason={setCancelReason}
        loading={updateStatus.isPending}
      />
    </div>
  );
}