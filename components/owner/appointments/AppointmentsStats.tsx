"use client";

import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

interface AppointmentsStatsProps {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  canceled: number;
}

export const AppointmentsStats: React.FC<AppointmentsStatsProps> = ({
  total,
  pending,
  confirmed,
  completed,
  canceled,
}) => {
  return (
    <Row gutter={[16, 16]} className="mb-6">
      <Col xs={12} sm={12} md={6}>
        <Card className="border-base-200">
          <Statistic
            title="Total Hoje"
            value={total}
            prefix={<CalendarOutlined className="text-primary" />}
          />
        </Card>
      </Col>
      <Col xs={12} sm={12} md={6}>
        <Card className="border-base-200">
          <Statistic
            title="Pendentes"
            value={pending}
            prefix={<ClockCircleOutlined className="text-warning" />}
          />
        </Card>
      </Col>
      <Col xs={12} sm={12} md={6}>
        <Card className="border-base-200">
          <Statistic
            title="Confirmados"
            value={confirmed}
            prefix={<CheckCircleOutlined className="text-info" />}
          />
        </Card>
      </Col>
      <Col xs={12} sm={12} md={6}>
        <Card className="border-base-200">
          <Statistic
            title="Concluídos"
            value={completed}
            prefix={<CheckCircleOutlined className="text-success" />}
            suffix={
              canceled > 0 && (
                <span className="text-xs text-error ml-2">
                  <CloseCircleOutlined /> {canceled} cancelados
                </span>
              )
            }
          />
        </Card>
      </Col>
    </Row>
  );
};

export default AppointmentsStats;
