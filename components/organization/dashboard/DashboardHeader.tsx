"use client";

import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardHeaderProps {
  organizationName: string;
  shopsCount: number;
  organizationId: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  organizationName,
  shopsCount,
  organizationId,
}) => {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
        Olá, {user?.firstName}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight truncate">
            {organizationName}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl text-sm sm:text-base">
            Gerencie seus {shopsCount} estabelecimentos e acompanhe o desempenho em tempo real.
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-indigo-600 border-indigo-500 hover:!bg-indigo-500 font-medium min-h-[44px] px-6 rounded-lg shadow-lg shadow-indigo-900/20 shrink-0 w-full sm:w-auto"
          onClick={() => router.push(`/organization/${organizationId}/shops/new`)}
        >
          Novo Shop
        </Button>
      </div>
    </div>
  );
};
