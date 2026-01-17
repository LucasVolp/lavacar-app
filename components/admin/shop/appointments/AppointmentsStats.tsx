"use client";

import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import { DollarOutlined } from "@ant-design/icons";

interface StatsProps {
  stats: {
    total: number;
    pending: number;
    confirmed: number;
    inProgress: number;
    completed: number;
    revenue: number;
  };
}

export const AppointmentsStats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={12} sm={8} lg={4}>
        <Card className="text-center hover:shadow-md transition-shadow">
          <Statistic title="Total" value={stats.total} valueStyle={{ color: "#1890ff" }} />
        </Card>
      </Col>
      <Col xs={12} sm={8} lg={4}>
        <Card className="text-center hover:shadow-md transition-shadow">
          <Statistic title="Pendentes" value={stats.pending} valueStyle={{ color: "#fa8c16" }} />
        </Card>
      </Col>
      <Col xs={12} sm={8} lg={4}>
        <Card className="text-center hover:shadow-md transition-shadow">
          <Statistic title="Confirmados" value={stats.confirmed} valueStyle={{ color: "#1890ff" }} />
        </Card>
      </Col>
      <Col xs={12} sm={8} lg={4}>
        <Card className="text-center hover:shadow-md transition-shadow">
          <Statistic title="Em Andamento" value={stats.inProgress} valueStyle={{ color: "#722ed1" }} />
        </Card>
      </Col>
      <Col xs={12} sm={8} lg={4}>
        <Card className="text-center hover:shadow-md transition-shadow">
          <Statistic title="Concluídos" value={stats.completed} valueStyle={{ color: "#52c41a" }} />
        </Card>
      </Col>
      <Col xs={12} sm={8} lg={4}>
        <Card className="text-center hover:shadow-md transition-shadow">
          <Statistic
            title="Receita"
            value={stats.revenue}
            precision={2}
            prefix={<DollarOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
    </Row>
  );
};
