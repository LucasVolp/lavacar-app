"use client";

import React from "react";
import { Layout, Menu, Typography, Badge } from "antd";
import { NexoLogo } from "@/components/ui/NexoLogo";
import {
  ShopOutlined,
  ScheduleOutlined,
  CarOutlined,
  StarOutlined,
  SettingOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  StopOutlined,
  TeamOutlined,
  LineChartOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { MenuProps } from "antd";

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

type MenuItem = Required<MenuProps>["items"][number];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const borderColor = isDarkMode
    ? "rgba(255, 255, 255, 0.06)"
    : "rgba(0, 0, 0, 0.04)";
  const shadowColor = isDarkMode
    ? "rgba(0, 0, 0, 0.5)"
    : "rgba(0, 0, 0, 0.08)";

  const menuItems: MenuItem[] = [
    {
      key: "/",
      icon: <DashboardOutlined style={{ fontSize: "18px" }} />,
      label: <span className="font-medium">Início</span>,
    },
    {
      key: "divider-1",
      type: "divider",
      style: { margin: "12px 0" },
    },
    {
      key: "establishment-group",
      type: "group",
      label: collapsed ? null : (
        <span className="text-xs font-semibold uppercase tracking-wider opacity-60 px-2">
          Estabelecimentos
        </span>
      ),
      children: [
        {
          key: "/shop",
          icon: <ShopOutlined style={{ fontSize: "18px", color: "#6366f1" }} />,
          label: (
            <div className="flex items-center justify-between">
              <span className="font-medium">Lojas</span>
              <Badge
                count="Novo"
                style={{
                  backgroundColor: "#52c41a",
                  fontSize: "10px",
                  lineHeight: "16px",
                  height: "16px",
                  padding: "0 6px",
                }}
              />
            </div>
          ),
        },
        {
          key: "/services",
          icon: <AppstoreOutlined style={{ fontSize: "18px", color: "#3b82f6" }} />,
          label: <span className="font-medium">Serviços</span>,
        },
        {
          key: "/schedules",
          icon: <ClockCircleOutlined style={{ fontSize: "18px", color: "#10b981" }} />,
          label: <span className="font-medium">Horários</span>,
        },
        {
          key: "/blocked-times",
          icon: <StopOutlined style={{ fontSize: "18px", color: "#f59e0b" }} />,
          label: <span className="font-medium">Bloqueios</span>,
        },
      ],
    },
    {
      key: "divider-2",
      type: "divider",
      style: { margin: "12px 0" },
    },
    {
      key: "appointments-group",
      type: "group",
      label: collapsed ? null : (
        <span className="text-xs font-semibold uppercase tracking-wider opacity-60 px-2">
          Agendamentos
        </span>
      ),
      children: [
        {
          key: "/appointments",
          icon: <ScheduleOutlined style={{ fontSize: "18px", color: "#8b5cf6" }} />,
          label: <span className="font-medium">Agendamentos</span>,
        },
        {
          key: "/vehicles",
          icon: <CarOutlined style={{ fontSize: "18px", color: "#ec4899" }} />,
          label: <span className="font-medium">Veículos</span>,
        },
        {
          key: "/evaluations",
          icon: <StarOutlined style={{ fontSize: "18px", color: "#f59e0b" }} />,
          label: <span className="font-medium">Avaliações</span>,
        },
      ],
    },
    {
      key: "divider-3",
      type: "divider",
      style: { margin: "12px 0" },
    },
    {
      key: "system-group",
      type: "group",
      label: collapsed ? null : (
        <span className="text-xs font-semibold uppercase tracking-wider opacity-60 px-2">
          Sistema
        </span>
      ),
      children: [
        {
          key: "/insights",
          icon: <LineChartOutlined style={{ fontSize: "18px", color: "#f43f5e" }} />,
          label: (
            <div className="flex items-center justify-between">
              <span className="font-medium">Insights</span>
              <FireOutlined style={{ color: "#f43f5e", fontSize: "12px" }} />
            </div>
          ),
        },
        {
          key: "/users",
          icon: <TeamOutlined style={{ fontSize: "18px", color: "#06b6d4" }} />,
          label: <span className="font-medium">Usuários</span>,
        },
        {
          key: "/settings",
          icon: <SettingOutlined style={{ fontSize: "18px", color: "#64748b" }} />,
          label: <span className="font-medium">Configurações</span>,
        },
      ],
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    router.push(e.key);
  };

  const getSelectedKeys = () => {
    if (pathname === "/") return ["/"];
    const matchedKey = menuItems
      .flatMap((item) => {
        if (item && "children" in item && item.children) {
          return item.children.flatMap((child) => {
            if (child && "children" in child && child.children) {
              return child.children.map((subChild) =>
                subChild && "key" in subChild ? subChild.key : null
              );
            }
            return child && "key" in child ? child.key : null;
          });
        }
        return item && "key" in item ? item.key : null;
      })
      .filter((key): key is string => key !== null && pathname.startsWith(key as string))
      .sort((a, b) => (b as string).length - (a as string).length)[0];

    return matchedKey ? [matchedKey as string] : [pathname];
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      onBreakpoint={(broken) => {
        if (broken) onCollapse(true);
      }}
      width={280}
      collapsedWidth={80}
      className="!fixed left-0 top-0 h-screen z-50"
      style={{
        borderRight: `1px solid ${borderColor}`,
        boxShadow: `4px 0 24px -4px ${shadowColor}`,
        overflow: "hidden",
        background: isDarkMode 
          ? "linear-gradient(180deg, #1a1a2e 0%, #16162a 100%)" 
          : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
      }}
    >
      <div
        className="h-20 flex items-center justify-center gap-3 px-5"
        style={{ 
          borderBottom: `1px solid ${borderColor}`,
          background: isDarkMode 
            ? "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.05) 100%)"
            : "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.03) 100%)"
        }}
      >
        <NexoLogo size={72} />
        {!collapsed && (
          <div className="flex flex-col">
            <Text strong className="text-xl leading-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              NexoCar
            </Text>
            <Text type="secondary" className="text-xs leading-tight">
              Sistema de Gestão de Agendamentos
            </Text>
          </div>
        )}
      </div>

      <div
        className="h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-600"
        style={{
          scrollbarWidth: "thin",
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          onClick={handleMenuClick}
          items={menuItems}
          className="border-none bg-transparent"
          style={{
            paddingTop: "12px",
            paddingBottom: "24px",
          }}
        />
        
        {!collapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor, background: "inherit" }}>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <FireOutlined className="text-white" />
              </div>
              <div className="flex-1">
                <Text strong className="text-sm block">Pro Features</Text>
                <Text type="secondary" className="text-xs">Desbloqueie recursos</Text>
              </div>
            </div>
          </div>
        )}
      </div>
    </Sider>
  );
};

export default Sidebar;
