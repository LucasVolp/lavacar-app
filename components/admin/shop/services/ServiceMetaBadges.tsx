"use client";

import React from "react";
import { Services } from "@/types/services";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface ServiceMetaBadgesProps {
  service: Services;
}

export const ServiceMetaBadges: React.FC<ServiceMetaBadgesProps> = ({ service }) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <StatusBadge status={service.isActive === false ? "INACTIVE" : "ACTIVE"} />
      {service.isBudgetOnly && <StatusBadge status="BUDGET_ONLY" />}
      {service.hasVariants && <StatusBadge status="HAS_VARIANTS" />}
    </div>
  );
};
