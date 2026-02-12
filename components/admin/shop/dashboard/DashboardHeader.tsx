"use client";

import React from "react";
import { Row, Col, Typography, Space } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
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
    <div className="relative overflow-hidden bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-900 dark:to-black rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-black/20 transition-all duration-300">
      <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none text-zinc-900 dark:text-white">
        <CalendarOutlined style={{ fontSize: '150px' }} />
      </div>
      
      <Row justify="space-between" align="middle" className="relative z-10">
        <Col>
          <Space orientation="vertical" size={2}>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                Visão Geral
              </span>
            </div>
            <Title level={2} className="!text-zinc-900 dark:!text-white !mb-1 !font-bold tracking-tight">
               Olá, {user?.firstName || "Usuário"}! Bem-vindo ao {shop?.name}
            </Title>
            <Text className="text-zinc-500 dark:text-zinc-400 text-lg">
              {dayjs().format("dddd, DD [de] MMMM [de] YYYY")}
            </Text>
          </Space>
        </Col>
        <Col className="hidden md:block">
          <Space size="large" className="bg-zinc-50 dark:bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-zinc-200 dark:border-white/10">
            <div className="text-center px-4 border-r border-zinc-200 dark:border-white/10">
              <div className="text-3xl font-bold text-zinc-900 dark:text-white">{totalAppointments}</div>
              <div className="text-zinc-500 dark:text-zinc-400 text-sm font-medium uppercase tracking-wide">Agendamentos hoje</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-emerald-500 dark:text-emerald-400">
                R$ {revenue.toFixed(0)}
              </div>
              <div className="text-zinc-500 dark:text-zinc-400 text-sm font-medium uppercase tracking-wide">Receita do dia</div>
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  );
};
