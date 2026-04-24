"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { NexoLogo } from "@/components/ui/NexoLogo";

interface AuthShellProps {
  title: string;
  subtitle: string;
  heroTitle?: string;
  heroDescription?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
}

const DEFAULT_HERO_TITLE = "Gerencie sua estética automotiva com excelência";
const DEFAULT_HERO_DESCRIPTION =
  "Junte-se a milhares de estabelecimentos que transformaram sua gestão com o NexoCar.";

export const AuthShell: React.FC<AuthShellProps> = ({
  title,
  subtitle,
  heroTitle = DEFAULT_HERO_TITLE,
  heroDescription = DEFAULT_HERO_DESCRIPTION,
  backHref = "/auth/login",
  backLabel = "Voltar para o login",
  children,
}) => {
  return (
    <div className="min-h-screen flex bg-white dark:bg-black transition-colors duration-300">
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24 relative">
        <Link
          href={backHref}
          className="absolute top-8 left-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeftOutlined /> {backLabel}
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 leading-[1.2]">
              {title}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 leading-[1.7]">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-zinc-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2300&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30" />

        <div className="relative z-10 max-w-lg text-center p-12">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-8">
            <NexoLogo size={62} />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            {heroTitle}
          </h2>
          <p className="text-lg text-white/70 leading-relaxed">
            {heroDescription}
          </p>
        </div>
      </div>
    </div>
  );
};
