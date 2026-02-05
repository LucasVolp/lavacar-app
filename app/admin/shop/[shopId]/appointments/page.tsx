"use client";

import React, { useState } from "react";
import { Spin, message, Pagination } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useShopAppointments, useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import { Appointment, AppointmentStatus } from "@/types/appointment";
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
  const updateStatus = useUpdateAppointmentStatus();

  const [dateRange, setDateRange] = useState<DateRange>(null);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "today" | "upcoming">("all");
  const [viewType, setViewType] = useState<ViewType>("calendar");
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const today = dayjs().startOf("day");

  const getDateFilters = () => {
    if (viewMode === "today") {
      return {
        startDate: today.format("YYYY-MM-DD"),
        endDate: today.format("YYYY-MM-DD"),
      };
    }
    if (viewMode === "upcoming") {
      return {
        startDate: today.format("YYYY-MM-DD"),
      };
    }
    if (dateRange && dateRange[0] && dateRange[1]) {
      return {
        startDate: dateRange[0].format("YYYY-MM-DD"),
        endDate: dateRange[1].format("YYYY-MM-DD"),
      };
    }
    return {};
  };

  const filters = {
    ...getDateFilters(),
    status: statusFilter || undefined,
    page,
    perPage,
  };

  const { data: appointmentsData, isLoading, refetch } = useShopAppointments(shopId, filters, !!shopId);

  const appointments = appointmentsData?.data ?? [];
  const meta = appointmentsData?.meta;

  const stats = {
    total: meta?.total ?? 0,
    todayTotal: appointments.filter((a) => dayjs(a.scheduledAt).isSame(today, "day")).length,
    pending: appointments.filter((a) => a.status === "PENDING").length,
    confirmed: appointments.filter((a) => a.status === "CONFIRMED" || a.status === "WAITING").length,
    inProgress: appointments.filter((a) => a.status === "IN_PROGRESS").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
    canceled: appointments.filter((a) => a.status === "CANCELED" || a.status === "NO_SHOW").length,
    revenue: appointments
      .filter((a) => a.status === "COMPLETED")
      .reduce((acc, a) => acc + parseFloat(a.totalPrice), 0),
  };

  const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode; bgColor: string }> = {
    PENDING: { color: "orange", label: "Pendente", icon: <ClockCircleOutlined />, bgColor: "#fff7e6" },
    CONFIRMED: { color: "blue", label: "Confirmado", icon: <CheckCircleOutlined />, bgColor: "#e6f7ff" },
    WAITING: { color: "cyan", label: "Aguardando", icon: <ClockCircleOutlined />, bgColor: "#e6fffb" },
    IN_PROGRESS: { color: "purple", label: "Em Andamento", icon: <CarOutlined />, bgColor: "#f9f0ff" },
    COMPLETED: { color: "green", label: "Concluído", icon: <CheckCircleOutlined />, bgColor: "#f6ffed" },
    CANCELED: { color: "red", label: "Cancelado", icon: <CloseCircleOutlined />, bgColor: "#fff1f0" },
    NO_SHOW: { color: "default", label: "Não Compareceu", icon: <ExclamationCircleOutlined />, bgColor: "#fafafa" },
  };

  const appointmentsByDate = appointments.reduce<Record<string, Appointment[]>>((map, apt) => {
    const dateKey = dayjs(apt.scheduledAt).format("YYYY-MM-DD");
    if (!map[dateKey]) {
      map[dateKey] = [];
    }
    map[dateKey].push(apt);
    return map;
  }, {});

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

  const handleFilterChange = () => {
    setPage(1);
  };

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPageSize && newPageSize !== perPage) {
      setPerPage(newPageSize);
    }
  };

  if (isLoading && !appointmentsData) {
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
          setViewMode={(mode) => { setViewMode(mode); handleFilterChange(); }}
          dateRange={dateRange}
          setDateRange={(range) => { setDateRange(range); handleFilterChange(); }}
          statusFilter={statusFilter}
          setStatusFilter={(status) => { setStatusFilter(status as AppointmentStatus | null); handleFilterChange(); }}
          searchText=""
          setSearchText={() => {}}
          statusConfig={statusConfig}
          onClearFilters={() => {
            setDateRange(null);
            setStatusFilter(null);
            setViewMode("all");
            setPage(1);
          }}
        />
      )}
      <div className="animate-fade-in space-y-4">
        {viewType === "table" ? (
          <AppointmentsTable
            appointments={appointments}
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

      {viewType === "table" && meta && meta.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            current={page}
            pageSize={perPage}
            total={meta.total}
            onChange={handlePageChange}
            showSizeChanger
            showTotal={(total, range) => `${range[0]}-${range[1]} de ${total} agendamentos`}
            pageSizeOptions={["10", "20", "50", "100"]}
          />
        </div>
      )}

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