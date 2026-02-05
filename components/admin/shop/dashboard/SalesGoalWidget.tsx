"use client";

import React from "react";
import { Card, Progress, Button, Typography, Tooltip } from "antd";
import { RiseOutlined, PlusOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useShopSalesGoals } from "@/hooks/useSalesGoals";
import { useRouter } from "next/navigation";
import { isWithinInterval, parseISO } from "date-fns";

const { Title, Text } = Typography;

interface SalesGoalWidgetProps {
  shopId: string;
  currentRevenue: number;
}

export const SalesGoalWidget: React.FC<SalesGoalWidgetProps> = ({ shopId, currentRevenue }) => {
  const router = useRouter();
  const { data: salesGoalsData, isLoading } = useShopSalesGoals(shopId);

  // Ensure salesGoals is an array to prevent runtime errors
  const salesGoals = Array.isArray(salesGoalsData) ? salesGoalsData : [];

  // Find the active goal for the current date
  const activeGoal = salesGoals.find(goal => {
    const now = new Date();
    return isWithinInterval(now, {
      start: parseISO(goal.startDate),
      end: parseISO(goal.endDate)
    });
  });

  if (isLoading) {
    return <Card loading className="w-full h-full rounded-2xl border-zinc-200 dark:border-zinc-800" />;
  }

  // If no active goal, show CTA
  if (!activeGoal) {
    return (
      <div className="space-y-4">
        <Card 
          className="w-full h-full rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden"
          styles={{ body: { padding: 0, height: '100%' } }}
        >
          <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 to-white dark:from-zinc-900 dark:to-zinc-900 p-6 relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <RiseOutlined style={{ fontSize: '120px' }} />
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                <RiseOutlined className="text-xl" />
              </div>
              <Title level={4} className="!m-0 text-zinc-800 dark:text-zinc-100">Meta Mensal</Title>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center text-center z-10 my-4">
              <Text className="text-zinc-500 dark:text-zinc-400 mb-4 text-base block">
                Você ainda não definiu uma meta de vendas para este mês.
              </Text>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => router.push(`/admin/shop/${shopId}/sales-goals`)}
                className="bg-indigo-600 hover:!bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-900/20"
              >
                Definir Meta Agora
              </Button>
            </div>
            
            <div className="text-xs text-zinc-400 dark:text-zinc-600 text-center">
              Definir metas ajuda a manter o foco e crescimento do seu negócio.
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Calculate percentage
  const percent = Math.min(Math.round((currentRevenue / activeGoal.amount) * 100), 100);
  const remaining = Math.max(activeGoal.amount - currentRevenue, 0);

  return (
    <div className="space-y-4">
            <Card 
        className="w-full rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden"
        styles={{ body: { padding: 0 } }}
      >
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white relative overflow-hidden">
          <div className="absolute top-[-20px] right-[-20px] opacity-10 rotate-12">
            <RiseOutlined style={{ fontSize: '150px', color: 'white' }} />
          </div>
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <div className="text-indigo-100 font-medium mb-1 flex items-center gap-1">
                Receita Mensal
                <Tooltip title="Soma total dos serviços concluídos neste mês">
                  <InfoCircleOutlined className="opacity-70 hover:opacity-100 cursor-help" />
                </Tooltip>
              </div>
              <div className="text-3xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentRevenue)}
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold border border-white/10">
              {percent}% atingida
            </div>
          </div>

          <div className="mb-2 relative z-10">
            <Progress 
              percent={percent} 
              showInfo={false} 
              strokeColor="white" 
              trailColor="rgba(255,255,255,0.2)" 
              size="small"
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-indigo-100">
              <span>Meta: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(activeGoal.amount)}</span>
              <span>Faltam: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(remaining)}</span>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-white dark:bg-zinc-900 flex justify-between items-center">
          <div className="text-zinc-500 dark:text-zinc-400 text-sm">
            Acompanhe seu progresso diário
          </div>
          <Button 
            type="link" 
            size="small" 
            onClick={() => router.push(`/admin/shop/${shopId}/sales-goals`)}
            className="p-0 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            Gerenciar Metas
          </Button>
        </div>
      </Card>
    </div>
  );
};
