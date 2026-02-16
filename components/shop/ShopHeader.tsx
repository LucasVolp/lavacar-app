"use client";

import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Dropdown, MenuProps, Avatar, Spin } from "antd";
import { 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined, 
  CalendarOutlined,
  LoginOutlined,
  UserAddOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ShopHeader() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link href="/client/profile">Meu Perfil</Link>,
    },
    {
      key: "appointments",
      icon: <CalendarOutlined />,
      label: <Link href="/client/appointments">Agendamentos</Link>,
    },
    {
        key: "settings",
        icon: <SettingOutlined />,
        label: <Link href="/client/profile">Configurações</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sair",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
      <ThemeToggle />
      
      {isLoading ? (
        <div className="h-10 w-10 flex items-center justify-center bg-white dark:bg-[#27272a] rounded-xl shadow-lg border border-slate-100 dark:border-[#3f3f46]">
            <Spin size="small" />
        </div>
      ) : isAuthenticated ? (
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
          <div className="cursor-pointer h-10 px-3 flex items-center gap-2 bg-white dark:bg-[#27272a] hover:bg-slate-50 dark:hover:bg-[#3f3f46] text-slate-700 dark:text-slate-200 rounded-xl shadow-lg border border-slate-100 dark:border-[#3f3f46] transition-all duration-300">
            <Avatar 
                size="small" 
                className="bg-indigo-500"
                src={user?.picture || undefined}
                icon={<UserOutlined />}
            >
                {user?.firstName?.[0]?.toUpperCase()}
            </Avatar>
            <span className="font-medium hidden sm:inline-block max-w-[100px] truncate">
                {user?.firstName}
            </span>
          </div>
        </Dropdown>
      ) : (
        <div className="flex items-center gap-2">
            <Link href="/auth/login">
                <Button 
                    type="primary" 
                    icon={<LoginOutlined />}
                    className="h-10 rounded-xl font-medium shadow-lg shadow-indigo-500/20"
                >
                    Entrar
                </Button>
            </Link>
            <Link href="/auth/register" className="hidden sm:inline-block">
                <Button 
                    className="h-10 rounded-xl font-medium bg-white dark:bg-[#27272a] border-slate-200 dark:border-[#3f3f46] hover:text-indigo-500 dark:hover:text-indigo-400"
                    icon={<UserAddOutlined />}
                >
                    Registrar
                </Button>
            </Link>
        </div>
      )}
    </div>
  );
}
