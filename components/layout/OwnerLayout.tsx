"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Typography, Badge, Button, Avatar, Dropdown } from "antd";
import {
  ShopOutlined,
  CalendarOutlined,
  SettingOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  StopOutlined,
  StarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { MenuProps } from "antd";

const { Sider, Header: AntHeader, Content, Footer: AntFooter } = Layout;
const { Text } = Typography;

interface OwnerLayoutProps {
  children: React.ReactNode;
}

export const OwnerLayout: React.FC<OwnerLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleResize = () => {
      if (window.innerWidth < 768) setCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  const borderColor = isDarkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)";

  const menuItems: MenuProps["items"] = [
    {
      key: "/owner",
      icon: <DashboardOutlined style={{ fontSize: "18px" }} />,
      label: <span className="font-medium">Dashboard</span>,
    },
    { type: "divider", style: { margin: "12px 0" } },
    {
      key: "establishment-group",
      type: "group",
      label: collapsed ? null : (
        <span className="text-xs font-semibold uppercase tracking-wider opacity-60 px-2">
          Meu Estabelecimento
        </span>
      ),
      children: [
        {
          key: "/owner/appointments",
          icon: <CalendarOutlined style={{ fontSize: "18px", color: "#6366f1" }} />,
          label: (
            <div className="flex items-center justify-between">
              <span className="font-medium">Agendamentos</span>
              <Badge count={3} size="small" />
            </div>
          ),
        },
        {
          key: "/owner/services",
          icon: <AppstoreOutlined style={{ fontSize: "18px", color: "#3b82f6" }} />,
          label: <span className="font-medium">Serviços</span>,
        },
        {
          key: "/owner/schedules",
          icon: <ClockCircleOutlined style={{ fontSize: "18px", color: "#10b981" }} />,
          label: <span className="font-medium">Horários</span>,
        },
        {
          key: "/owner/blocked-times",
          icon: <StopOutlined style={{ fontSize: "18px", color: "#f59e0b" }} />,
          label: <span className="font-medium">Bloqueios</span>,
        },
      ],
    },
    { type: "divider", style: { margin: "12px 0" } },
    {
      key: "reports-group",
      type: "group",
      label: collapsed ? null : (
        <span className="text-xs font-semibold uppercase tracking-wider opacity-60 px-2">
          Relatórios
        </span>
      ),
      children: [
        {
          key: "/owner/evaluations",
          icon: <StarOutlined style={{ fontSize: "18px", color: "#f59e0b" }} />,
          label: <span className="font-medium">Avaliações</span>,
        },
      ],
    },
    { type: "divider", style: { margin: "12px 0" } },
    {
      key: "/owner/settings",
      icon: <SettingOutlined style={{ fontSize: "18px", color: "#64748b" }} />,
      label: <span className="font-medium">Configurações</span>,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    router.push(e.key);
  };

  const getSelectedKeys = () => {
    if (pathname === "/owner") return ["/owner"];
    return [pathname];
  };

  const userMenuItems: MenuProps["items"] = [
    { key: "profile", icon: <UserOutlined />, label: "Meu Perfil" },
    { key: "shop-settings", icon: <ShopOutlined />, label: "Meu Estabelecimento" },
    { type: "divider" },
    { key: "home", icon: <HomeOutlined />, label: "Voltar ao Início", onClick: () => router.push("/") },
    { key: "logout", icon: <LogoutOutlined />, label: "Sair", danger: true },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg animate-pulse">
            <ShopOutlined className="text-white text-xl" />
          </div>
          <span className="text-base-content/60 text-sm">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        collapsedWidth={80}
        className="fixed left-0 top-0 h-screen z-50"
        style={{ borderRight: `1px solid ${borderColor}` }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center gap-3 px-4 border-b" style={{ borderColor }}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
            <ShopOutlined className="text-white text-lg" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <Text strong className="text-lg leading-tight">Lavacar</Text>
              <Text type="secondary" className="text-xs leading-tight">Painel do Dono</Text>
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
            style={{ paddingTop: "8px", paddingBottom: "16px" }}
          />
        </div>
      </Sider>

      {/* Main Content Area */}
      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: "margin-left 0.2s" }}>
        {/* Header */}
        <AntHeader
          className="flex items-center justify-between px-4 sticky top-0 z-40"
          style={{ borderBottom: `1px solid ${borderColor}` }}
        >
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <Text strong className="hidden sm:block">Painel Administrativo</Text>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="text"
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={() => setTheme(isDarkMode ? "light" : "dark")}
            />
            <Badge count={3} size="small">
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight">
              <Avatar
                size={36}
                icon={<UserOutlined />}
                className="cursor-pointer bg-gradient-to-br from-primary to-secondary"
              />
            </Dropdown>
          </div>
        </AntHeader>

        {/* Content */}
        <Content className="p-6" style={{ minHeight: "calc(100vh - 64px - 70px)" }}>
          {children}
        </Content>

        {/* Footer */}
        <AntFooter className="text-center" style={{ borderTop: `1px solid ${borderColor}` }}>
          <Text type="secondary" className="text-xs">
            © {new Date().getFullYear()} Lavacar - Painel do Dono do Estabelecimento
          </Text>
        </AntFooter>
      </Layout>
    </Layout>
  );
};

export default OwnerLayout;
