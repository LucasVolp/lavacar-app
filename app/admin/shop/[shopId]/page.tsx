"use client";

import React from "react";
import { Spin, Row, Col } from "antd";
import {
  ToolOutlined,
  StopOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useAppointments } from "@/hooks/useAppointments";
import { useServicesByShop } from "@/hooks/useServices";
import { useShopSchedules } from "@/hooks/useSchedules";
import { useBlockedTimesByShop } from "@/hooks/useBlockedTimes";
import { isSameDay, isAfter, isBefore, startOfWeek, endOfWeek, startOfDay, parseISO } from "date-fns";
import {
  DashboardHeader,
  DashboardStats,
  UpcomingAppointments,
  PerformanceCard,
  QuickActionsCard,
} from "@/components/admin/shop/dashboard";

/**
 * Dashboard do Shop (Admin)
 * 
 * UI profissional com:
 * - Cards de estatísticas animados
 * - Agenda do dia com timeline
 * - Ações rápidas
 * - Indicadores de performance
 */
export default function ShopDashboardPage() {
  const { shop, shopId, isLoading: isLoadingShop } = useShopAdmin();
  
  const { data: appointments = [], isLoading: isLoadingAppointments } = useAppointments(
    { shopId },
    !!shopId
  );
  
  const { data: services = [] } = useServicesByShop(shopId);
  const { data: schedules = [] } = useShopSchedules(shopId);
  const { data: blockedTimes = [] } = useBlockedTimesByShop(shopId);

  const isLoading = isLoadingShop || isLoadingAppointments;

  // Datas de referência
  const today = startOfDay(new Date());
  const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // Domingo
  const weekEnd = endOfWeek(today, { weekStartsOn: 0 });

  // Filtrar agendamentos
  const todayAppointments = appointments.filter((apt) =>
    isSameDay(parseISO(apt.scheduledAt), today)
  );

  const weekAppointments = appointments.filter((apt) => {
    const date = parseISO(apt.scheduledAt);
    return isAfter(date, weekStart) && isBefore(date, weekEnd);
  });

  // Calcular estatísticas
  const stats = {
    total: todayAppointments.length,
    pending: todayAppointments.filter((a) => a.status === "PENDING").length,
    confirmed: todayAppointments.filter((a) => a.status === "CONFIRMED" || a.status === "WAITING").length,
    inProgress: todayAppointments.filter((a) => a.status === "IN_PROGRESS").length,
    completed: todayAppointments.filter((a) => a.status === "COMPLETED").length,
    revenue: todayAppointments
      .filter((a) => a.status === "COMPLETED")
      .reduce((acc, a) => acc + parseFloat(a.totalPrice), 0),
    weekRevenue: weekAppointments
      .filter((a) => a.status === "COMPLETED")
      .reduce((acc, a) => acc + parseFloat(a.totalPrice), 0),
    weekAppointmentsCount: weekAppointments.length,
    activeServices: services.filter((s) => s.isActive !== false).length,
  };

  // Taxa de conclusão do dia
  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  // Próximos agendamentos (não concluídos/cancelados)
  const upcomingAppointments = todayAppointments
    .filter((a) => !["COMPLETED", "CANCELED", "NO_SHOW"].includes(a.status))
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 5);

  // Ações rápidas
  const quickActions = [
    {
      title: "Serviços",
      icon: <ToolOutlined className="text-xl" />,
      color: "#3b82f6",
      value: stats.activeServices,
      label: "ativos",
      path: `/admin/shop/${shopId}/services`,
    },
    {
      title: "Horários",
      icon: <ScheduleOutlined className="text-xl" />,
      color: "#10b981",
      value: schedules.filter(s => s.isOpen === "ACTIVE").length,
      label: "dias abertos",
      path: `/admin/shop/${shopId}/schedules`,
    },
    {
      title: "Bloqueios",
      icon: <StopOutlined className="text-xl" />,
      color: "#f59e0b",
      value: blockedTimes.filter(b => isAfter(parseISO(b.date), today)).length,
      label: "futuros",
      path: `/admin/shop/${shopId}/blocked-times`,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      <DashboardHeader 
        shop={shop} 
        totalAppointments={stats.total} 
        revenue={stats.revenue} 
      />

      <DashboardStats 
        stats={{
          total: stats.total,
          pending: stats.pending,
          inProgress: stats.inProgress,
          revenue: stats.revenue,
          weekRevenue: stats.weekRevenue,
          weekAppointmentsCount: stats.weekAppointmentsCount
        }} 
      />

      {/* Conteúdo Principal */}
      <Row gutter={[24, 24]}>
        {/* Próximos Agendamentos */}
        <Col xs={24} lg={16}>
          <UpcomingAppointments 
            appointments={upcomingAppointments} 
            shopId={shopId} 
          />
        </Col>

        {/* Painel Lateral */}
        <Col xs={24} lg={8}>
          <div className="space-y-6">
            <PerformanceCard 
              completionRate={completionRate} 
              stats={{
                completed: stats.completed,
                inProgress: stats.inProgress,
                pending: stats.pending,
                confirmed: stats.confirmed
              }} 
            />

            <QuickActionsCard actions={quickActions} />
          </div>
        </Col>
      </Row>
    </div>
  );
}
