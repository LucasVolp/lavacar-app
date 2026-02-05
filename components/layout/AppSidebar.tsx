"use client";

import React, { useState, useEffect } from "react";
import { Menu, Button, Tooltip, Typography } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Title, Text } = Typography;

interface AppSidebarProps {
  /** Largura da sidebar quando expandida */
  width?: number;
  /** Largura da sidebar quando colapsada */
  collapsedWidth?: number;
  /** Logo/ícone do topo */
  logo: React.ReactNode;
  /** Título principal */
  title: string;
  /** Subtítulo (opcional) */
  subtitle?: string;
  /** Items do menu */
  menuItems: MenuProps["items"];
  /** Key selecionada no menu */
  selectedKey: string;
  /** Callback ao clicar em item do menu */
  onMenuClick: (key: string) => void;
  /** Conteúdo adicional no footer (opcional) */
  footerContent?: React.ReactNode;
  /** Cor da borda */
  borderColor?: string;
  /** Cor de fundo do logo */
  logoGradient?: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  width = 280,
  collapsedWidth = 80,
  logo,
  title,
  subtitle,
  menuItems,
  selectedKey,
  onMenuClick,
  footerContent,
  borderColor = "rgba(0, 0, 0, 0.06)",
  logoGradient = "from-violet-600 to-indigo-600",
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  if (!mounted) {
    return (
      <aside
        className="fixed left-0 top-0 h-screen z-50 bg-white"
        style={{ width: collapsedWidth, borderRight: `1px solid ${borderColor}` }}
      >
        <div className="flex items-center justify-center h-16">
          <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Sidebar Fixa */}
      <aside
        className="fixed left-0 top-0 h-screen z-50 bg-white transition-all duration-200"
        style={{ 
          width: collapsed ? collapsedWidth : width,
          borderRight: `1px solid ${borderColor}`,
        }}
      >
        {/* Header/Logo */}
        <div 
          className="px-4 py-5 border-b"
          style={{ minHeight: 72, borderColor }}
        >
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${logoGradient} flex items-center justify-center shadow-lg`}>
                {logo}
              </div>
              <div className="flex-1 min-w-0">
                <Title level={5} className="!m-0 truncate !text-[15px] !font-bold !text-slate-800">
                  {title}
                </Title>
                {subtitle && (
                  <Text className="text-xs text-slate-400 font-medium">
                    {subtitle}
                  </Text>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${logoGradient} flex items-center justify-center shadow-lg`}>
                {logo}
              </div>
            </div>
          )}
        </div>

        {/* Menu de Navegação */}
        <div 
          className="overflow-y-auto overflow-x-hidden"
          style={{ 
            height: footerContent 
              ? `calc(100vh - 72px - ${collapsed ? "64px" : "120px"})` 
              : "calc(100vh - 136px)"
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => onMenuClick(key)}
            className="border-none"
            inlineCollapsed={collapsed}
            style={{ paddingTop: "8px", paddingBottom: "16px" }}
          />
        </div>

        {/* Footer */}
        <div 
          className="absolute bottom-0 left-0 right-0 border-t bg-white"
          style={{ borderColor }}
        >
          {footerContent && !collapsed && (
            <div className="px-4 py-3 border-b" style={{ borderColor }}>
              {footerContent}
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

      {/* Spacer para o conteúdo principal */}
      <div 
        className="transition-all duration-200"
        style={{ width: collapsed ? collapsedWidth : width }}
      />
    </>
  );
};

export default AppSidebar;
