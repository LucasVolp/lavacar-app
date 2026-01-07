"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Layout, Menu, Spin, Empty, Button, Typography } from "antd";
import {
  DashboardOutlined,
  CalendarOutlined,
  ToolOutlined,
  ClockCircleOutlined,
  StopOutlined,
  SettingOutlined,
  LeftOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { ShopAdminProvider, useShopAdmin } from "@/contexts/ShopAdminContext";

const { Sider, Content, Header } = Layout;
const { Title, Text } = Typography;

/**
 * Menu items do painel administrativo do Shop
 */
const getMenuItems = (shopId: string) => [
  {
    key: `/admin/shop/${shopId}`,
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: `/admin/shop/${shopId}/appointments`,
    icon: <CalendarOutlined />,
    label: "Agendamentos",
  },
  {
    key: `/admin/shop/${shopId}/services`,
    icon: <ToolOutlined />,
    label: "Serviços",
  },
  {
    key: `/admin/shop/${shopId}/schedules`,
    icon: <ClockCircleOutlined />,
    label: "Horários",
  },
  {
    key: `/admin/shop/${shopId}/blocked-times`,
    icon: <StopOutlined />,
    label: "Bloqueios",
  },
  {
    key: `/admin/shop/${shopId}/settings`,
    icon: <SettingOutlined />,
    label: "Configurações",
  },
];

/**
 * Conteúdo interno do Layout (precisa estar dentro do Provider)
 */
function ShopLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { shop, shopId, isLoading, error } = useShopAdmin();

  const menuItems = getMenuItems(shopId);

  // Encontrar a key ativa baseada no pathname
  const selectedKey = menuItems.find((item) => pathname === item.key)?.key 
    || menuItems.find((item) => pathname.startsWith(item.key) && item.key !== `/shop/${shopId}`)?.key
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
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider
        width={250}
        theme="light"
        className="border-r border-gray-200"
        breakpoint="lg"
        collapsedWidth="0"
      >
        {/* Header do Shop */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <ShopOutlined className="text-white text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <Title level={5} className="!m-0 truncate">
                {shop.name}
              </Title>
              <Text type="secondary" className="text-xs">
                {shop.city}, {shop.state}
              </Text>
            </div>
          </div>
        </div>

        {/* Menu de Navegação */}
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          className="border-none"
        />

        {/* Voltar para Organization */}
        {shop.organizationId && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={() => router.push(`/organization/${shop.organizationId}`)}
              className="w-full text-left"
            >
              Voltar à Organização
            </Button>
          </div>
        )}
      </Sider>

      {/* Conteúdo Principal */}
      <Layout>
        {/* Header com Breadcrumbs */}
        <Header className="bg-white px-6 border-b border-gray-200 flex items-center h-16">
          <nav className="flex items-center gap-2 text-sm">
            {shop.organizationId && (
              <>
                <button
                  onClick={() => router.push(`/organization/${shop.organizationId}`)}
                  className="text-gray-500 hover:text-blue-500 transition-colors"
                >
                  Organização
                </button>
                <span className="text-gray-300">/</span>
              </>
            )}
            <button
              onClick={() => router.push(`/admin/shop/${shopId}`)}
              className="text-gray-500 hover:text-blue-500 transition-colors"
            >
              {shop.name}
            </button>
            {pathname !== `/admin/shop/${shopId}` && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-gray-900 font-medium">
                  {menuItems.find((item) => pathname.startsWith(item.key) && item.key !== `/admin/shop/${shopId}`)?.label || ""}
                </span>
              </>
            )}
          </nav>
        </Header>

        {/* Área de Conteúdo */}
        <Content className="p-6 bg-gray-50">
          {children}
        </Content>
      </Layout>
    </Layout>
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
