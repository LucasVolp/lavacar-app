"use client";

import React from "react";
import Link from "next/link";
import { Button, Dropdown, Avatar } from "antd";
import { NexoLogo } from "@/components/ui/NexoLogo";
import { LoginOutlined, UserOutlined, DashboardOutlined, LogoutOutlined, CarOutlined } from "@ant-design/icons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Área do Cliente',
      onClick: () => router.push('/client')
    },
    {
      key: 'business',
      icon: <CarOutlined />,
      label: 'Meus Negócios',
      onClick: () => router.push('/organization')
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sair',
      danger: true,
      onClick: logout
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-base-content/5 bg-base-100/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <NexoLogo size={62} />
          <span className="text-base-content font-semibold text-lg tracking-tight">
            NexoCar
          </span>
        </Link>

        <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1 bg-base-200/60 dark:bg-base-200/40 p-1 rounded-xl border border-base-content/[0.06] backdrop-blur-xl shadow-sm">
            <NavLink href="#benefits">Benefícios</NavLink>
            <NavLink href="#features">Funcionalidades</NavLink>
            <NavLink href="#pricing">Planos</NavLink>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
              <div className="flex items-center gap-3 cursor-pointer p-1 rounded-full hover:bg-base-content/5 transition-colors">
                <Avatar 
                  src={user?.picture} 
                  icon={<UserOutlined />} 
                  className="bg-primary text-white"
                />
                <span className="hidden sm:block text-sm font-medium text-base-content">
                  {user?.firstName}
                </span>
              </div>
            </Dropdown>
          ) : (
            <Link href="/auth/login">
              <Button 
                type="text" 
                icon={<LoginOutlined />}
                className="text-base-content/60 hover:text-base-content hover:bg-base-content/5 border-transparent flex items-center gap-2"
              >
                Entrar
              </Button>
            </Link>
          )}
          
          <div className="hidden sm:block w-px h-6 bg-base-content/10" />
          <ThemeToggle className="!w-9 !h-9" />
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Link 
      href={href}
      onClick={handleClick}
      className="group relative px-4 py-2 rounded-lg"
    >
      <span className="absolute inset-0 rounded-lg bg-base-content/[0.03] group-hover:bg-base-content/[0.08] transition-all duration-200" />

      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full group-hover:h-4 transition-all duration-200" />

      <span className="relative z-10 text-[13px] font-medium tracking-wide text-base-content/70 group-hover:text-base-content transition-colors duration-200">
        {children}
      </span>
    </Link>
  );
};