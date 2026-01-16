"use client";

import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { CarOutlined, CalendarOutlined, HistoryOutlined } from "@ant-design/icons";

interface ClientStatsProps {
  vehiclesCount: number;
  upcomingAppointments: number;
  totalVisits: number;
}

export const ClientStats: React.FC<ClientStatsProps> = ({
  vehiclesCount,
  upcomingAppointments,
  totalVisits,
}) => {
  return (
    <Row gutter={[16, 16]} className="mb-8">
      <Col xs={24} sm={8}>
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl hover:shadow-md transition-shadow duration-300 bg-white dark:bg-[#1f1f23]">
          <Statistic
            title={<span className="text-slate-500 font-medium">Meus Veículos</span>}
            value={vehiclesCount}
            prefix={<div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mr-2"><CarOutlined className="text-indigo-500 text-lg" /></div>}
            styles={{ content: { fontWeight: 700 } }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl hover:shadow-md transition-shadow duration-300 bg-white dark:bg-[#1f1f23]">
          <Statistic
            title={<span className="text-slate-500 font-medium">Agendamentos Pendentes</span>}
            value={upcomingAppointments}
            prefix={<div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mr-2"><CalendarOutlined className="text-emerald-500 text-lg" /></div>}
            valueStyle={{ fontWeight: 700 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl hover:shadow-md transition-shadow duration-300 bg-white dark:bg-[#1f1f23]">
          <Statistic
            title={<span className="text-slate-500 font-medium">Total de Visitas</span>}
            value={totalVisits}
            prefix={<div className="w-10 h-10 rounded-full bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center mr-2"><HistoryOutlined className="text-violet-500 text-lg" /></div>}
            valueStyle={{ fontWeight: 700 }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ClientStats;
