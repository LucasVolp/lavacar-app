"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Typography, Badge, Button, Avatar, Dropdown } from "antd";
import {
  AppstoreOutlined,
  ShopOutlined,
  BarChartOutlined,
  SettingOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  LogoutOutlined,
  UserOutlined,
  MoonOutlined,
  SunOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useTheme } from "next-themes";
import type { MenuProps } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganization } from "@/hooks/useOrganizations";
import Image from "next/image";

const { Sider, Header: AntHeader, Content, Footer: AntFooter } = Layout;
const { Text } = Typography;

interface OrganizationLayoutProps {
  children: React.ReactNode;
}

export const OrganizationLayout: React.FC<OrganizationLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const organizationId = params?.organizationId as string;
  
  const { resolvedTheme, setTheme } = useTheme();
  const { logout, user } = useAuth();
  const { data: organization, isLoading: isLoadingOrg } = useOrganization(organizationId);
  
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

  // Menu Configuration
  const menuItems: MenuProps["items"] = [
    {
      key: `/organization/${organizationId}`,
      icon: <AppstoreOutlined style={{ fontSize: "18px" }} />,
      label: <span className="font-medium">Visão Geral</span>,
    },
    { type: "divider", style: { margin: "12px 0" } },
    {
      key: "management-group",
      type: "group",
      label: collapsed ? null : (
        <span className="text-xs font-semibold uppercase tracking-wider opacity-60 px-2">
          Gerenciamento
        </span>
      ),
      children: [
        {
          key: `/organization/${organizationId}/shops`,
          icon: <ShopOutlined style={{ fontSize: "18px", color: "#6366f1" }} />,
          label: <span className="font-medium">Shops</span>,
        },
        {
          key: `/organization/${organizationId}/members`,
          icon: <TeamOutlined style={{ fontSize: "18px", color: "#3b82f6" }} />,
          label: <span className="font-medium">Membros</span>,
        },
      ],
    },
    { type: "divider", style: { margin: "12px 0" } },
    {
      key: "analytics-group",
      type: "group",
      label: collapsed ? null : (
        <span className="text-xs font-semibold uppercase tracking-wider opacity-60 px-2">
          Análise
        </span>
      ),
      children: [
        {
          key: `/organization/${organizationId}/insights`,
          icon: <BarChartOutlined style={{ fontSize: "18px", color: "#10b981" }} />,
          label: <span className="font-medium">Insights</span>,
        },
      ],
    },
    { type: "divider", style: { margin: "12px 0" } },
    {
      key: `/organization/${organizationId}/settings`,
      icon: <SettingOutlined style={{ fontSize: "18px", color: "#8b5cf6" }} />,
      label: <span className="font-medium">Configurações</span>,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    router.push(e.key);
  };

  const getSelectedKeys = () => {
    // Basic matching, can be improved for nested routes
    if (pathname === `/organization/${organizationId}`) return [`/organization/${organizationId}`];
    return [pathname];
  };

  const userMenuItems: MenuProps["items"] = [
    { key: "profile", icon: <UserOutlined />, label: "Meu Perfil", onClick: () => router.push("/client/profile") },
    { type: "divider" },
    { key: "home", icon: <HomeOutlined />, label: "Ir para Início", onClick: () => router.push("/") },
    { key: "client", icon: <UserOutlined />, label: "Área do Cliente", onClick: () => router.push("/client") },
    { type: "divider" },
    { key: "logout", icon: <LogoutOutlined />, label: "Sair", danger: true, onClick: () => { logout(); router.push("/"); } },
  ];

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={280}
        collapsedWidth={80}
        className="fixed left-0 top-0 h-screen z-50 shadow-lg border-r"
        style={{ 
          borderColor: borderColor,
          backgroundColor: isDarkMode ? '#18181b' : '#ffffff' 
        }}
        theme={isDarkMode ? "dark" : "light"}
      >
        {/* Logo / Org Header */}
        <div className="h-16 flex items-center gap-3 px-4 border-b" style={{ borderColor }}>
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white font-bold overflow-hidden relative">
              {organization?.logoUrl ? (
                <Image 
                  src={organization.logoUrl} 
                  alt="Logo" 
                  fill
                  className="object-cover" 
                />
              ) : (
                <span className="text-lg">{(organization?.name?.[0] || "O").toUpperCase()}</span>
              )}
            </div>
            
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <Text strong className="text-sm leading-tight truncate">
                   {isLoadingOrg ? "Carregando..." : organization?.name || "Organização"}
                </Text>
                <Text type="secondary" className="text-xs leading-tight">
                   Gestão
                </Text>
              </div>
            )}
        </div>

        {/* Menu */}
        <div className="h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden custom-scrollbar">
          <Menu
            mode="inline"
            selectedKeys={getSelectedKeys()}
            onClick={handleMenuClick}
            items={menuItems}
            className="border-none"
            style={{ paddingTop: "8px", paddingBottom: "16px" }}
            theme={isDarkMode ? "dark" : "light"}
          />
        </div>
      </Sider>

      {/* Main Content Area */}
      <Layout style={{ transition: "all 0.2s" }}>
        {/* Header */}
        <AntHeader
          className={`flex items-center justify-between px-4 sticky top-0 z-40 backdrop-blur-md ${isDarkMode ? 'bg-zinc-950/80' : 'bg-white/80'}`}
          style={{ 
            borderBottom: `1px solid ${borderColor}`,
            padding: '0 24px',
            height: '64px'
          }}
        >
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
            />
            {/* Breadcrumb or Page Title could go here */}
            <Text strong className="hidden sm:block text-lg">Painel da Organização</Text>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="text"
              shape="circle"
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={() => setTheme(isDarkMode ? "light" : "dark")}
              className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
            />
            
            <Badge count={3} size="small" offset={[-2, 2]}>
              <Button 
                 type="text" 
                 shape="circle" 
                 icon={<BellOutlined />} 
                 className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
              />
            </Badge>
            
            <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 mx-1" />

            <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight">
              <div className="flex items-center gap-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1.5 rounded-lg transition-colors">
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  className="bg-indigo-600"
                  src={user?.picture}
                />
                <span className="hidden md:block text-sm font-medium opacity-90">
                   {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Usuário"}
                </span>
              </div>
            </Dropdown>
          </div>
        </AntHeader>

        {/* Content */}
        <Content className="p-0 min-h-[calc(100vh-64px)] overflow-x-hidden">
          <div className="w-full h-full animate-fade-in">
             {children}
          </div>
        </Content>

        {/* Footer */}
        <AntFooter className="text-center bg-transparent">
          <Text type="secondary" className="text-xs">
            © {new Date().getFullYear()} Lavacar - Sistema de Gestão
          </Text>
        </AntFooter>
      </Layout>
    </Layout>
  );
};
