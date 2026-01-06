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
    <Row gutter={[16, 16]} className="mb-6">
      <Col xs={12} sm={8}>
        <Card className="border-base-200 text-center">
          <Statistic
            title="Meus Veículos"
            value={vehiclesCount}
            prefix={<CarOutlined className="text-info" />}
          />
        </Card>
      </Col>
      <Col xs={12} sm={8}>
        <Card className="border-base-200 text-center">
          <Statistic
            title="Agendamentos"
            value={upcomingAppointments}
            prefix={<CalendarOutlined className="text-success" />}
            suffix="pendente(s)"
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className="border-base-200 text-center">
          <Statistic
            title="Total de Visitas"
            value={totalVisits}
            prefix={<HistoryOutlined className="text-primary" />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ClientStats;
