"use client";

import React from "react";
import { Button } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import Link from "next/link";

interface DashboardHeaderProps {
  userName: string;
  lastShopInfo?: { name: string; slug: string } | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  lastShopInfo,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 m-0 tracking-tight">
          {getGreeting()}, {userName}.
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
          Vamos cuidar do seu veículo hoje?
        </p>
      </div>

      <div className="flex gap-3 shrink-0">
        {lastShopInfo ? (
          <Link href={`/shop/${lastShopInfo.slug}/booking`}>
            <Button
              type="primary"
              icon={<RedoOutlined />}
              className="bg-indigo-600 hover:bg-indigo-500 border-0 rounded-xl min-h-[44px] px-4 sm:px-6 font-semibold shadow-lg shadow-indigo-500/20 transition-all duration-200 max-w-[220px] sm:max-w-none"
            >
              <span className="truncate block">Reagendar em {lastShopInfo.name}</span>
            </Button>
          </Link>
        ) : (
          <div className="hidden md:block text-sm text-slate-400 italic max-w-xs text-right">
            Para realizar um novo agendamento, utilize o link fornecido pelo seu estabelecimento de confiança.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
