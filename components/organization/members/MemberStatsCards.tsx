"use client";

import React from "react";
import { TeamOutlined, UserOutlined, CrownOutlined, ShopOutlined } from "@ant-design/icons";

interface MemberStatsCardsProps {
  totalMembers: number;
  managerCount: number;
  employeeCount: number;
  shopCount?: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
  iconBg: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, accent, iconBg }) => (
  <div className={`bg-white dark:bg-zinc-900 rounded-2xl border-l-4 ${accent} border border-zinc-200 dark:border-zinc-800 p-5 flex items-center gap-4 shadow-sm`}>
    <div className={`${iconBg} p-3 rounded-xl flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
    </div>
  </div>
);

export const MemberStatsCards: React.FC<MemberStatsCardsProps> = ({
  totalMembers,
  managerCount,
  employeeCount,
  shopCount,
}) => {
  const cards: StatCardProps[] = [
    {
      icon: <TeamOutlined className="text-xl text-indigo-600 dark:text-indigo-400" />,
      label: "Total de Membros",
      value: totalMembers,
      accent: "border-l-indigo-500",
      iconBg: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      icon: <CrownOutlined className="text-xl text-amber-600 dark:text-amber-400" />,
      label: "Gerentes",
      value: managerCount,
      accent: "border-l-amber-500",
      iconBg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      icon: <UserOutlined className="text-xl text-emerald-600 dark:text-emerald-400" />,
      label: "Funcionários",
      value: employeeCount,
      accent: "border-l-emerald-500",
      iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    ...(shopCount !== undefined ? [{
      icon: <ShopOutlined className="text-xl text-rose-600 dark:text-rose-400" />,
      label: "Estabelecimentos",
      value: shopCount,
      accent: "border-l-rose-500",
      iconBg: "bg-rose-50 dark:bg-rose-900/20",
    }] : []),
  ];

  return (
    <div className={`grid gap-4 ${shopCount !== undefined ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"}`}>
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
};
