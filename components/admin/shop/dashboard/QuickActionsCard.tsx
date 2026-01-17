"use client";

import React from "react";
import { Card, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Text } = Typography;

interface QuickAction {
  title: string;
  icon: React.ReactNode;
  color: string;
  value: number;
  label: string;
  path: string;
}

interface QuickActionsCardProps {
  actions: QuickAction[];
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ actions }) => {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <Card 
        bordered={false} 
        title={<span className="font-bold dark:text-white">Gerenciamento Rápido</span>}
        className="space-y-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm"
      >
        <div className="space-y-3">
          {actions.map((action) => (
            <div
              key={action.title}
              className="group flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-md cursor-pointer transition-all duration-300"
              onClick={() => router.push(action.path)}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${action.color}15`, color: action.color }}
                >
                  {action.icon}
                </div>
                <div>
                  <Text strong className="block text-base dark:text-zinc-200">{action.title}</Text>
                  <div className="text-xs text-zinc-400">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-300">{action.value}</span> {action.label}
                  </div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                <RightOutlined className="text-zinc-400 text-xs" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
