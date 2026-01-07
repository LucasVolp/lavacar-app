"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, useEffect, ReactNode } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Locale } from "antd/lib/locale";
import { App, ConfigProvider } from "antd";
import ptBR from "antd/lib/locale/pt_BR";
import { AuthProvider } from "@/contexts/AuthContext";
import { ShopProvider } from "@/contexts/ShopContext";
import { OrganizationProvider } from "@/contexts/OrganizationContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            retry: 1,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ShopProvider>
            <OrganizationProvider>
              {children}
            </OrganizationProvider>
          </ShopProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

// Color palette definition
const colors = {
  primary: "#6366f1", // Indigo
  secondary: "#5046e5",
  success: "#52c41a",
  warning: "#faad14",
  error: "#f5222d",
  info: "#1677ff",

  light: {
    textBase: "#1f1f1f",
    textHeading: "#000000",
    textSecondary: "#606060",
    textPlaceholder: "#757575",
    bgBase: "#ffffff",
    bgContainer: "#ffffff",
    bgElevated: "#ffffff",
    bgLayout: "#f5f5f5",
    border: "#d9d9d9",
    borderSecondary: "#f0f0f0",
    hoverBg: "#f5f5f5",
    footerBg: "#f9fafb",
  },

  dark: {
    textBase: "#e6e6e6",
    textHeading: "#f5f5f5",
    textSecondary: "#b0b0b0",
    textPlaceholder: "#a0a0a0",
    bgBase: "#121212",
    bgContainer: "#1e1e1e",
    bgElevated: "#282828",
    bgLayout: "#141414",
    sider: "#1a1a1a",
    border: "#303030",
    borderSecondary: "#404040",
    hoverBg: "#303030",
    footerBg: "#1a1a1a",
    headerBg: "#1a1a1a",
  },
};

interface ThemeAwareConfigProviderProps {
  children: ReactNode;
  locale?: Locale;
  fontFamily?: string;
}

export default function ThemeAwareConfigProvider({
  children,
  locale = ptBR,
  fontFamily,
}: ThemeAwareConfigProviderProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDarkMode = mounted && resolvedTheme === "dark";

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          colorPrimary: colors.primary,
          colorSuccess: colors.success,
          colorWarning: colors.warning,
          colorError: colors.error,
          colorInfo: colors.info,
          borderRadius: 6,
          fontFamily: fontFamily,
          fontSize: 14,
          colorIcon: isDarkMode ? colors.dark.textBase : colors.light.textBase,
          colorTextBase: isDarkMode ? colors.dark.textBase : colors.light.textBase,
          colorTextHeading: isDarkMode ? colors.dark.textHeading : colors.light.textHeading,
          colorTextPlaceholder: isDarkMode ? colors.dark.textPlaceholder : colors.light.textPlaceholder,
          colorTextDescription: isDarkMode ? colors.dark.textSecondary : colors.light.textSecondary,
          colorBgBase: isDarkMode ? colors.dark.bgBase : colors.light.bgBase,
          colorBgContainer: isDarkMode ? colors.dark.bgContainer : colors.light.bgContainer,
          colorBgElevated: isDarkMode ? colors.dark.bgElevated : colors.light.bgElevated,
          colorBgLayout: isDarkMode ? colors.dark.bgLayout : colors.light.bgLayout,
          colorBorder: isDarkMode ? colors.dark.border : colors.light.border,
          colorBorderSecondary: isDarkMode ? colors.dark.borderSecondary : colors.light.borderSecondary,
        },
        components: {
          Layout: {
            siderBg: isDarkMode ? colors.dark.sider : colors.light.bgContainer,
            lightSiderBg: isDarkMode ? colors.dark.sider : colors.light.bgContainer,
            headerBg: isDarkMode ? colors.dark.headerBg : colors.light.bgContainer,
            headerColor: isDarkMode ? colors.dark.textBase : colors.light.textBase,
            headerHeight: 64,
            headerPadding: "0 24px",
            bodyBg: isDarkMode ? colors.dark.bgLayout : colors.light.bgLayout,
            footerBg: isDarkMode ? colors.dark.footerBg : colors.light.footerBg,
            footerPadding: "24px 50px",
          },
          Button: {
            primaryColor: "#ffffff",
            primaryShadow: "0 2px 0 rgba(0, 0, 0, 0.045)",
            colorPrimary: colors.primary,
            defaultBorderColor: isDarkMode ? colors.dark.border : colors.light.border,
            defaultColor: isDarkMode ? colors.dark.textBase : colors.light.textBase,
            defaultBg: isDarkMode ? colors.dark.bgContainer : colors.light.bgContainer,
          },
          Card: {
            colorBgContainer: isDarkMode ? colors.dark.bgContainer : colors.light.bgContainer,
            colorBorderSecondary: isDarkMode ? colors.dark.border : colors.light.border,
            borderRadiusLG: 8,
          },
          Input: {
            colorBgContainer: isDarkMode ? colors.dark.bgContainer : colors.light.bgContainer,
            colorBorder: isDarkMode ? colors.dark.border : colors.light.border,
            hoverBorderColor: colors.primary,
            activeBorderColor: colors.primary,
          },
          Select: {
            colorBgContainer: isDarkMode ? colors.dark.bgContainer : colors.light.bgContainer,
            colorBorder: isDarkMode ? colors.dark.border : colors.light.border,
            optionSelectedBg: isDarkMode ? colors.dark.hoverBg : colors.light.hoverBg,
          },
          Modal: {
            contentBg: isDarkMode ? colors.dark.bgContainer : colors.light.bgContainer,
            headerBg: isDarkMode ? colors.dark.bgContainer : colors.light.bgContainer,
          },
          Table: {
            colorBgContainer: isDarkMode ? colors.dark.bgContainer : colors.light.bgContainer,
            headerBg: isDarkMode ? colors.dark.bgElevated : colors.light.bgLayout,
            rowHoverBg: isDarkMode ? colors.dark.hoverBg : colors.light.hoverBg,
          },
          Menu: {
            itemBg: "transparent",
            subMenuItemBg: "transparent",
            itemHoverBg: isDarkMode ? colors.dark.hoverBg : colors.light.hoverBg,
            itemSelectedBg: isDarkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.1)",
            itemSelectedColor: colors.primary,
          },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
