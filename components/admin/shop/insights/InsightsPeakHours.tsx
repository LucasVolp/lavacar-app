"use client";

import React from "react";
import { Typography, Empty } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { sanitizeText } from "@/lib/security";

const { Text } = Typography;

interface PeakHour {
  hour: string;
  count: number;
}

interface InsightsPeakHoursProps {
  peakHours: PeakHour[];
}

export const InsightsPeakHours: React.FC<InsightsPeakHoursProps> = ({
  peakHours
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl h-full flex flex-col transition-colors duration-200">
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
        <ClockCircleOutlined className="text-purple-500" />
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          Horários de Pico
        </span>
      </div>

      <div className="p-4 flex-1">
        {peakHours.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <Empty description="Nenhum dado disponível" />
          </div>
        ) : (
          <div className="space-y-4">
            {peakHours.map((peak, index) => (
              <div
                key={peak.hour}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm ${
                      index === 0
                        ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                        : "bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <Text
                      strong
                      className="text-lg block !text-zinc-900 dark:!text-zinc-100 leading-none mb-1"
                    >
                      {sanitizeText(peak.hour)}
                    </Text>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Horário popular
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  {peak.count} agendamentos
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
