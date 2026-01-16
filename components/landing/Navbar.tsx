"use client";

import React from "react";
import Link from "next/link";
import { Button } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-base-content/5 bg-base-100/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="text-base-content font-semibold text-lg tracking-tight">
            Lavacar
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button 
              type="text" 
              icon={<LoginOutlined />}
              className="text-base-content/60 hover:text-base-content hover:bg-base-content/5 border-transparent flex items-center gap-2"
            >
              Entrar
            </Button>
          </Link>
          <div className="hidden sm:block w-px h-6 bg-base-content/10" />
          <ThemeToggle className="!w-9 !h-9" />
        </div>
      </div>
    </nav>
  );
};
