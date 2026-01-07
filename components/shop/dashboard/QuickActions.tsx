"use client";

import React from "react";
import { Typography, Card, Space } from "antd";
import {
  SettingOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  EditOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const defaultActions: QuickAction[] = [
  {
    title: "Gerenciar Serviços",
    description: "Preços e durações",
    icon: <SettingOutlined />,
    href: "/owner/services",
  },
  {
    title: "Horários",
    description: "Funcionamento e intervalos",
    icon: <ClockCircleOutlined />,
    href: "/owner/schedules",
  },
  {
    title: "Bloqueios",
    description: "Feriados e imprevistos",
    icon: <SyncOutlined />,
    href: "/owner/blocked-times",
  },
  {
    title: "Configurações",
    description: "Dados do estabelecimento",
    icon: <EditOutlined />,
    href: "/owner/settings",
  },
];

interface QuickActionsProps {
  actions?: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions = defaultActions }) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <RiseOutlined className="text-success" />
          <span>Ações Rápidas</span>
        </div>
      }
      className="border-base-200 h-full"
    >
      <Space direction="vertical" className="w-full" size="small">
        {actions.map((action, index) => (
          <Link href={action.href} key={index} className="block">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                {action.icon}
              </div>
              <div className="flex-grow">
                <Text strong className="block text-sm">
                  {action.title}
                </Text>
                <Text type="secondary" className="text-xs">
                  {action.description}
                </Text>
              </div>
            </div>
          </Link>
        ))}
      </Space>
    </Card>
  );
};

export default QuickActions;
