"use client";

import React from "react";
import { Table, Typography, Empty } from "antd";
import { StarOutlined, TrophyOutlined, CalendarOutlined } from "@ant-design/icons";
import { formatCurrency, sanitizeText } from "@/lib/security";

const { Text } = Typography;

interface TopService {
  name: string;
  count: number;
  revenue: number;
}

interface InsightsTopServicesProps {
  topServices: TopService[];
}

export const InsightsTopServices: React.FC<InsightsTopServicesProps> = ({
  topServices
}) => {
  const columns = [
    {
      title: "Posição",
      key: "position",
      width: 100,
      render: (_: unknown, __: unknown, index: number) => (
        <div className="flex items-center gap-2">
          <span className={`font-medium ${index < 3 ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-500 dark:text-zinc-400'}`}>
            {index + 1}º
          </span>
          {index === 0 && <TrophyOutlined className="text-amber-500 text-lg" />}
          {index === 1 && <TrophyOutlined className="text-zinc-400 text-lg" />}
          {index === 2 && <TrophyOutlined className="text-amber-700 text-lg" />}
        </div>
      )
    },
    {
      title: "Serviço",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <Text strong className="dark:text-zinc-200">
          {sanitizeText(name)}
        </Text>
      )
    },
    {
      title: "Agendamentos",
      dataIndex: "count",
      key: "count",
      render: (count: number) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          <CalendarOutlined />
          {count}
        </span>
      )
    },
    {
      title: "Receita",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue: number) => (
        <Text strong className="text-emerald-600 dark:text-emerald-400">
          {formatCurrency(revenue)}
        </Text>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden transition-colors duration-200">
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StarOutlined className="text-amber-500" />
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            Serviços Mais Populares
          </span>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          {topServices.length}
        </span>
      </div>

      <div className="p-4">
        {topServices.length === 0 ? (
          <Empty description="Nenhum dado disponível" />
        ) : (
          <Table
            dataSource={topServices}
            columns={columns}
            rowKey="name"
            pagination={false}
            size="small"
            scroll={{ x: 400 }}
            className="dark:[&_.ant-table]:!bg-transparent dark:[&_.ant-table-thead_th]:!bg-zinc-800/50 dark:[&_.ant-table-thead_th]:!text-zinc-300 dark:[&_.ant-table-cell]:!border-zinc-800 dark:[&_.ant-table-tbody_tr:hover>td]:!bg-zinc-800/30"
          />
        )}
      </div>
    </div>
  );
};
