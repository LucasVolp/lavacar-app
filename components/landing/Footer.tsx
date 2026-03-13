"use client";

import React from "react";
import Link from "next/link";
import { Typography } from "antd";
import { NexoLogo } from "@/components/ui/NexoLogo";

const { Text } = Typography;

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-base-content/5 bg-base-100 py-12 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <NexoLogo size={40} />
          <span className="text-base-content/60 font-medium">NexoCar</span>
        </div>

        <div className="flex gap-8 text-sm text-base-content/50">
          <Link href="#" className="hover:text-base-content transition-colors">Termos</Link>
          <Link href="#" className="hover:text-base-content transition-colors">Privacidade</Link>
          <Link href="#" className="hover:text-base-content transition-colors">Suporte</Link>
        </div>

        <Text className="text-base-content/50 text-sm">
          © {currentYear} NexoCar. Todos os direitos reservados.
        </Text>
      </div>
    </footer>
  );
};
