"use client";

import React from "react";
import { Card, Typography, Progress } from "antd";
import { TrophyOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface PerformanceCardProps {
  completionRate: number;
  stats: {
    completed: number;
    inProgress: number;
    pending: number;
    confirmed: number;
  };
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({ completionRate, stats }) => {
  return (
    <div className="space-y-4">
            <Card variant='borderless' className="rounded-2xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-3">
            <TrophyOutlined className="text-3xl text-yellow-500" />
          </div>
          <Title level={5} className="!mb-1 dark:!text-white">Performance do Dia</Title>
          <Text type="secondary">Taxa de conclusão dos serviços</Text>
        </div>
        
        <div className="flex items-center justify-center py-4">
          <Progress
            type="circle"
            percent={completionRate}
            strokeColor={{
              "0%": "#3b82f6",
              "100%": "#10b981",
            }}
            railColor="rgba(0,0,0,0.05)"
            strokeWidth={10}
            format={(percent) => (
              <div className="text-center">
                <div className="text-3xl font-bold text-zinc-800 dark:text-white">{percent}%</div>
                <div className="text-xs text-zinc-400 uppercase tracking-wide">concluído</div>
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <div className="text-center p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <Text strong className="text-emerald-500 text-xl block">{stats.completed}</Text>
            <div className="text-[10px] text-zinc-400 uppercase font-bold">Concluídos</div>
          </div>
          <div className="text-center p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <Text strong className="text-purple-500 text-xl block">{stats.inProgress}</Text>
            <div className="text-[10px] text-zinc-400 uppercase font-bold">Andamento</div>
          </div>
          <div className="text-center p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <Text strong className="text-orange-500 text-xl block">{stats.pending + stats.confirmed}</Text>
            <div className="text-[10px] text-zinc-400 uppercase font-bold">Fila</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
