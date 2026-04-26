"use client";

import React from "react";
import { Row, Col } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import { CustomTooltip } from "@/components/ui";

interface DailyCount {
  day: string;
  count: number;
}

interface InsightsWeeklyDistributionProps {
  data: DailyCount[];
}

export const InsightsWeeklyDistribution: React.FC<InsightsWeeklyDistributionProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors duration-300">
      <div className="px-4 sm:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2 flex-wrap">
        <BarChartOutlined className="text-blue-500" />
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">Agendamentos por Dia da Semana</span>
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          Este Mês
        </span>
      </div>

      <div className="p-4 sm:p-6">
        <Row gutter={[8, 8]} justify="center">
          {data.map((item) => {
            const maxCount = Math.max(...data.map((d) => d.count));
            const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

            return (
              <Col
                xs={12}
                sm={8}
                md={6}
                lg={{ flex: "14.28%" }}
                key={item.day}
                className="flex flex-col"
              >
                <CustomTooltip title={`${item.count} agendamentos`}>
                  <div className="text-center w-full group">
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide">
                      {item.day.slice(0, 3)}
                    </div>
                    <div className="relative h-32 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-500 ease-out"
                        style={{ height: `${percentage}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {item.count > 0 && (
                          <span
                            className={`text-lg font-bold drop-shadow-sm transition-colors ${
                              percentage > 50 
                                ? "text-white" 
                                : "text-zinc-600 dark:text-zinc-300"
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CustomTooltip>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};