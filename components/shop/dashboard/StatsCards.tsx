"use client";

import React from "react";
import { Typography, Card, Row, Col, Statistic } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface StatItem {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: string;
  suffix?: string;
  precision?: number;
}

interface StatsCardsProps {
  todayAppointments: number;
  pendingAppointments: number;
  completedToday: number;
  averageRating: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  todayAppointments,
  pendingAppointments,
  completedToday,
  averageRating,
}) => {
  const completionRate = todayAppointments > 0 
    ? ((completedToday / todayAppointments) * 100).toFixed(1) 
    : "0";

  const stats: StatItem[] = [
    {
      title: "Agendamentos Hoje",
      value: todayAppointments,
      icon: <CalendarOutlined className="text-primary" />,
      change: `+${todayAppointments}`,
    },
    {
      title: "Pendentes",
      value: pendingAppointments,
      icon: <ClockCircleOutlined className="text-warning" />,
      change: "aguardando",
    },
    {
      title: "Concluídos Hoje",
      value: completedToday,
      icon: <CheckCircleOutlined className="text-success" />,
      change: `${completionRate}%`,
    },
    {
      title: "Avaliação Média",
      value: averageRating,
      icon: <StarOutlined className="text-warning" />,
      suffix: "★",
      precision: 1,
    },
  ];

  return (
    <Row gutter={[16, 16]} className="mb-6">
      {stats.map((stat, index) => (
        <Col xs={12} sm={12} lg={6} key={index}>
          <Card className="border-base-200 hover:shadow-md transition-shadow h-full">
            <div className="flex items-start justify-between">
              <div>
                <Text type="secondary" className="text-xs">
                  {stat.title}
                </Text>
                <Statistic
                  value={stat.value}
                  suffix={stat.suffix}
                  precision={stat.precision}
                  valueStyle={{ fontWeight: 700, fontSize: "1.5rem" }}
                />
                <div className="flex items-center gap-1 mt-1">
                  <Text type="secondary" className="text-xs">
                    {stat.change}
                  </Text>
                </div>
              </div>
              <div className="w-10 h-10 bg-base-200 rounded-lg flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCards;
