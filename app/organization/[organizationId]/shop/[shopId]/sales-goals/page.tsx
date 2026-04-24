"use client";

import React, { useState, useMemo } from "react";
import { Button, message, Spin } from "antd";
import {
  PlusOutlined,
  RiseOutlined,
  TrophyOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useShopSalesGoals, useCreateSalesGoal, useUpdateSalesGoal, useDeleteSalesGoal } from "@/hooks/useSalesGoals";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useAuth } from "@/contexts/AuthContext";
import { EmployeeAccessDenied } from "@/components/layout/EmployeeAccessDenied";
import dayjs from "dayjs";
import { SalesGoal } from "@/types/salesGoal";
import { formatCurrency } from "@/lib/security";

import { MetricCard } from "@/components/admin/shop/sales-goals/MetricCard";
import { GoalCard } from "@/components/admin/shop/sales-goals/GoalCard";
import { CreateGoalModal } from "@/components/admin/shop/sales-goals/CreateGoalModal";

export default function SalesGoalsPage() {
  const { shopId, organizationId, shop } = useShopAdmin();
  const { user } = useAuth();

  const isEmployee = (() => {
    if (!user || !organizationId) return false;
    if (user.id === shop?.ownerId) return false;
    if (user.role === "ADMIN") return false;
    if (user.organizations?.some((org: { id: string }) => org.id === organizationId)) return false;
    const membership = user.organizationMembers?.find((m: { organizationId: string; role: string }) => m.organizationId === organizationId);
    return membership?.role === "EMPLOYEE";
  })();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SalesGoal | null>(null);

  const { data: salesGoalsData, isLoading } = useShopSalesGoals(shopId);
  const salesGoals = useMemo(() => salesGoalsData || [], [salesGoalsData]);

  const createGoal = useCreateSalesGoal();
  const updateGoal = useUpdateSalesGoal();
  const deleteGoal = useDeleteSalesGoal();

  const stats = useMemo(() => {
    const now = dayjs();
    const activeGoals = salesGoals.filter(g => now.isAfter(g.startDate) && now.isBefore(g.endDate));
    const totalTarget = activeGoals.reduce((sum, g) => sum + parseFloat(String(g.amount)), 0);
    const futureGoals = salesGoals.filter(g => now.isBefore(g.startDate)).length;
    const completedGoals = salesGoals.filter(g => now.isAfter(g.endDate)).length;

    return {
      total: salesGoals.length,
      active: activeGoals.length,
      future: futureGoals,
      completed: completedGoals,
      totalTarget,
    };
  }, [salesGoals]);

  const handleEdit = (goal: SalesGoal) => {
    setEditingGoal(goal);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGoal.mutateAsync(id);
      message.success("Meta removida com sucesso");
    } catch {
      message.error("Erro ao remover meta");
    }
  };

  const handleOpenNewGoal = () => {
    setEditingGoal(null);
    setIsModalVisible(true);
  };

  if (isEmployee) {
    return <EmployeeAccessDenied shopId={shopId} organizationId={organizationId} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando metas..." />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            Metas de Vendas
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Defina e acompanhe seus objetivos financeiros
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleOpenNewGoal}
          className="!bg-indigo-600 hover:!bg-indigo-500 !shadow-lg !shadow-indigo-600/20 !border-0 !h-11 !px-6 !rounded-xl"
        >
          Nova Meta
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<TrophyOutlined className="text-xl" />}
          label="Total de Metas"
          value={stats.total}
          subtitle="Todas as metas cadastradas"
          color="indigo"
        />
        <MetricCard
          icon={<RiseOutlined className="text-xl" />}
          label="Metas Ativas"
          value={stats.active}
          subtitle="Em andamento agora"
          color="emerald"
        />
        <MetricCard
          icon={<CalendarOutlined className="text-xl" />}
          label="Metas Futuras"
          value={stats.future}
          subtitle="Aguardando início"
          color="amber"
        />
        <MetricCard
          icon={<DollarOutlined className="text-xl" />}
          label="Meta Total Ativa"
          value={formatCurrency(stats.totalTarget)}
          subtitle="Soma das metas em andamento"
          color="zinc"
        />
      </div>

      {salesGoals.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <TrophyOutlined className="text-3xl text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Nenhuma meta cadastrada
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
            Comece definindo suas metas de vendas para acompanhar o desempenho do seu negócio.
          </p>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenNewGoal}
            className="!bg-indigo-600 hover:!bg-indigo-500"
          >
            Criar Primeira Meta
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {salesGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CreateGoalModal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        editingGoal={editingGoal}
        shopId={shopId}
        salesGoals={salesGoals}
        createGoal={createGoal}
        updateGoal={updateGoal}
      />
    </div>
  );
}