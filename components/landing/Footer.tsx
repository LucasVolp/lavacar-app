"use client";

import React from "react";
import Link from "next/link";
import { NexoLogo } from "@/components/ui/NexoLogo";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-base-content/10 bg-base-100 py-14 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-10 border-b border-base-content/5">
          <div className="flex items-center gap-3">
            <NexoLogo size={44} />
            <div>
              <div className="font-bold text-base-content">NexoCar</div>
              <div className="text-xs text-base-content/50 font-medium">Controle. Tecnologia. Clareza.</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-base-200 border border-base-content/10">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-base-content/80">
              Mais de 500 estéticas automotivas gerenciadas
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8">
          <div className="flex gap-8 text-sm text-base-content/60 font-medium">
            <Link href="/termos" target="_blank" rel="noreferrer" className="hover:text-base-content transition-colors">Termos</Link>
            <Link href="/privacidade" target="_blank" rel="noreferrer" className="hover:text-base-content transition-colors">Privacidade</Link>
            <Link href="mailto:suporte@nexocar.com.br" className="hover:text-base-content transition-colors">Suporte</Link>
          </div>

          <p className="text-base-content/50 text-sm">
            © {currentYear} NexoCar. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
