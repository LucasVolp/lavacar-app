"use client";

import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

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

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
        Visão Geral
      </div>
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {organizationName}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Gerencie seus {shopsCount} estabelecimentos e acompanhe o desempenho em tempo real.
          </p>
        </div>
        <div className="hidden md:block text-right">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-indigo-600 border-indigo-500 hover:!bg-indigo-500 font-medium h-10 px-6 rounded-lg shadow-lg shadow-indigo-900/20"
            onClick={() => router.push(`/organization/${organizationId}/shops/new`)}
          >
            Novo Shop
          </Button>
        </div>
      </div>
    </div>
  );
};
