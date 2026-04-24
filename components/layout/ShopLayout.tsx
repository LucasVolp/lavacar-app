"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Typography, Button, Avatar, Dropdown, Tooltip, Breadcrumb } from "antd";
import {
  DashboardOutlined,
  CalendarOutlined,
  ToolOutlined,
  ClockCircleOutlined,
  StopOutlined,
  SettingOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  MoonOutlined,
  SunOutlined,
  HomeOutlined,
  ShopOutlined,
  ArrowLeftOutlined,
  LineChartOutlined,
  StarOutlined,
  DollarOutlined,
  ContactsOutlined
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { MenuProps } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import Link from "next/link";
import { NexoLogo } from "@/components/ui/NexoLogo";

const { Sider, Header: AntHeader, Content, Footer: AntFooter } = Layout;
const { Text } = Typography;

interface ShopLayoutProps {
  children: React.ReactNode;
}

export const ShopLayout: React.FC<ShopLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const { resolvedTheme, setTheme } = useTheme();
  const { logout, user } = useAuth();
  const { shop, shopId, organizationId, isLoading } = useShopAdmin();

  const isEmployee = (() => {
    if (!user || !organizationId) return false;
    if (user.id === shop?.ownerId) return false;
    if (user.role === "ADMIN") return false;
    if (user.organizations?.some((org: { id: string }) => org.id === organizationId)) return false;
    const membership = user.organizationMembers?.find((m: { organizationId: string; role: string }) => m.organizationId === organizationId);
    return membership?.role === "EMPLOYEE";
  })();
  
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

  const operationsChildren = [
    {
      key: `/organization/${organizationId}/shop/${shopId}/appointments`,
      icon: <CalendarOutlined style={{ fontSize: "18px", color: "#3b82f6" }} />,
      label: <span className="font-medium">Agendamentos</span>,
    },
    {
      key: `/organization/${organizationId}/shop/${shopId}/clients`,
      icon: <ContactsOutlined style={{ fontSize: "18px", color: "#06b6d4" }} />,
      label: <span className="font-medium">Clientes</span>,
    },
    {
      key: `/organization/${organizationId}/shop/${shopId}/services`,
      icon: <ToolOutlined style={{ fontSize: "18px", color: "#10b981" }} />,
      label: <span className="font-medium">Serviços</span>,
    },
    ...(!isEmployee ? [{
      key: `/organization/${organizationId}/shop/${shopId}/employees`,
      icon: <TeamOutlined style={{ fontSize: "18px", color: "#f43f5e" }} />,
      label: <span className="font-medium">Funcionários</span>,
    }] : []),
  ];

  const configChildren = [
    ...(!isEmployee ? [
      {
        key: `/organization/${organizationId}/shop/${shopId}/schedules`,
        icon: <ClockCircleOutlined style={{ fontSize: "18px", color: "#f59e0b" }} />,
        label: <span className="font-medium">Horários</span>,
      },
      {
        key: `/organization/${organizationId}/shop/${shopId}/blocked-times`,
        icon: <StopOutlined style={{ fontSize: "18px", color: "#ef4444" }} />,
        label: <span className="font-medium">Bloqueios</span>,
      },
    ] : []),
  ];

  const menuItems: MenuProps["items"] = [
    {
      key: `/organization/${organizationId}/shop/${shopId}`,
      icon: <DashboardOutlined style={{ fontSize: "18px", color: "#8b5cf6" }} />,
      label: <span className="font-medium">Dashboard</span>,
    },
    { type: "divider", style: { margin: "12px 0" } },
    {
      key: "operations-group",
      type: "group",
      label: collapsed ? null : (
        <span className="text-xs font-semibold uppercase tracking-wider opacity-60 px-2">
          Operações
        </span>
      ),
      children: operationsChildren,
    },
    ...(configChildren.length > 0 ? [
      { type: "divider" as const, style: { margin: "12px 0" } },
      {
        key: "config-group",
        type: "group" as const,
        label: collapsed ? null : (
          <span className="text-xs font-semibold uppercase tracking-wider opacity-60 px-2">
            Configurações
          </span>
        ),
        children: configChildren,
      },
    ] : []),
    { type: "divider" as const, style: { margin: "12px 0" } },
    {
      key: "analytics-group",
      type: "group" as const,
      label: collapsed ? null : (
        <span className="text-xs font-semibold uppercase tracking-wider opacity-60 px-2">
          Análise
        </span>
      ),
      children: [
        {
            key: `/organization/${organizationId}/shop/${shopId}/evaluations`,
            icon: <StarOutlined style={{ fontSize: "18px", color: "#eab308" }} />,
            label: <span className="font-medium">Avaliações</span>,
        },
        {
            key: `/organization/${organizationId}/shop/${shopId}/insights`,
            icon: <LineChartOutlined style={{ fontSize: "18px", color: "#06b6d4" }} />,
            label: <span className="font-medium">Insights</span>,
        },
      ]
    },
    ...(!isEmployee ? [
      {
        key: `/organization/${organizationId}/shop/${shopId}/sales-goals`,
        icon: <DollarOutlined style={{fontSize: "18px", color: "#08e400"}}/>,
        label: <span className="font-medium">Metas de Vendas</span>,
      },
      {
        key: `/organization/${organizationId}/shop/${shopId}/settings`,
        icon: <SettingOutlined style={{ fontSize: "18px", color: "#64748b" }} />,
        label: <span className="font-medium">Configurações</span>,
      },
    ] : []),
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    router.push(e.key);
  };

  const getSelectedKeys = () => {
    if (pathname === `/organization/${organizationId}/shop/${shopId}`) return [`/organization/${organizationId}/shop/${shopId}`];

    const exactMatch = menuItems.flatMap(i =>
        (i && 'children' in i && i.children) ? i.children : [i]
    ).find(item => item?.key === pathname);
    
    if (exactMatch) return [exactMatch.key as string];

    return menuItems.flatMap(i =>
        (i && 'children' in i && i.children) ? i.children : [i]
    ).filter(item => item?.key && pathname.startsWith(item.key as string))
     .map(item => item?.key as string);
  };

  const userMenuItems: MenuProps["items"] = [
    { key: "profile", icon: <UserOutlined />, label: "Meu Perfil", onClick: () => router.push("/client/profile") },
    { type: "divider" },
    { key: "home", icon: <HomeOutlined />, label: "Ir para Início", onClick: () => router.push("/") },
    { key: "client", icon: <UserOutlined />, label: "Área do Cliente", onClick: () => router.push("/client") },
    { type: "divider" },
    { key: "logout", icon: <LogoutOutlined />, label: "Sair", danger: true, onClick: () => { logout(); router.push("/"); } },
  ];

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
             <div className="text-zinc-500 font-medium">Carregando ambiente...</div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
       <div className="flex justify-center items-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
         <div className="text-center">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Loja não encontrada</h2>
            <Button onClick={() => router.push('/')}>Voltar ao Início</Button>
         </div>
       </div>
    )
  }

  return (
    <Layout className="min-h-screen" hasSider>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        collapsedWidth={80}
        className="z-50 shadow-lg border-r"
        style={{ 
          borderColor: borderColor,
          backgroundColor: isDarkMode ? '#18181b' : '#ffffff',
          position: 'sticky',
          top: 0,
          height: '100vh',
          left: 0,
          overflow: 'hidden'
        }}
        theme={isDarkMode ? "dark" : "light"}
      >
        <div className="h-16 flex items-center gap-3 px-4 border-b transition-colors flex-shrink-0" style={{ borderColor }}>
            <NexoLogo size={62} />
            
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <Text strong className="text-sm leading-tight truncate text-zinc-800 dark:text-zinc-100">
                   {isLoading ? "Carregando..." : shop?.name || "Shop Admin"}
                </Text>
                <Text type="secondary" className="text-xs leading-tight text-zinc-500">
                   Painel de Gestão
                </Text>
              </div>
            )}
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar" style={{ height: 'calc(100vh - 128px)' }}>
          <Menu
            mode="inline"
            selectedKeys={getSelectedKeys()}
            onClick={handleMenuClick}
            items={menuItems}
            className="border-none bg-transparent"
            style={{ paddingTop: "8px", paddingBottom: "16px" }}
            theme={isDarkMode ? "dark" : "light"}
          />
        </div>

        {shop?.organizationId && (
            <div className="w-full p-2 border-t flex-shrink-0" style={{ borderColor, backgroundColor: isDarkMode ? '#18181b' : '#ffffff' }}>
                <Tooltip title={collapsed ? "Voltar para Organização" : ""} placement="right">
                    <Button 
                        type="text" 
                        block={!collapsed}
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.push(`/organization/${shop.organizationId}`)}
                        className="flex items-center justify-center gap-2 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                        {!collapsed && "Voltar à Organização"}
                    </Button>
                </Tooltip>
            </div>
        )}
      </Sider>

      <Layout style={{ transition: "all 0.2s" }}>
        <AntHeader
          className={`flex items-center justify-between px-4 sticky top-0 z-40 backdrop-blur-md transition-colors ${isDarkMode ? 'bg-zinc-950/80' : 'bg-white/80'}`}
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

             <Breadcrumb
                className="hidden md:block"
                items={[
                    { 
                        title: <Link href={shop?.organizationId ? `/organization/${shop.organizationId}` : "/"}><HomeOutlined /></Link>
                    },
                    {
                        title: <span className="font-medium text-zinc-800 dark:text-zinc-200">{shop?.name}</span>
                    },
                    {
                        title: <span className="text-zinc-500">{
                             (menuItems?.flatMap(i => 
                                (i && 'children' in i && i.children) ? i.children : [i]
                            ).find(item => item?.key === pathname) as { label: React.ReactNode } | undefined)?.label
                        }</span>
                    }
                ]}
             />
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="text"
              shape="circle"
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={() => setTheme(isDarkMode ? "light" : "dark")}
              className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
            />

            <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 mx-1" />

            <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight">
              <div className="flex items-center gap-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1.5 rounded-lg transition-colors">
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  className="bg-indigo-600"
                  src={user?.picture}
                />
                <span className="hidden md:block text-sm font-medium opacity-90 text-zinc-700 dark:text-zinc-200">
                   {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Usuário"}
                </span>
              </div>
            </Dropdown>
          </div>
        </AntHeader>

        <Content className="p-6 min-h-[calc(100vh-64px)] overflow-x-hidden bg-zinc-50 dark:bg-black">
          <div className="w-full max-w-[1600px] mx-auto animate-fade-in">
             {children}
          </div>
        </Content>

        <AntFooter className="text-center bg-transparent">
          <Text type="secondary" className="text-xs">
            © {new Date().getFullYear()} NexoCar - Sistema de Gestão de Agendamentos
          </Text>
        </AntFooter>
      </Layout>
    </Layout>
  );
};
