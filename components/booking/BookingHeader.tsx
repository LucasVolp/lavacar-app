"use client";

import { ArrowLeftOutlined, StarFilled, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Shop } from "@/types/shop";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Dropdown, MenuProps, Avatar } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BookingHeaderProps {
  shop: Shop;
  onBack: () => void;
  userName?: string;
}

export function BookingHeader({ shop, onBack }: BookingHeaderProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.refresh();
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: <Link href="/client">Meu Perfil</Link>,
      icon: <UserOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Sair',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#27272a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left - Back button + Shop info */}
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-[#27272a] group-hover:bg-slate-200 dark:group-hover:bg-[#3f3f46] transition-colors">
                <ArrowLeftOutlined />
              </div>
              <span className="hidden sm:inline text-sm font-medium">Voltar</span>
            </button>
            
            <div className="h-8 w-px bg-slate-200 dark:bg-[#27272a]" />
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-500/20">
                {shop.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-slate-900 dark:text-slate-50 font-bold text-lg leading-tight">
                  {shop.name}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {shop.neighborhood}, {shop.city}
                </p>
              </div>
            </div>
          </div>

          {/* Right - Rating & User */}
          <div className="flex items-center gap-6">
            <ThemeToggle />
            
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-500 text-sm font-medium">
              <StarFilled />
              <span>4.9</span>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-[#27272a] hidden sm:block" />

            {isAuthenticated && user ? (
              <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <Avatar 
                    className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-[#27272a] text-slate-500 dark:text-slate-400 font-bold"
                  >
                     {user.firstName?.charAt(0).toUpperCase()}
                  </Avatar>
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Logado como</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{user.firstName}</p>
                  </div>
                </div>
              </Dropdown>
            ) : (
                <div className="flex items-center gap-4">
                    <Link href="/auth/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                        Entrar
                    </Link>
                    <Link href="/auth/register" className="px-4 py-2 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:scale-105 transition-all">
                        Registrar
                    </Link>
                </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
