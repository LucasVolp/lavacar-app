"use client";

// Force fresh data on every navigation - prevents stale dashboard metrics
export const dynamic = "force-dynamic";

import React, { useMemo, useState } from "react";
import { Spin, Tabs } from "antd";
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
  InsightsOpportunityCards,
  InsightsClientMix,
  ShopInsightsPeriod,
} from "@/components/admin/shop/insights";
import { Appointment } from "@/types/appointment";
import { Services } from "@/types/services";

export default function InsightsPage() {
  const { shop, shopId, isLoading: isLoadingShop } = useShopAdmin();
  const [period, setPeriod] = useState<ShopInsightsPeriod>("30d");

  const getPeriodRange = (selectedPeriod: ShopInsightsPeriod) => {
    const now = dayjs();
    switch (selectedPeriod) {
      case "7d":
        return {
          startDate: now.subtract(6, "day").startOf("day").toISOString(),
          endDate: now.endOf("day").toISOString(),
        };
      case "90d":
        return {
          startDate: now.subtract(3, "month").startOf("day").toISOString(),
          endDate: now.endOf("day").toISOString(),
        };
      case "lifetime":
        return {};
      case "30d":
      default:
        return {
          startDate: now.subtract(29, "day").startOf("day").toISOString(),
          endDate: now.endOf("day").toISOString(),
        };
    }
  };

  const periodRange = getPeriodRange(period);

  const { data: appointmentsData, isLoading: isLoadingAppointments } = useAppointments(
    { shopId, perPage: 5000, ...periodRange },
    !!shopId
  );

  const { data: servicesData } = useServicesByShop(shopId, { perPage: 500 });

  const isLoading = isLoadingShop || isLoadingAppointments;

  const metrics = useMemo(() => {
    const appointments: Appointment[] = appointmentsData?.data ?? [];
    const services: Services[] = servicesData?.data ?? [];
    const today = dayjs().startOf("day");
    const thisWeekStart = dayjs().startOf("week");
    const thisWeekEnd = dayjs().endOf("week");
    const thisMonthStart = dayjs().startOf("month");
    const thisMonthEnd = dayjs().endOf("month");
    const lastMonthStart = dayjs().subtract(1, "month").startOf("month");
    const lastMonthEnd = dayjs().subtract(1, "month").endOf("month");
    const nonCanceledStatuses = new Set(["CANCELED", "NO_SHOW"]);
    const completedStatus = new Set(["COMPLETED"]);

    const inRange = (value: dayjs.Dayjs, start: dayjs.Dayjs, end: dayjs.Dayjs) =>
      !value.isBefore(start) && !value.isAfter(end);

    const todayAppts = appointments.filter((a) =>
      dayjs(a.scheduledAt).isSame(today, "day")
    );
    const thisWeekAppts = appointments.filter((a) =>
      inRange(dayjs(a.scheduledAt), thisWeekStart, thisWeekEnd)
    );
    const thisMonthAppts = appointments.filter((a) =>
      inRange(dayjs(a.scheduledAt), thisMonthStart, thisMonthEnd)
    );
    const lastMonthAppts = appointments.filter(
      (a) => inRange(dayjs(a.scheduledAt), lastMonthStart, lastMonthEnd)
    );

    const calculateRevenue = (appts: typeof appointments) =>
      appts
        .filter((a) => completedStatus.has(a.status))
        .reduce((acc, a) => acc + parseFloat(a.totalPrice), 0);

    const calculateAvgTicket = (appts: typeof appointments) => {
      const completed = appts.filter((a) => completedStatus.has(a.status));
      if (completed.length === 0) return 0;
      return calculateRevenue(completed) / completed.length;
    };

    const calculateGrowth = (current: number, previous: number) => {
      if (previous <= 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const todayRevenue = calculateRevenue(todayAppts);
    const weekRevenue = calculateRevenue(thisWeekAppts);
    const monthRevenue = calculateRevenue(thisMonthAppts);
    const lastMonthRevenue = calculateRevenue(lastMonthAppts);
    const monthAvgTicket = calculateAvgTicket(thisMonthAppts);
    const lastMonthAvgTicket = calculateAvgTicket(lastMonthAppts);

    const revenueGrowth = calculateGrowth(monthRevenue, lastMonthRevenue);
    const avgTicketGrowth = calculateGrowth(monthAvgTicket, lastMonthAvgTicket);

    const completedAppts = thisMonthAppts.filter(
      (a) => completedStatus.has(a.status)
    ).length;
    const totalScheduled = thisMonthAppts.filter(
      (a) => !nonCanceledStatuses.has(a.status)
    ).length;
    const completionRate =
      totalScheduled > 0 ? (completedAppts / totalScheduled) * 100 : 0;

    const canceledAppts = thisMonthAppts.filter(
      (a) => nonCanceledStatuses.has(a.status)
    ).length;
    const cancellationRate =
      thisMonthAppts.length > 0 ? (canceledAppts / thisMonthAppts.length) * 100 : 0;

    const completedMonthAppts = thisMonthAppts.filter(
      (a) => completedStatus.has(a.status)
    );
    const avgTicket = monthAvgTicket;

    const avgDuration =
      completedMonthAppts.length > 0
        ? completedMonthAppts.reduce((acc, a) => acc + a.totalDuration, 0) /
          completedMonthAppts.length
        : 0;

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

    const hourCount: Record<number, number> = {};
    thisMonthAppts.forEach((apt) => {
      const hour = dayjs(apt.scheduledAt).hour();
      hourCount[hour] = (hourCount[hour] || 0) + 1;
    });

    const peakHours = Object.entries(hourCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour, count]) => ({ hour: `${hour}:00`, count }));

    const weekdayLabels = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    const periods = [
      { key: "morning", label: "manhã", start: 8, end: 12 },
      { key: "afternoon", label: "tarde", start: 12, end: 18 },
      { key: "evening", label: "noite", start: 18, end: 22 },
    ];

    const slotCount: Record<string, number> = {};
    thisMonthAppts
      .filter((apt) => !nonCanceledStatuses.has(apt.status))
      .forEach((apt) => {
        const date = dayjs(apt.scheduledAt);
        const day = date.day();
        const hour = date.hour();
        const period = periods.find((p) => hour >= p.start && hour < p.end);
        if (!period) return;
        const key = `${day}-${period.key}`;
        slotCount[key] = (slotCount[key] || 0) + 1;
      });

    const allSlots = weekdayLabels.flatMap((day, dayIndex) =>
      periods.map((period) => ({
        key: `${dayIndex}-${period.key}`,
        label: `${day} de ${period.label}`,
        appointments: slotCount[`${dayIndex}-${period.key}`] || 0,
      }))
    );

    const maxSlotAppointments = Math.max(
      1,
      ...allSlots.map((slot) => slot.appointments)
    );

    const opportunities = allSlots
      .map((slot) => {
        const occupancyPercent = (slot.appointments / maxSlotAppointments) * 100;
        const emptyPercent = 100 - occupancyPercent;

        return {
          ...slot,
          occupancyPercent,
          emptyPercent,
        };
      })
      .filter((slot) => slot.occupancyPercent < 20)
      .sort((a, b) => a.occupancyPercent - b.occupancyPercent)
      .slice(0, 3);

    const monthActiveAppts = thisMonthAppts.filter(
      (apt) => !nonCanceledStatuses.has(apt.status)
    );
    const monthUsers = Array.from(
      new Set(monthActiveAppts.map((apt) => apt.userId).filter(Boolean))
    );
    let recurringClients = 0;
    let newClients = 0;

    monthUsers.forEach((userId) => {
      const hadAppointmentBeforeMonth = appointments.some(
        (apt) =>
          apt.userId === userId &&
          dayjs(apt.scheduledAt).isBefore(thisMonthStart) &&
          !nonCanceledStatuses.has(apt.status)
      );

      if (hadAppointmentBeforeMonth) {
        recurringClients += 1;
      } else {
        newClients += 1;
      }
    });

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
        avgTicketGrowth,
      },
      topServices,
      appointmentsByDayOfWeek,
      peakHours,
      opportunities,
      clientsMix: {
        newClients,
        recurringClients,
      },
      totalServices: services.length,
      activeServices: services.filter((s) => s.isActive !== false).length,
    };
  }, [appointmentsData, servicesData]);

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
        period={period}
        onPeriodChange={setPeriod}
      />

      <Tabs
        defaultActiveKey="overview"
        items={[
          {
            key: "overview",
            label: "Visão Geral",
            children: (
              <div className="space-y-6 pt-2">
                <InsightsKeyMetrics metrics={metrics} />
                <InsightsSecondaryMetrics metrics={metrics} />
                <InsightsTips metrics={metrics} />
              </div>
            ),
          },
          {
            key: "financial",
            label: "Financeiro",
            children: (
              <div className="space-y-6 pt-2">
                <InsightsKeyMetrics metrics={metrics} />
                <InsightsTopServices topServices={metrics.topServices} />
              </div>
            ),
          },
          {
            key: "operational",
            label: "Operacional",
            children: (
              <div className="space-y-6 pt-2">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-7">
                    <InsightsOpportunityCards opportunities={metrics.opportunities} />
                  </div>
                  <div className="lg:col-span-5 h-full">
                    <InsightsPeakHours peakHours={metrics.peakHours} />
                  </div>
                </div>
                <InsightsWeeklyDistribution data={metrics.appointmentsByDayOfWeek} />
              </div>
            ),
          },
          {
            key: "clients",
            label: "Clientes",
            children: (
              <div className="space-y-6 pt-2">
                <InsightsClientMix
                  newClients={metrics.clientsMix.newClients}
                  recurringClients={metrics.clientsMix.recurringClients}
                />
                <InsightsTips metrics={metrics} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
