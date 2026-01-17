"use client";

import React from "react";
import { Row, Col, Statistic } from "antd";

interface ServicesStatsProps {
  total: number;
  active: number;
  inactive: number;
  avgPrice: number;
}

export const ServicesStats: React.FC<ServicesStatsProps> = ({ total, active, inactive, avgPrice }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={12} sm={6}>
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 text-center border border-zinc-100 dark:border-zinc-700 transition-colors">
          <Statistic 
            title={<span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wide">Total</span>}
            value={total} 
            valueStyle={{ fontWeight: 600 }}
            className="[&_.ant-statistic-content-value]:text-blue-600 dark:[&_.ant-statistic-content-value]:text-blue-400"
          />
        </div>
      </Col>
      <Col xs={12} sm={6}>
        <div className="bg-green-50/50 dark:bg-green-900/10 rounded-lg p-4 text-center border border-green-100 dark:border-green-900/20 transition-colors">
          <Statistic 
            title={<span className="text-green-600/70 dark:text-green-400/70 text-xs font-medium uppercase tracking-wide">Ativos</span>}
            value={active} 
            valueStyle={{ fontWeight: 600 }}
            className="[&_.ant-statistic-content-value]:text-green-600 dark:[&_.ant-statistic-content-value]:text-green-400"
          />
        </div>
      </Col>
      <Col xs={12} sm={6}>
        <div className="bg-orange-50/50 dark:bg-orange-900/10 rounded-lg p-4 text-center border border-orange-100 dark:border-orange-900/20 transition-colors">
          <Statistic 
            title={<span className="text-orange-600/70 dark:text-orange-400/70 text-xs font-medium uppercase tracking-wide">Inativos</span>}
            value={inactive} 
            valueStyle={{ fontWeight: 600 }}
            className="[&_.ant-statistic-content-value]:text-orange-500 dark:[&_.ant-statistic-content-value]:text-orange-400"
          />
        </div>
      </Col>
      <Col xs={12} sm={6}>
        <div className="bg-purple-50/50 dark:bg-purple-900/10 rounded-lg p-4 text-center border border-purple-100 dark:border-purple-900/20 transition-colors">
          <Statistic 
            title={<span className="text-purple-600/70 dark:text-purple-400/70 text-xs font-medium uppercase tracking-wide">Preço Médio</span>}
            value={avgPrice} 
            precision={2} 
            prefix="R$" 
            valueStyle={{ fontWeight: 600 }}
            className="[&_.ant-statistic-content-value]:text-purple-600 dark:[&_.ant-statistic-content-value]:text-purple-400 [&_.ant-statistic-content-prefix]:text-purple-600 dark:[&_.ant-statistic-content-prefix]:text-purple-400"
          />
        </div>
      </Col>
    </Row>
  );
};