"use client";

import React from "react";
import { Button, Empty } from "antd";
import { RocketOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { sanitizeText } from "@/lib/security";

export interface OpportunityItem {
  key: string;
  label: string;
  occupancyPercent: number;
  emptyPercent: number;
  appointments: number;
}

interface InsightsOpportunityCardsProps {
  opportunities: OpportunityItem[];
}

export const InsightsOpportunityCards: React.FC<InsightsOpportunityCardsProps> = ({
  opportunities,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-colors duration-300">
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
        <ThunderboltOutlined className="text-amber-500" />
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">Oportunidades de Ocupação</span>
      </div>

      <div className="p-4 space-y-3">
        {opportunities.length === 0 ? (
          <Empty description="Nenhuma oportunidade crítica (< 20%) no período" />
        ) : (
          opportunities.map((item) => (
            <div
              key={item.key}
              className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30"
            >
              <p className="text-zinc-800 dark:text-zinc-100 font-semibold mb-2">
                Sua {sanitizeText(item.label)} está {item.emptyPercent.toFixed(0)}% vazia.
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
                Ocupação atual: {item.occupancyPercent.toFixed(0)}% ({item.appointments} agendamentos no mês).
              </p>
              <Button type="primary" size="small" icon={<RocketOutlined />}>
                Criar Promoção Relâmpago
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
