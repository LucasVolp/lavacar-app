"use client";

import React from "react";
import { Row, Col } from "antd";
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  BranchesOutlined,
} from "@ant-design/icons";
import { formatCurrency } from "./serviceUi";

interface ServicesStatsProps {
  total: number;
  active: number;
  inactive: number;
  avgPrice: number;
  budgetOnly: number;
  withVariants: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string | number;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconBg,
  title,
  value,
  valueColor = "text-zinc-900 dark:text-zinc-100",
}) => (
  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center hover:shadow-md transition-shadow duration-200">
    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${iconBg} mb-3`}>
      {icon}
    </div>
    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
      {title}
    </p>
    <p className={`text-2xl font-bold m-0 ${valueColor}`}>{value}</p>
  </div>
);

export const ServicesStats: React.FC<ServicesStatsProps> = ({
  total,
  active,
  inactive,
  avgPrice,
  budgetOnly,
  withVariants,
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={12} sm={8} lg={4}>
        <StatCard
          icon={<AppstoreOutlined className="text-lg text-blue-600 dark:text-blue-400" />}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          title="Total"
          value={total}
          valueColor="text-blue-600 dark:text-blue-400"
        />
      </Col>
      <Col xs={12} sm={8} lg={4}>
        <StatCard
          icon={<CheckCircleOutlined className="text-lg text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          title="Ativos"
          value={active}
          valueColor="text-emerald-600 dark:text-emerald-400"
        />
      </Col>
      <Col xs={12} sm={8} lg={4}>
        <StatCard
          icon={<CloseCircleOutlined className="text-lg text-amber-600 dark:text-amber-400" />}
          iconBg="bg-amber-100 dark:bg-amber-900/30"
          title="Inativos"
          value={inactive}
          valueColor="text-amber-600 dark:text-amber-400"
        />
      </Col>
      <Col xs={12} sm={8} lg={4}>
        <StatCard
          icon={<DollarOutlined className="text-lg text-indigo-600 dark:text-indigo-400" />}
          iconBg="bg-indigo-100 dark:bg-indigo-900/30"
          title="Preço Médio"
          value={formatCurrency(avgPrice)}
          valueColor="text-indigo-600 dark:text-indigo-400"
        />
      </Col>
      <Col xs={12} sm={8} lg={4}>
        <StatCard
          icon={<FileTextOutlined className="text-lg text-orange-600 dark:text-orange-400" />}
          iconBg="bg-orange-100 dark:bg-orange-900/30"
          title="Orçamento"
          value={budgetOnly}
          valueColor="text-orange-600 dark:text-orange-400"
        />
      </Col>
      <Col xs={12} sm={8} lg={4}>
        <StatCard
          icon={<BranchesOutlined className="text-lg text-cyan-600 dark:text-cyan-400" />}
          iconBg="bg-cyan-100 dark:bg-cyan-900/30"
          title="Com Variações"
          value={withVariants}
          valueColor="text-cyan-600 dark:text-cyan-400"
        />
      </Col>
    </Row>
  );
};
