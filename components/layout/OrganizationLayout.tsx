"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Typography, Button, Avatar, Dropdown, Breadcrumb } from "antd";
import {
  AppstoreOutlined,
  ShopOutlined,
  BarChartOutlined,
  SettingOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
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
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const organizationId = params?.organizationId as string;

  const { resolvedTheme, setTheme } = useTheme();
  const { logout, user } = useAuth();
  const { data: organization, isLoading: isLoadingOrg } = useOrganization(organizationId);

  const isOwner = organization?.ownerId === user?.id || user?.role === "ADMIN";
  const isDarkMode = resolvedTheme === "dark";

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
        setMobileOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  const borderColor = isDarkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)";

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
    ...(isOwner ? [
      { type: "divider" as const, style: { margin: "12px 0" } },
      {
        key: `/organization/${organizationId}/settings`,
        icon: <SettingOutlined style={{ fontSize: "18px", color: "#8b5cf6" }} />,
        label: <span className="font-medium">Configurações</span>,
      },
    ] : []),
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    router.push(e.key);
  };

  const getSelectedKeys = () => {
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

  const siderCollapsed = isMobile ? !mobileOpen : collapsed;

  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleMenuNavigate: MenuProps["onClick"] = (e) => {
    router.push(e.key);
    if (isMobile) setMobileOpen(false);
  };

  if (!mounted) return null;

  return (
    <>
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <Layout className="min-h-screen" hasSider>
        <Sider
          trigger={null}
          collapsible
          collapsed={siderCollapsed}
          width={260}
          collapsedWidth={isMobile ? 0 : 80}
          className="z-[9999] !opacity-100 !border-r !border-zinc-200 !bg-white !shadow-2xl dark:!border-zinc-800 dark:!bg-zinc-950"
          style={{
            borderColor,
            backgroundColor: isDarkMode
              ? "var(--fallback-b1, oklch(var(--b1)/1))"
              : "#ffffff",
            opacity: 1,
            ...(isMobile
              ? {
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  height: '100%',
                  zIndex: 9999,
                  overflow: 'hidden',
                }
              : {
                  position: 'sticky',
                  top: 0,
                  height: '100vh',
                  zIndex: 9999,
                  overflow: 'hidden',
                }),
          }}
          theme={isDarkMode ? "dark" : "light"}
        >
          <div className="h-16 flex items-center gap-3 px-4 border-b transition-colors flex-shrink-0" style={{ borderColor }}>
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

            {!siderCollapsed && (
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

          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar" style={{ height: "calc(100vh - 64px)" }}>
            <Menu
              mode="inline"
              selectedKeys={getSelectedKeys()}
              onClick={handleMenuNavigate}
              items={menuItems}
              className="border-none bg-transparent"
              style={{ paddingTop: "8px", paddingBottom: "16px" }}
              theme={isDarkMode ? "dark" : "light"}
            />
          </div>
        </Sider>

        <Layout style={{ transition: "all 0.2s", minWidth: 0 }}>
          <AntHeader
            className={`flex items-center justify-between sticky top-0 z-40 backdrop-blur-md transition-colors ${isDarkMode ? 'bg-zinc-950/80' : 'bg-white/80'}`}
            style={{
              borderBottom: `1px solid ${borderColor}`,
              padding: '0 16px',
              height: '64px',
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Button
                type="text"
                icon={siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={handleToggle}
                className="hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0 min-w-[44px] min-h-[44px]"
              />
              <Breadcrumb
                className="hidden md:flex min-w-0"
                items={[
                  { title: <HomeOutlined /> },
                  {
                    title: (
                      <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                        {organization?.name || "Organização"}
                      </span>
                    ),
                  },
                  {
                    title: (
                      <span className="text-zinc-500 truncate">
                        {
                          (menuItems
                            .flatMap((item) => ((item && "children" in item && item.children) ? item.children : [item]))
                            .find((item) => item?.key === pathname) as { label: React.ReactNode } | undefined)
                            ?.label
                        }
                      </span>
                    ),
                  },
                ]}
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="text"
                shape="circle"
                icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                className="hover:bg-zinc-100 dark:hover:bg-zinc-800 min-w-[44px] min-h-[44px]"
              />

              <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800" />

              <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight">
                <div className="flex items-center gap-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1.5 rounded-lg transition-colors min-h-[44px]">
                  <Avatar
                    size={32}
                    icon={<UserOutlined />}
                    className="bg-indigo-600 shrink-0"
                    src={user?.picture}
                  />
                  <span className="hidden md:block text-sm font-medium opacity-90 max-w-[120px] truncate">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Usuário"}
                  </span>
                </div>
              </Dropdown>
            </div>
          </AntHeader>

          <Content className="min-h-[calc(100vh-64px)] overflow-x-hidden">
            <div className="w-full h-full p-4 sm:p-6 lg:p-8 animate-fade-in">
              {children}
            </div>
          </Content>

          <AntFooter className="text-center bg-transparent px-4">
            <Text type="secondary" className="text-xs">
              © {new Date().getFullYear()} NexoCar - Sistema de Gestão de Agendamentos
            </Text>
          </AntFooter>
        </Layout>
      </Layout>
    </>
  );
};
