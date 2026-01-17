"use client";

import React from "react";
import { Table, Tag, Typography, Empty } from "antd";
import { StarOutlined, TrophyOutlined, CalendarOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface TopService {
  name: string;
  count: number;
  revenue: number;
}

interface InsightsTopServicesProps {
  topServices: TopService[];
}

export const InsightsTopServices: React.FC<InsightsTopServicesProps> = ({ topServices }) => {
  const columns = [
    {
      title: "Posição",
      key: "position",
      width: 80,
      render: (_: unknown, __: unknown, index: number) => (
        <div className="flex items-center gap-2">
          {index === 0 ? (
            <TrophyOutlined className="text-yellow-500 text-lg" />
          ) : index === 1 ? (
            <TrophyOutlined className="text-gray-400 text-lg" />
          ) : index === 2 ? (
            <TrophyOutlined className="text-amber-700 text-lg" />
          ) : (
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">
              {index + 1}º
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Serviço",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <Text strong className="dark:text-zinc-200">{name}</Text>,
    },
    {
      title: "Agendamentos",
      dataIndex: "count",
      key: "count",
      render: (count: number) => (
        <Tag color="blue" icon={<CalendarOutlined />}>
          {count}
        </Tag>
      ),
    },
    {
      title: "Receita",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue: number) => (
        <Text strong className="text-green-600 dark:text-green-400">
          R$ {revenue.toFixed(2)}
        </Text>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden transition-colors duration-300">
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StarOutlined className="text-yellow-500" />
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">Serviços Mais Populares</span>
        </div>
        <Tag color="blue">{topServices.length}</Tag>
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
            className="dark:[&_.ant-table]:!bg-transparent dark:[&_.ant-table-thead_th]:!bg-zinc-800/50 dark:[&_.ant-table-thead_th]:!text-zinc-300 dark:[&_.ant-table-cell]:!border-zinc-800 dark:[&_.ant-table-tbody_tr:hover>td]:!bg-zinc-800/30"
          />
        )}
      </div>
    </div>
  );
};