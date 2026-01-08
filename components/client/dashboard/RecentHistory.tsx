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
          <HistoryOutlined className="text-violet-500 text-lg" />
          <span className="font-semibold text-lg">Histórico Recente</span>
        </div>
      }
      extra={
        <Link href="/client/history">
          <Button type="text" size="small" className="text-slate-500 hover:text-violet-500 font-medium">
            Ver completo
          </Button>
        </Link>
      }
      className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden mt-8"
    >
      <List
        itemLayout="horizontal"
        dataSource={history}
        renderItem={(item) => (
          <div className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-[#27272a] transition-colors -mx-2 px-2 rounded-lg">
             <div className="w-10 h-10 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center shrink-0">
               <CheckCircleOutlined className="text-violet-500" />
             </div>
             
             <div className="flex-grow min-w-0">
               <Text strong className="block text-slate-700 dark:text-slate-200 truncate">
                 {item.service}
               </Text>
               <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 truncate">
                    <ShopOutlined /> {item.shop}
                  </span>
                  <span>•</span>
                  <span>{item.date}</span>
               </div>
             </div>
             
             <div className="shrink-0">
                <Tag color="green" className="m-0 border-0 rounded-full font-bold px-2 text-[10px] uppercase">
                    {item.status || 'Concluído'}
                </Tag>
             </div>
          </div>
        )}
      />
    </Card>
  );
};

export default RecentHistory;
