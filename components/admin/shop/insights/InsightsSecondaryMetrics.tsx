"use client";

import React from "react";
import { Row, Col, Typography, Progress } from "antd";
import { TrophyOutlined, FireOutlined, ToolOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface SecondaryMetricsProps {
  metrics: {
    month: {
      completionRate: number;
      cancellationRate: number;
    };
    activeServices: number;
    totalServices: number;
  };
}

export const InsightsSecondaryMetrics: React.FC<SecondaryMetricsProps> = ({ metrics }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={8}>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 h-full flex flex-col items-center justify-center transition-colors duration-300">
          <div className="text-center mb-4">
            <TrophyOutlined className="text-4xl text-yellow-500 mb-2" />
            <Title level={5} className="!mb-1 !text-zinc-900 dark:!text-zinc-100">
              Taxa de Conclusão
            </Title>
            <Text className="text-zinc-500 dark:text-zinc-400 text-xs">
              Agendamentos finalizados com sucesso
            </Text>
          </div>
          <div className="flex items-center justify-center">
            <Progress
              type="circle"
              percent={Math.round(metrics.month.completionRate)}
              strokeColor={{
                "0%": "#52c41a",
                "100%": "#87d068",
              }}
              format={(percent) => (
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{percent}%</div>
                </div>
              )}
            />
          </div>
        </div>
      </Col>
      <Col xs={24} lg={8}>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 h-full flex flex-col items-center justify-center transition-colors duration-300">
          <div className="text-center mb-4">
            <FireOutlined className="text-4xl text-red-500 mb-2" />
            <Title level={5} className="!mb-1 !text-zinc-900 dark:!text-zinc-100">
              Taxa de Cancelamento
            </Title>
            <Text className="text-zinc-500 dark:text-zinc-400 text-xs">
              Incluindo não comparecimentos
            </Text>
          </div>
          <div className="flex items-center justify-center">
            <Progress
              type="circle"
              percent={Math.round(metrics.month.cancellationRate)}
              strokeColor={{
                "0%": "#ff4d4f",
                "100%": "#ff7875",
              }}
              format={(percent) => (
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500 dark:text-red-400">{percent}%</div>
                </div>
              )}
            />
          </div>
        </div>
      </Col>
      <Col xs={24} lg={8}>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 h-full transition-colors duration-300">
          <div className="text-center mb-6">
            <ToolOutlined className="text-4xl text-blue-500 mb-2" />
            <Title level={5} className="!mb-1 !text-zinc-900 dark:!text-zinc-100">
              Serviços
            </Title>
            <Text className="text-zinc-500 dark:text-zinc-400 text-xs">
              Status dos serviços cadastrados
            </Text>
          </div>
          <div className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {metrics.activeServices}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-400 dark:text-zinc-500">
                {metrics.totalServices - metrics.activeServices}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Inativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {metrics.totalServices}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Total</div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};