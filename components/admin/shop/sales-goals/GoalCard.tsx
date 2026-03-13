import React from "react";
import {
  EditOutlined,
  DeleteOutlined,
  TrophyOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CheckOutlined
} from "@ant-design/icons";
import { Button, Popconfirm, Progress } from "antd";
import dayjs from "dayjs";
import { SalesGoal } from "@/types/salesGoal";
import { formatCurrency } from "@/lib/security";

interface GoalCardProps {
  goal: SalesGoal;
  onEdit: (goal: SalesGoal) => void;
  onDelete: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  const now = dayjs();
  const start = dayjs(goal.startDate);
  const end = dayjs(goal.endDate);
  const isActive = now.isAfter(start) && now.isBefore(end);
  const isPast = now.isAfter(end);

  const targetAmount = parseFloat(String(goal.amount));
  const currentAmount = goal.currentSales ? Number(goal.currentSales) : 0;
  
  const rawPercent = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
  const progressPercent = Math.min(Math.round(rawPercent), 100);
  const isCompleted = currentAmount >= targetAmount;

  const getStatusConfig = () => {
    if (isCompleted) return {
      label: "Concluída",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      icon: <TrophyOutlined />
    };
    if (isActive) return {
      label: "Em Andamento",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      icon: <ClockCircleOutlined />
    };
    if (isPast) return {
      label: "Finalizada",
      color: "text-zinc-500 dark:text-zinc-400",
      bg: "bg-zinc-100 dark:bg-zinc-800",
      icon: <CheckCircleOutlined />
    };
    return {
      label: "Futura",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/30",
      icon: <CalendarOutlined />
    };
  };

  const status = getStatusConfig();

  return (
    <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 ${isPast && !isCompleted ? 'opacity-70' : ''} ${isCompleted ? 'ring-1 ring-emerald-500/30 dark:ring-emerald-400/30' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            isCompleted 
              ? 'bg-emerald-100 dark:bg-emerald-900/30' 
              : isActive 
                ? 'bg-indigo-100 dark:bg-indigo-900/30' 
                : 'bg-zinc-100 dark:bg-zinc-800'
          }`}>
            <TrophyOutlined className={`text-xl ${
              isCompleted 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : isActive 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-zinc-500 dark:text-zinc-400'
            }`} />
          </div>
          <div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
              {status.icon}
              {status.label}
            </span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {goal.period === 'MONTHLY' ? 'Meta Mensal' : goal.period === 'WEEKLY' ? 'Meta Semanal' : 'Meta Personalizada'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(goal)}
            className="text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400"
            size="small"
          />
          <Popconfirm
            title="Excluir meta"
            description="Tem certeza que deseja excluir esta meta?"
            onConfirm={() => onDelete(goal.id)}
            okText="Sim"
            cancelText="Não"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400"
              size="small"
            />
          </Popconfirm>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-medium mb-1">
          Meta de Faturamento
        </p>
        <div className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          {formatCurrency(goal.amount)}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Progresso
          </span>
          <span className={`text-sm font-bold ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
            {progressPercent}% {isCompleted && <CheckOutlined />}
          </span>
        </div>
        <Progress
          percent={progressPercent}
          showInfo={false}
          strokeColor={isCompleted ? {
            '0%': '#10b981',
            '100%': '#059669',
          } : {
            '0%': '#6366f1',
            '100%': '#8b5cf6',
          }}
          trailColor={isPast ? '#d4d4d8' : '#e4e4e7'}
          className="[&_.ant-progress-inner]:!bg-zinc-200 dark:[&_.ant-progress-inner]:!bg-zinc-700"
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Atual: <span className={`font-semibold ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'}`}>{formatCurrency(currentAmount)}</span>
          </span>
          {!isCompleted && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Faltam: <span className="font-semibold">{formatCurrency(Math.max(0, targetAmount - currentAmount))}</span>
            </span>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <CalendarOutlined />
          <span>
            {start.format("DD/MM/YYYY")} — {end.format("DD/MM/YYYY")}
          </span>
        </div>
      </div>
    </div>
  );
};
