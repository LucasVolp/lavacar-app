"use client";

import React from "react";
import { InsightsHeader } from "@/components/organization/insights/InsightsHeader";
import { StatsGrid } from "@/components/organization/insights/StatsGrid";
import { RevenueChart } from "@/components/organization/insights/RevenueChart";
import { TopServices } from "@/components/organization/insights/TopServices";

export default function OrganizationInsightsPage() {
  return (
    <div className="animate-fade-in space-y-8">
      <InsightsHeader />

      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />

        <div className="space-y-6">
          <TopServices />
        </div>
      </div>
    </div>
  );
}