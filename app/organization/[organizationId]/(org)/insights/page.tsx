"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Spin } from "antd";
import {
  InsightsHeader,
  RevenueChart,
  ShopRanking,
  StatsGrid,
  TopServices,
} from "@/components/organization/insights";
import { useOrganizationDashboardMetrics } from "@/hooks/useOrganizations";
import type { OrganizationInsightsPeriod } from "@/types/organization";

export default function OrganizationInsightsPage() {
  const params = useParams();
  const organizationId = params?.organizationId as string;
  const [period, setPeriod] = useState<OrganizationInsightsPeriod>("30d");

  const { data, isLoading } = useOrganizationDashboardMetrics(organizationId, { period });

  const topRanking = useMemo(() => (data?.ranking || []).slice(0, 10), [data?.ranking]);
  const topServices = useMemo(() => (data?.topServices || []).slice(0, 5), [data?.topServices]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spin size="large" tip="Carregando insights da organização..." />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="animate-fade-in space-y-8">
      <InsightsHeader
        organizationName={data.organization.name}
        period={period}
        onPeriodChange={setPeriod}
      />

      <StatsGrid summary={data.summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart data={data.revenueSeries} />

        <div className="space-y-6">
          <ShopRanking ranking={topRanking} />
          <TopServices services={topServices} />
        </div>
      </div>
    </div>
  );
}
