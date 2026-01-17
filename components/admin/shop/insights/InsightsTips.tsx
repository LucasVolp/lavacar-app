"use client";

import React from "react";
import { Row, Col } from "antd";
import {
  ThunderboltOutlined,
  FallOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";

interface InsightsTipsProps {
  metrics: {
    month: {
      cancellationRate: number;
      completionRate: number;
      avgTicket: number;
    };
    peakHours: { hour: string; count: number }[];
  };
}

export const InsightsTips: React.FC<InsightsTipsProps> = ({ metrics }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors duration-300">
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
        <ThunderboltOutlined className="text-yellow-500" />
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">Insights Automáticos</span>
      </div>

      <div className="p-6">
        <Row gutter={[16, 16]}>
          {metrics.month.cancellationRate > 20 && (
            <Col xs={24} md={12}>
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 flex items-start gap-3 transition-colors">
                <FallOutlined className="text-xl text-red-500 dark:text-red-400 mt-1" />
                <div>
                  <div className="font-semibold text-red-700 dark:text-red-300">Alta taxa de cancelamento</div>
                  <div className="text-sm text-red-600 dark:text-red-400/80 mt-1 leading-relaxed">
                    Sua taxa de cancelamento está em{" "}
                    {metrics.month.cancellationRate.toFixed(0)}%. Considere implementar
                    lembretes automáticos ou política de confirmação.
                  </div>
                </div>
              </div>
            </Col>
          )}
          {metrics.month.completionRate > 80 && (
            <Col xs={24} md={12}>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 flex items-start gap-3 transition-colors">
                <TrophyOutlined className="text-xl text-green-500 dark:text-green-400 mt-1" />
                <div>
                  <div className="font-semibold text-green-700 dark:text-green-300">Excelente taxa de conclusão!</div>
                  <div className="text-sm text-green-600 dark:text-green-400/80 mt-1 leading-relaxed">
                    Parabéns! Sua taxa de conclusão de{" "}
                    {metrics.month.completionRate.toFixed(0)}% está acima da média do
                    setor.
                  </div>
                </div>
              </div>
            </Col>
          )}
          {metrics.peakHours.length > 0 && (
            <Col xs={24} md={12}>
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 flex items-start gap-3 transition-colors">
                <ClockCircleOutlined className="text-xl text-blue-500 dark:text-blue-400 mt-1" />
                <div>
                  <div className="font-semibold text-blue-700 dark:text-blue-300">Horário de pico identificado</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400/80 mt-1 leading-relaxed">
                    O horário das {metrics.peakHours[0]?.hour} é o mais movimentado.
                    Considere ajustar a equipe ou bloquear menos horários neste período.
                  </div>
                </div>
              </div>
            </Col>
          )}
          {metrics.month.avgTicket > 0 && (
            <Col xs={24} md={12}>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-900/30 flex items-start gap-3 transition-colors">
                <DollarOutlined className="text-xl text-purple-500 dark:text-purple-400 mt-1" />
                <div>
                  <div className="font-semibold text-purple-700 dark:text-purple-300">Ticket médio</div>
                  <div className="text-sm text-purple-600 dark:text-purple-400/80 mt-1 leading-relaxed">
                    Seu ticket médio é de R$ {metrics.month.avgTicket.toFixed(2)}.
                    Ofereça combos ou serviços adicionais para aumentar esse valor.
                  </div>
                </div>
              </div>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};