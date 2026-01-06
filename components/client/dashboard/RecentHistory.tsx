"use client";

import React from "react";
import { Typography, Card, List, Tag, Button } from "antd";
import { HistoryOutlined, ShopOutlined, CheckCircleOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

export interface HistoryItem {
  id: string;
  shop: string;
  service: string;
  date: string;
  status: string;
}

interface RecentHistoryProps {
  history: HistoryItem[];
}

export const RecentHistory: React.FC<RecentHistoryProps> = ({ history }) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <HistoryOutlined className="text-primary" />
          <span>Histórico Recente</span>
        </div>
      }
      extra={
        <Link href="/client/history">
          <Button type="link" size="small">
            Ver completo
          </Button>
        </Link>
      }
      className="border-base-200 mt-6"
    >
      <List
        itemLayout="horizontal"
        dataSource={history}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <div className="w-10 h-10 bg-base-200 rounded-lg flex items-center justify-center">
                  <CheckCircleOutlined className="text-success" />
                </div>
              }
              title={item.service}
              description={
                <div className="flex items-center gap-4">
                  <Text type="secondary" className="text-sm">
                    <ShopOutlined className="mr-1" />
                    {item.shop}
                  </Text>
                  <Text type="secondary" className="text-sm">
                    {item.date}
                  </Text>
                </div>
              }
            />
            <Tag color="green">Concluído</Tag>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentHistory;
