"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Spin, Empty, Button, Typography, Tooltip, Breadcrumb } from "antd";
import {
  DashboardOutlined,
  CalendarOutlined,
  ToolOutlined,
  ClockCircleOutlined,
  StopOutlined,
  SettingOutlined,
  LeftOutlined,
  ShopOutlined,
  LineChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { ShopAdminProvider, useShopAdmin } from "@/contexts/ShopAdminContext";

const { Title, Text } = Typography;

const SIDER_WIDTH = 260;
const SIDER_COLLAPSED_WIDTH = 80;

/**
 * Menu items do painel administrativo do Shop
 */
const getMenuItems = (shopId: string, collapsed: boolean) => [
  {
    key: `/admin/shop/${shopId}`,
    icon: <DashboardOutlined style={{ fontSize: "18px", color: "#8b5cf6" }} />,
    label: <span className="font-medium">Dashboard</span>,
  },
  { 
    type: "divider" as const, 
    style: { margin: "12px 0" } 
  },
  {
    key: "operations-group",
    type: "group" as const,
    label: collapsed ? null : (
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
        Operações
      </span>
    ),
    children: [
      {
        key: `/admin/shop/${shopId}/appointments`,
        icon: <CalendarOutlined style={{ fontSize: "18px", color: "#3b82f6" }} />,
        label: <span className="font-medium">Agendamentos</span>,
      },
      {
        key: `/admin/shop/${shopId}/services`,
        icon: <ToolOutlined style={{ fontSize: "18px", color: "#10b981" }} />,
        label: <span className="font-medium">Serviços</span>,
      },
    ],
  },
  { 
    type: "divider" as const, 
    style: { margin: "12px 0" } 
  },
  {
    key: "config-group",
    type: "group" as const,
    label: collapsed ? null : (
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
        Configurações
      </span>
    ),
    children: [
      {
        key: `/admin/shop/${shopId}/schedules`,
        icon: <ClockCircleOutlined style={{ fontSize: "18px", color: "#f59e0b" }} />,
        label: <span className="font-medium">Horários</span>,
      },
      {
        key: `/admin/shop/${shopId}/blocked-times`,
        icon: <StopOutlined style={{ fontSize: "18px", color: "#ef4444" }} />,
        label: <span className="font-medium">Bloqueios</span>,
      },
    ],
  },
  { 
    type: "divider" as const, 
    style: { margin: "12px 0" } 
  },
  {
    key: `/admin/shop/${shopId}/insights`,
    icon: <LineChartOutlined style={{ fontSize: "18px", color: "#06b6d4" }} />,
    label: <span className="font-medium">Insights</span>,
  },
  {
    key: `/admin/shop/${shopId}/settings`,
    icon: <SettingOutlined style={{ fontSize: "18px", color: "#64748b" }} />,
    label: <span className="font-medium">Configurações</span>,
  },
];

/**
 * Conteúdo interno do Layout (precisa estar dentro do Provider)
 */
function ShopLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { shop, shopId, isLoading, error } = useShopAdmin();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = getMenuItems(shopId, collapsed);

  // Encontrar a key ativa baseada no pathname
  const selectedKey = menuItems.find((item) => pathname === item.key)?.key 
    || menuItems.find((item) => item.key && pathname.startsWith(item.key) && item.key !== `/shop/${shopId}`)?.key
    || `/admin/shop/${shopId}`;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Carregando estabelecimento..." />
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Empty
          description="Estabelecimento não encontrado"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => router.push("/")}>
            Voltar ao Início
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar Fixa */}
      <aside
        className="fixed left-0 top-0 h-screen z-50 bg-white border-r border-slate-200 transition-all duration-200"
        style={{ width: collapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH }}
      >
        {/* Header do Shop */}
        <div className="px-4 py-5 border-b border-slate-100" style={{ minHeight: 72 }}>
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <ShopOutlined className="text-white text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <Title level={5} className="!m-0 truncate !text-[15px] !font-bold !text-slate-800">
                  {shop.name}
                </Title>
                <Text className="text-xs text-slate-400 font-medium">
                  Painel Admin
                </Text>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <ShopOutlined className="text-white text-xl" />
              </div>
            </div>
          )}
        </div>

        {/* Menu de Navegação */}
        <div 
          className="overflow-y-auto overflow-x-hidden" 
          style={{ height: collapsed ? "calc(100vh - 144px)" : "calc(100vh - 144px)" }}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => router.push(key)}
            className="border-none bg-transparent"
            inlineCollapsed={collapsed}
            style={{ paddingTop: "8px", paddingBottom: "16px" }}
          />
        </div>

        {/* Footer - Collapse Toggle */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white">
          {shop.organizationId && !collapsed && (
            <div className="px-4 py-3 border-b border-slate-100">
              <Button
                type="text"
                icon={<LeftOutlined className="text-slate-400" />}
                onClick={() => router.push(`/organization/${shop.organizationId}`)}
                className="w-full text-left hover:!bg-slate-50 !text-slate-500 !text-xs"
                size="small"
              >
                Voltar à Organização
              </Button>
            </div>
          )}
          <div className="p-3">
            <Tooltip title={collapsed ? "Expandir" : "Recolher"} placement="right">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="w-full flex items-center justify-center hover:!bg-slate-50 !text-slate-400"
                size="small"
              />
            </Tooltip>
          </div>
        </div>
      </aside>

      {/* Área Principal */}
      <main 
        className="min-h-screen bg-slate-50 transition-all duration-200"
        style={{ marginLeft: collapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH }}
      >
        {/* Breadcrumb */}
        <nav className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-40">
          <Breadcrumb
            items={[
              ...(shop.organizationId ? [{
                title: (
                  <button
                    onClick={() => router.push(`/organization/${shop.organizationId}`)}
                    className="text-slate-500 hover:text-violet-600 transition-colors flex items-center gap-1"
                  >
                    <HomeOutlined className="text-xs" />
                    <span>Organização</span>
                  </button>
                ),
              }] : []),
              {
                title: (
                  <button
                    onClick={() => router.push(`/admin/shop/${shopId}`)}
                    className="text-slate-500 hover:text-violet-600 transition-colors"
                  >
                    {shop.name}
                  </button>
                ),
              },
              ...(pathname !== `/admin/shop/${shopId}` ? [{
                title: (
                  <span className="text-slate-800 font-medium">
                    {menuItems.find((item) => item.key && pathname.startsWith(item.key) && item.key !== `/admin/shop/${shopId}`)?.label || ""}
                  </span>
                ),
              }] : []),
            ]}
            className="text-sm"
          />
        </nav>

        {/* Área de Conteúdo */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * Layout Administrativo do Shop
 * 
 * Rota: /shop/[shopId]/*
 * 
 * Fornece:
 * - Sidebar com navegação
 * - Header com breadcrumbs
 * - Contexto do shop atual (ShopAdminContext)
 */
export default function ShopAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShopAdminProvider>
      <ShopLayoutContent>{children}</ShopLayoutContent>
    </ShopAdminProvider>
  );
}
