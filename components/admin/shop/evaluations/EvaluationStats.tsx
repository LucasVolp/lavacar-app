"use client";

import React from "react";
import { Card, Progress, Rate, Typography } from "antd";
import { StarFilled } from "@ant-design/icons";

const { Text } = Typography;

interface EvaluationStatsProps {
  stats: {
    averageRating: number;
    totalEvaluations: number;
    ratingDistribution: Record<number, number>;
  };
  isLoading?: boolean;
}

export const EvaluationStats: React.FC<EvaluationStatsProps> = ({ stats, isLoading }) => {
  return (
    <Card 
      className="border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden"
      loading={isLoading}
      styles={{ body: { padding: '24px' } }}
    >
      <div className="flex flex-col gap-6">
        {/* Média Geral */}
        <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
           <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
             {stats.averageRating.toFixed(1)}
           </div>
           <Rate disabled allowHalf value={stats.averageRating} className="text-yellow-500 my-2 text-sm" />
           <Text className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
             Média Geral
           </Text>
        </div>

        {/* Barras de Distribuição */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.ratingDistribution[star] || 0;
            const percent = stats.totalEvaluations > 0 ? (count / stats.totalEvaluations) * 100 : 0;
            
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 w-8 text-zinc-600 dark:text-zinc-400 font-medium">
                  {star} <StarFilled className="text-[10px] text-zinc-300 dark:text-zinc-600" />
                </div>
                <Progress 
                  percent={percent} 
                  showInfo={false} 
                  strokeColor="#eab308" 
                  trailColor="rgba(0,0,0,0.04)"
                  size="small"
                  className="!m-0 flex-1"
                  strokeWidth={6}
                />
                <div className="w-6 text-right text-zinc-400">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <Text type="secondary" className="text-xs">
                Baseado em {stats.totalEvaluations} avaliações
            </Text>
        </div>
      </div>
    </Card>
  );
};
