"use client";

import React from "react";
import { Select, Typography } from "antd";
import { BarChartOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

const { Title, Text } = Typography;

export const InsightsHeader = () => {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-indigo-950 dark:to-black border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm dark:shadow-xl dark:shadow-indigo-900/10 transition-all duration-300">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-5 text-zinc-900 dark:text-white">
        <BarChartOutlined style={{ fontSize: '180px' }} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-indigo-50 dark:bg-white/10 backdrop-blur-md text-indigo-600 dark:text-indigo-100 border border-indigo-100 dark:border-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              Analytics
            </span>
            <span className="flex items-center gap-1 text-zinc-500 dark:text-indigo-200 text-xs font-medium">
              <CalendarOutlined /> {dayjs().format("MMMM YYYY")}
            </span>
          </div>
          
          <Title level={2} className="!text-zinc-900 dark:!text-white !mb-2 !font-bold tracking-tight">
            Insights & Performance
          </Title>
          <Text className="text-zinc-500 dark:text-indigo-200 text-lg max-w-2xl block">
            Acompanhe a evolução do seu negócio com métricas detalhadas em tempo real.
          </Text>
        </div>

        <div className="bg-zinc-50 dark:bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-zinc-200 dark:border-white/20">
          <Select
            defaultValue="30d"
            className="w-40"
            dropdownStyle={{ borderRadius: '12px' }}
            variant="borderless"
            // Remove style={{ color: 'white' }} to let AntD handle colors or override via class if needed
            // But we need to ensure the selected item text is visible in both modes.
            // AntD's default variant="borderless" inherits color.
            options={[
              { value: "7d", label: <span className="text-zinc-700 dark:text-zinc-200">Últimos 7 dias</span> },
              { value: "30d", label: <span className="text-zinc-700 dark:text-zinc-200">Últimos 30 dias</span> },
              { value: "90d", label: <span className="text-zinc-700 dark:text-zinc-200">Últimos 3 meses</span> },
              { value: "ytd", label: <span className="text-zinc-700 dark:text-zinc-200">Este ano</span> },
            ]}
          />
        </div>
      </div>
    </div>
  );
};