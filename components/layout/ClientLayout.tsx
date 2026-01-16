"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Typography, Badge, Button, Avatar, Dropdown } from "antd";
import {
  CarOutlined,
  CalendarOutlined,
  SettingOutlined,
  DashboardOutlined,
  HistoryOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  LogoutOutlined,
  HomeOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { MenuProps } from "antd";

import { useAuth } from "@/contexts/AuthContext";

const { Sider, Header: AntHeader, Content, Footer: AntFooter } = Layout;
const { Text } = Typography;

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { logout, isAuthenticated, isLoading } = useAuth(); // Auth context for Logout
  const isDarkMode = resolvedTheme === "dark";

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
        router.push("/auth/login?redirect=" + encodeURIComponent(pathname));
    }
  }, [isLoading, isAuthenticated, router, pathname]);

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
      key: "/client",
      icon: <DashboardOutlined style={{ fontSize: "18px" }} />,
      label: <span className="font-medium">Minha Área</span>,
    },
    { type: "divider", style: { margin: "12px 0" } },
    {
      key: "main-group",
      type: "group",
      label: collapsed ? null : (
        <span className="text-xs font-semibold uppercase tracking-wider opacity-60 px-2">
          Agendamentos
        </span>
      ),
      children: [
        {
          key: "/client/appointments",
          icon: <CalendarOutlined style={{ fontSize: "18px", color: "#6366f1" }} />,
          label: (
            <div className="flex items-center justify-between">
              <span className="font-medium">Meus Agendamentos</span>
              <Badge count={0} size="small" /> 
            </div>
          ),
        },
        {
          key: "/client/history",
          icon: <HistoryOutlined style={{ fontSize: "18px", color: "#64748b" }} />,
          label: <span className="font-medium">Histórico</span>,
        },
      ],
    },
    { type: "divider", style: { margin: "12px 0" } },
    {
      key: "vehicles-group",
      type: "group",
      label: collapsed ? null : (
        <span className="text-xs font-semibold uppercase tracking-wider opacity-60 px-2">
          Veículos
        </span>
      ),
      children: [
        {
          key: "/client/vehicles",
          icon: <CarOutlined style={{ fontSize: "18px", color: "#3b82f6" }} />,
          label: <span className="font-medium">Meus Veículos</span>,
        },
      ],
    },
    { type: "divider", style: { margin: "12px 0" } },
    {
      key: "/client/profile",
      icon: <UserOutlined style={{ fontSize: "18px", color: "#8b5cf6" }} />,
      label: <span className="font-medium">Meu Perfil</span>,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    router.push(e.key);
  };

  const getSelectedKeys = () => {
    if (pathname === "/client") return ["/client"];
    return [pathname];
  };

  const userMenuItems: MenuProps["items"] = [
    { key: "profile", icon: <UserOutlined />, label: "Meu Perfil", onClick: () => router.push("/client/profile") },
    { key: "settings", icon: <SettingOutlined />, label: "Configurações" },
    { type: "divider" },
    { key: "home", icon: <HomeOutlined />, label: "Voltar ao Início", onClick: () => router.push("/") },
    { key: "logout", icon: <LogoutOutlined />, label: "Sair", danger: true, onClick: () => { logout(); router.push("/"); } },
  ];

  if (!mounted || isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-spin">
            <UserOutlined className="text-white text-xl animate-none" />
          </div>
          <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {isLoading ? "Verificando acesso..." : "Redirecionando..."}
          </span>
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
          <div className="w-10 h-10 bg-gradient-to-br from-info to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <UserOutlined className="text-white text-lg" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <Text strong className="text-lg leading-tight">Lavacar</Text>
              <Text type="secondary" className="text-xs leading-tight">Área do Cliente</Text>
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
            <Text strong className="hidden sm:block">Área do Cliente</Text>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="text"
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={() => setTheme(isDarkMode ? "light" : "dark")}
            />
            <Badge count={1} size="small">
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight">
              <Avatar
                size={36}
                icon={<UserOutlined />}
                className="cursor-pointer bg-gradient-to-br from-info to-cyan-500"
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
            © {new Date().getFullYear()} Lavacar - Área do Cliente
          </Text>
        </AntFooter>
      </Layout>
    </Layout>
  );
};

export default ClientLayout;
