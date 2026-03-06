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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Left - Back button + Shop info */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-6 min-w-0 flex-1">
            <button
              onClick={onBack}
              className="group flex items-center gap-1.5 sm:gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors shrink-0"
            >
              <div className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-[#27272a] group-hover:bg-slate-200 dark:group-hover:bg-[#3f3f46] transition-colors">
                <ArrowLeftOutlined className="text-xs sm:text-sm md:text-base" />
              </div>
              <span className="hidden md:inline text-sm font-medium">Voltar</span>
            </button>

            <div className="h-6 sm:h-8 w-px bg-slate-200 dark:bg-[#27272a] hidden sm:block shrink-0" />

            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm md:text-lg font-bold shadow-lg shadow-indigo-500/20 shrink-0">
                {shop.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h1 className="text-slate-900 dark:text-slate-50 font-bold text-sm sm:text-base md:text-lg leading-tight truncate">
                  {shop.name}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs items-center gap-1 sm:gap-1.5 hidden xs:flex truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="truncate">{shop.neighborhood}, {shop.city}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right - Compact on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-6 shrink-0 ml-2">
            <ThemeToggle />

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-500 text-sm font-medium">
              <StarFilled />
              <span>4.9</span>
            </div>

            <div className="h-6 sm:h-8 w-px bg-slate-200 dark:bg-[#27272a] hidden md:block" />

            {isAuthenticated && user ? (
              <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                <div className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <Avatar
                    className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-[#27272a] text-slate-500 dark:text-slate-400 font-bold !w-7 !h-7 sm:!w-8 sm:!h-8 !text-xs sm:!text-sm !leading-7 sm:!leading-8"
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
              <div className="flex items-center gap-1.5 sm:gap-3">
                <Link href="/auth/login" className="hidden sm:inline text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap">
                  Entrar
                </Link>
                <Link href="/auth/register" className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-[11px] sm:text-xs md:text-sm font-bold rounded-lg sm:rounded-xl hover:scale-105 transition-all whitespace-nowrap">
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
