"use client";

import React from "react";
import { Row, Col } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Weekday } from "./types";

interface SchedulesSummaryProps {
  openDays: { key: Weekday; label: string; short: string }[];
  closedDays: { key: Weekday; label: string; short: string }[];
}

export const SchedulesSummary: React.FC<SchedulesSummaryProps> = ({
  openDays,
  closedDays,
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-lg p-6 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <CheckCircleOutlined className="text-2xl text-green-600 dark:text-green-400" />
            <div>
              <div className="text-base font-semibold text-green-700 dark:text-green-300">
                Dias Abertos
              </div>
              <div className="text-green-600 dark:text-green-400/80">
                {openDays.length === 0
                  ? "Nenhum dia configurado"
                  : openDays.map((d) => d.short).join(", ")}
              </div>
            </div>
          </div>
        </div>
      </Col>
      <Col xs={24} md={12}>
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <CloseCircleOutlined className="text-2xl text-zinc-400 dark:text-zinc-500" />
            <div>
              <div className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
                Dias Fechados
              </div>
              <div className="text-zinc-500 dark:text-zinc-500">
                {closedDays.length === 0
                  ? "Aberto todos os dias"
                  : closedDays.map((d) => d.short).join(", ")}
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};