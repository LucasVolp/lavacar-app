"use client";

import React from "react";
import { Layout, Menu, Typography, Badge } from "antd";
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
      width={260}
      collapsedWidth={80}
      className="fixed left-0 top-0 h-screen z-50"
      style={{
        borderRight: `1px solid ${borderColor}`,
        boxShadow: `1px 0 3px 0 ${shadowColor}`,
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        className="h-16 flex items-center justify-center gap-3 px-4 border-b"
        style={{ borderColor }}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">L</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <Text strong className="text-lg leading-tight">
              Lavacar
            </Text>
            <Text type="secondary" className="text-xs leading-tight">
              Sistema de Agendamentos
            </Text>
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden">
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          onClick={handleMenuClick}
          items={menuItems}
          className="border-none"
          style={{
            paddingTop: "8px",
            paddingBottom: "16px",
          }}
        />
      </div>
    </Sider>
  );
};

export default Sidebar;
