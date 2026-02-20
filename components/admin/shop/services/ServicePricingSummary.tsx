"use client";

import React from "react";
import { Typography } from "antd";
import { Services } from "@/types/services";
import { VEHICLE_SIZE_LABEL, formatCurrency } from "./serviceUi";
const { Text } = Typography;

interface ServicePricingSummaryProps {
  service: Services;
  compact?: boolean;
}

export const ServicePricingSummary: React.FC<ServicePricingSummaryProps> = ({ service, compact = false }) => {
  if (service.isBudgetOnly) {
    return compact ? (
      <span className="text-zinc-600 dark:text-zinc-300 font-semibold">A combinar</span>
    ) : (
      <Text className="text-zinc-600 dark:text-zinc-300 font-medium">A combinar (orçamento)</Text>
    );
  }

  if (service.hasVariants && service.variants?.length) {
    const sorted = [...service.variants].sort((a, b) => Number(a.price) - Number(b.price));
    const lowest = sorted[0];

    if (compact) {
      return (
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
          A partir de {formatCurrency(lowest.price)}
        </span>
      );
    }

    return (
      <div className="space-y-1">
        <Text className="text-emerald-600 dark:text-emerald-400 font-semibold">
          A partir de {formatCurrency(lowest.price)}
        </Text>
        <div className="space-y-0.5">
          {sorted.map((variant) => (
            <div key={variant.id} className="text-xs text-zinc-500 dark:text-zinc-400">
              {VEHICLE_SIZE_LABEL[variant.size]}: {formatCurrency(variant.price)} • {variant.duration} min
            </div>
          ))}
        </div>
      </div>
    );
  }

  return compact ? (
    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatCurrency(service.price)}</span>
  ) : (
    <Text className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatCurrency(service.price)}</Text>
  );
};
