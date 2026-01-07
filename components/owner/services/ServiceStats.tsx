"use client";

import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { ToolOutlined, CheckCircleOutlined, StopOutlined } from "@ant-design/icons";

interface ServiceStatsProps {
  total: number;
  active: number;
  inactive: number;
  avgPrice: number;
}

export const ServiceStats: React.FC<ServiceStatsProps> = ({
  total,
  active,
  inactive,
  avgPrice,
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={12} sm={6}>
        <Card className="text-center" size="small">
          <Statistic 
            title="Total" 
            value={total} 
            prefix={<ToolOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card className="text-center" size="small">
          <Statistic 
            title="Ativos" 
            value={active} 
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card className="text-center" size="small">
          <Statistic 
            title="Inativos" 
            value={inactive} 
            prefix={<StopOutlined />}
            valueStyle={{ color: "#8c8c8c" }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card className="text-center" size="small">
          <Statistic 
            title="Preço Médio" 
            value={avgPrice} 
            precision={2}
            prefix="R$"
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
    </Row>
  );
};
