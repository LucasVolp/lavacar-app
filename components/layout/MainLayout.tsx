"use client";

import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { NexoLogo } from "@/components/ui/NexoLogo";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <NexoLogo size={62} className="animate-pulse" />
          <span className="text-base-content/60 text-sm">Carregando NexoCar...</span>
        </div>
      </div>
    );
  }

  return (
    <Layout className="min-h-screen" style={{ backgroundColor: "transparent" }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />

      <Layout
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{ backgroundColor: "transparent" }}
      >
        <Header collapsed={collapsed} onToggleSidebar={() => setCollapsed(!collapsed)} />

        <Content
          className="flex-1 overflow-auto p-6"
          style={{
            minHeight: "calc(100vh - 64px - 70px)",
            backgroundColor: "transparent",
          }}
        >
          {children}
        </Content>

        <Footer />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
