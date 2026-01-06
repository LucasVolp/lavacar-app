"use client";

import React from "react";
import {
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SettingOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Badge, Button, Dropdown, Layout, Typography } from "antd";
import { useTheme } from "next-themes";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ collapsed, onToggleSidebar }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const borderColor = isDarkMode
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(0, 0, 0, 0.06)";
  const shadowColor = isDarkMode ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.03)";

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Meu Perfil",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Configurações",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <UserOutlined />,
      label: "Sair",
      danger: true,
    },
  ];

  return (
    <AntHeader
      className="flex items-center justify-between px-4 sticky top-0 z-40"
      style={{
        width: "100%",
        padding: "0 16px",
        borderBottom: `1px solid ${borderColor}`,
        boxShadow: `0 1px 2px 0 ${shadowColor}`,
        marginLeft: collapsed ? 80 : 260,
        transition: "margin-left 0.2s",
      }}
    >
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleSidebar}
          className="text-lg hover:bg-base-200 transition-colors"
        />

        <div className="hidden sm:flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <div className="flex flex-col">
            <Text strong className="text-lg leading-tight">
              Lavacar
            </Text>
            <Text type="secondary" className="text-xs leading-tight">
              Sistema de Agendamentos
            </Text>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="text"
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          className="hover:bg-base-200 transition-colors"
          title={isDarkMode ? "Modo claro" : "Modo escuro"}
        />

        <Badge count={3} size="small">
          <Button
            type="text"
            icon={<BellOutlined />}
            className="hover:bg-base-200 transition-colors"
          />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight">
          <Avatar
            size={36}
            icon={<UserOutlined />}
            className="cursor-pointer bg-primary hover:opacity-80 transition-opacity"
          />
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;
