"use client";

import { useRouter, useParams } from "next/navigation";
import { WarningOutlined } from "@ant-design/icons";
import { Skeleton, Button } from "antd";
import { DashboardHeader } from "@/components/organization/dashboard/DashboardHeader";
import { StatsOverview } from "@/components/organization/dashboard/StatsOverview";
import { RecentShops } from "@/components/organization/dashboard/RecentShops";
import { useOrganizationDashboardMetrics } from "@/hooks/useOrganizations";

export default function OrganizationDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const organizationId = params?.organizationId as string;

  const {
    data: dashboardMetrics,
    isLoading,
    isError,
  } = useOrganizationDashboardMetrics(organizationId, { period: "30d" });

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col gap-4">
          <Skeleton.Input active size="small" />
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton.Button active block className="h-40 !w-full !rounded-2xl" />
          <Skeleton.Button active block className="h-40 !w-full !rounded-2xl" />
          <Skeleton.Button active block className="h-40 !w-full !rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton.Image active className="!w-full !h-64" />
          <Skeleton.Image active className="!w-full !h-64" />
          <Skeleton.Image active className="!w-full !h-64" />
        </div>
      </div>
    );
  }

  if (isError || !dashboardMetrics) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <div className="bg-red-500/10 p-4 rounded-full text-red-500 mb-4">
          <WarningOutlined className="text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-100">Organização não encontrada</h2>
        <p className="text-zinc-500 mt-2 mb-6">Não foi possível carregar os dados desta organização.</p>
        <Button type="primary" onClick={() => router.push("/")}>Voltar ao Início</Button>
      </div>
    );
  }

  const shops = dashboardMetrics.shops || [];

  return (
    <div className="space-y-10 animate-fade-in">
      <DashboardHeader
        organizationName={dashboardMetrics.organization.name}
        shopsCount={shops.length}
        organizationId={organizationId}
      />

      <StatsOverview shopsCount={shops.length} metrics={dashboardMetrics.summary} />

      <RecentShops shops={shops} organizationId={organizationId} />
    </div>
  );
}
