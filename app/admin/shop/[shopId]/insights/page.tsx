"use client";

import React, { useMemo } from "react";
import { Spin } from "antd";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useAppointments } from "@/hooks/useAppointments";
import { useServicesByShop } from "@/hooks/useServices";
import dayjs from "dayjs";
import {
  InsightsHeader,
  InsightsKeyMetrics,
  InsightsSecondaryMetrics,
  InsightsTopServices,
  InsightsPeakHours,
  InsightsWeeklyDistribution,
  InsightsTips,
} from "@/components/admin/shop/insights";

/**
 * Página de Insights e Analytics
 *
 * Métricas, gráficos e análises de desempenho do estabelecimento
 */
export default function InsightsPage() {
  const { shop, shopId, isLoading: isLoadingShop } = useShopAdmin();

  const { data: appointments = [], isLoading: isLoadingAppointments } = useAppointments(
    { shopId },
    !!shopId
  );

  const { data: services = [] } = useServicesByShop(shopId);

  const isLoading = isLoadingShop || isLoadingAppointments;

  // Métricas calculadas
  const metrics = useMemo(() => {
    const today = dayjs().startOf("day");
    const thisWeekStart = dayjs().startOf("week");
    const thisMonthStart = dayjs().startOf("month");
    const lastMonthStart = dayjs().subtract(1, "month").startOf("month");
    const lastMonthEnd = dayjs().subtract(1, "month").endOf("month");

    // Filtros por período
    const todayAppts = appointments.filter((a) =>
      dayjs(a.scheduledAt).isSame(today, "day")
    );
    const thisWeekAppts = appointments.filter((a) =>
      dayjs(a.scheduledAt).isAfter(thisWeekStart)
    );
    const thisMonthAppts = appointments.filter((a) =>
      dayjs(a.scheduledAt).isAfter(thisMonthStart)
    );
    const lastMonthAppts = appointments.filter(
      (a) =>
        dayjs(a.scheduledAt).isAfter(lastMonthStart) &&
        dayjs(a.scheduledAt).isBefore(lastMonthEnd)
    );

    // Receita
    const calculateRevenue = (appts: typeof appointments) =>
      appts
        .filter((a) => a.status === "COMPLETED")
        .reduce((acc, a) => acc + parseFloat(a.totalPrice), 0);

    const todayRevenue = calculateRevenue(todayAppts);
    const weekRevenue = calculateRevenue(thisWeekAppts);
    const monthRevenue = calculateRevenue(thisMonthAppts);
    const lastMonthRevenue = calculateRevenue(lastMonthAppts);

    // Crescimento
    const revenueGrowth =
      lastMonthRevenue > 0
        ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    // Taxa de conclusão
    const completedAppts = thisMonthAppts.filter(
      (a) => a.status === "COMPLETED"
    ).length;
    const totalScheduled = thisMonthAppts.filter(
      (a) => !["CANCELED", "NO_SHOW"].includes(a.status)
    ).length;
    const completionRate =
      totalScheduled > 0 ? (completedAppts / totalScheduled) * 100 : 0;

    // Taxa de cancelamento
    const canceledAppts = thisMonthAppts.filter(
      (a) => a.status === "CANCELED" || a.status === "NO_SHOW"
    ).length;
    const cancellationRate =
      thisMonthAppts.length > 0 ? (canceledAppts / thisMonthAppts.length) * 100 : 0;

    // Ticket médio
    const completedMonthAppts = thisMonthAppts.filter(
      (a) => a.status === "COMPLETED"
    );
    const avgTicket =
      completedMonthAppts.length > 0
        ? monthRevenue / completedMonthAppts.length
        : 0;

    // Duração média
    const avgDuration =
      completedMonthAppts.length > 0
        ? completedMonthAppts.reduce((acc, a) => acc + a.totalDuration, 0) /
          completedMonthAppts.length
        : 0;

    // Serviços mais populares
    const serviceCount: Record<
      string,
      { name: string; count: number; revenue: number }
    > = {};
    thisMonthAppts.forEach((apt) => {
      apt.services.forEach((s) => {
        if (!serviceCount[s.serviceId]) {
          serviceCount[s.serviceId] = {
            name: s.serviceName,
            count: 0,
            revenue: 0,
          };
        }
        serviceCount[s.serviceId].count++;
        serviceCount[s.serviceId].revenue += parseFloat(s.servicePrice);
      });
    });

    const topServices = Object.values(serviceCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Agendamentos por dia da semana
    const dayOfWeekCount: Record<number, number> = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    };
    thisMonthAppts.forEach((apt) => {
      const dow = dayjs(apt.scheduledAt).day();
      dayOfWeekCount[dow]++;
    });

    const dayNames = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
    const appointmentsByDayOfWeek = Object.entries(dayOfWeekCount).map(
      ([day, count]) => ({
        day: dayNames[parseInt(day)],
        count,
      })
    );

    // Horários de pico
    const hourCount: Record<number, number> = {};
    thisMonthAppts.forEach((apt) => {
      const hour = dayjs(apt.scheduledAt).hour();
      hourCount[hour] = (hourCount[hour] || 0) + 1;
    });

    const peakHours = Object.entries(hourCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour, count]) => ({ hour: `${hour}:00`, count }));

    return {
      today: {
        appointments: todayAppts.length,
        revenue: todayRevenue,
        pending: todayAppts.filter((a) => a.status === "PENDING").length,
        completed: todayAppts.filter((a) => a.status === "COMPLETED").length,
      },
      week: {
        appointments: thisWeekAppts.length,
        revenue: weekRevenue,
      },
      month: {
        appointments: thisMonthAppts.length,
        revenue: monthRevenue,
        completionRate,
        cancellationRate,
        avgTicket,
        avgDuration,
        revenueGrowth,
      },
      topServices,
      appointmentsByDayOfWeek,
      peakHours,
      totalServices: services.length,
      activeServices: services.filter((s) => s.isActive !== false).length,
    };
  }, [appointments, services]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando insights..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InsightsHeader
        shop={shop}
        monthRevenue={metrics.month.revenue}
        revenueGrowth={metrics.month.revenueGrowth}
      />

      <InsightsKeyMetrics metrics={metrics} />

      <InsightsSecondaryMetrics metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <InsightsTopServices topServices={metrics.topServices} />
        </div>
        <div className="lg:col-span-5 h-full">
          <InsightsPeakHours peakHours={metrics.peakHours} />
        </div>
      </div>

      <InsightsWeeklyDistribution data={metrics.appointmentsByDayOfWeek} />

      <InsightsTips metrics={metrics} />
    </div>
  );
}