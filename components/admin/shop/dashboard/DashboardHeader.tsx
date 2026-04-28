"use client";

import React from "react";
import { Typography, Tooltip } from "antd";
import { CalendarOutlined, GlobalOutlined } from "@ant-design/icons";
import Link from "next/link";
import dayjs from "dayjs";
import 'dayjs/locale/pt-br';
import { Shop } from "@/types/shop";
import { useAuth } from "@/contexts/AuthContext";

dayjs.locale('pt-br');

const { Title, Text } = Typography;

interface DashboardHeaderProps {
  shop: Shop | null;
  totalAppointments: number;
  revenue: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  shop,
  totalAppointments,
  revenue,
}) => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-900 dark:to-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-black/20 transition-all duration-300">
      <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none text-zinc-900 dark:text-white hidden sm:block">
        <CalendarOutlined style={{ fontSize: '150px' }} />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
              Visão Geral
            </span>
            {shop?.slug && (
              <Tooltip title="Ver vitrine digital">
                <Link
                  href={`/shop/${shop.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors whitespace-nowrap"
                >
                  <GlobalOutlined />
                  Vitrine
                </Link>
              </Tooltip>
            )}
          </div>
          <Title level={2} className="!text-zinc-900 dark:!text-white !mb-1 !font-bold tracking-tight !text-xl sm:!text-2xl line-clamp-2">
            Olá, {user?.firstName || "Usuário"}! Bem-vindo ao {shop?.name}
          </Title>
          <Text className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base capitalize">
            {dayjs().format("dddd, DD [de] MMMM [de] YYYY")}
          </Text>
        </div>

        <div className="flex gap-3 sm:flex-col sm:gap-0 bg-zinc-50 dark:bg-white/5 px-4 py-3 rounded-2xl backdrop-blur-sm border border-zinc-200 dark:border-white/10 shrink-0">
          <div className="text-center sm:px-4 sm:border-r-0 border-r border-zinc-200 dark:border-white/10 pr-3 sm:pr-0 sm:pb-3 sm:border-b border-b-0 border-zinc-200 dark:border-white/10">
            <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">{totalAppointments}</div>
            <div className="text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wide">Agendamentos hoje</div>
          </div>
          <div className="text-center pl-3 sm:pl-0 sm:pt-3">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-500 dark:text-emerald-400">
              R$ {revenue.toFixed(0)}
            </div>
            <div className="text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wide">Receita do dia</div>
          </div>
        </div>
      </div>
    </div>
  );
};
