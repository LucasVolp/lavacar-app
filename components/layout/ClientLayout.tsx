"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Typography, Button, Avatar, Dropdown, Breadcrumb } from "antd";
import {
  CarOutlined,
  CalendarOutlined,
  DashboardOutlined,
  HistoryOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  HomeOutlined,
  MoonOutlined,
  SunOutlined,
  StarOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { MenuProps } from "antd";
import Link from "next/link";

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
  const { logout, user, isAuthenticated, isLoading } = useAuth();
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
      icon: <DashboardOutlined style={{ fontSize: "18px", color: "#8b5cf6" }} />,
      label: <span className="font-medium">Minha Área</span>,
    },
    { type: "divider", style: { margin: "12px 0" } },
    {
      key: "main-group",
      type: "group",
      label: collapsed ? null : <span className="text-xs font-semibold uppercase tracking-wider opacity-60 px-2">Operações</span>,
      children: [
        {
          key: "/client/appointments",
          icon: <CalendarOutlined style={{ fontSize: "18px", color: "#6366f1" }} />,
          label: <span className="font-medium">Meus Agendamentos</span>,
        },
        {
          key: "/client/history",
          icon: <HistoryOutlined style={{ fontSize: "18px", color: "#06b6d4" }} />,
          label: <span className="font-medium">Histórico</span>,
        },
        {
          key: "/client/evaluations",
          icon: <StarOutlined style={{ fontSize: "18px", color: "#f59e0b" }} />,
          label: <span className="font-medium">Minhas Avaliações</span>,
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
      icon: <ContactsOutlined style={{ fontSize: "18px", color: "#64748b" }} />,
      label: <span className="font-medium">Meu Perfil</span>,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    router.push(e.key);
  };

  const getSelectedKeys = () => {
    if (pathname === "/client") {
      return ["/client"];
    }

    const exactMatch = menuItems
      .flatMap((item) => ((item && "children" in item && item.children) ? item.children : [item]))
      .find((item) => item?.key === pathname);

    if (exactMatch) {
      return [exactMatch.key as string];
    }

    return menuItems
      .flatMap((item) => ((item && "children" in item && item.children) ? item.children : [item]))
      .filter((item) => item?.key && pathname.startsWith(item.key as string))
      .map((item) => item?.key as string);
  };

  const userMenuItems: MenuProps["items"] = [
    { key: "profile", icon: <UserOutlined />, label: "Meu Perfil", onClick: () => router.push("/client/profile") },
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
    <Layout className="min-h-screen" hasSider>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        collapsedWidth={80}
        className="z-50 shadow-lg border-r"
        style={{
          borderColor,
          backgroundColor: isDarkMode ? "#18181b" : "#ffffff",
          position: "sticky",
          top: 0,
          height: "100vh",
          left: 0,
          overflow: "hidden",
        }}
        theme={isDarkMode ? "dark" : "light"}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b transition-colors flex-shrink-0" style={{ borderColor }}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white font-bold shadow-lg shadow-indigo-500/20">
            <UserOutlined className="text-xl" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <Text strong className="text-sm leading-tight truncate text-zinc-800 dark:text-zinc-100">
                Lavacar
              </Text>
              <Text type="secondary" className="text-xs leading-tight text-zinc-500">
                Área do Cliente
              </Text>
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar" style={{ height: "calc(100vh - 64px)" }}>
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
      </Sider>

      {/* Main Content Area */}
      <Layout style={{ transition: "margin-left 0.2s" }}>
        {/* Header */}
        <AntHeader
          className={`flex items-center justify-between px-4 sticky top-0 z-40 backdrop-blur-md transition-colors ${isDarkMode ? "bg-zinc-950/80" : "bg-white/80"}`}
          style={{
            borderBottom: `1px solid ${borderColor}`,
            padding: "0 24px",
            height: "64px",
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
                { title: <Link href="/"><HomeOutlined /></Link> },
                { title: <span className="font-medium text-zinc-800 dark:text-zinc-200">Cliente</span> },
                {
                  title: (
                    <span className="text-zinc-500">
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
                  {user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Usuário"}
                </span>
              </div>
            </Dropdown>
          </div>
        </AntHeader>

        {/* Content */}
        <Content className="p-6 min-h-[calc(100vh-64px)] overflow-x-hidden bg-zinc-50 dark:bg-black">
          <div className="w-full max-w-[1600px] mx-auto animate-fade-in">
            {children}
          </div>
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
