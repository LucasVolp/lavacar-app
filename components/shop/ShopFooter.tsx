"use client";

import { CarFilled } from "@ant-design/icons";
import Link from "next/link";

interface ShopFooterProps {
  shopName: string;
}

export function ShopFooter({ shopName }: ShopFooterProps) {
  return (
    <footer className="bg-slate-50 dark:bg-[#09090b] text-slate-500 dark:text-slate-400 py-16 border-t border-slate-200 dark:border-[#27272a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-center">
          {/* Logo & Name */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <CarFilled className="text-white text-lg" />
               </div>
               <span className="text-slate-900 dark:text-slate-50 font-bold text-xl tracking-tight transition-colors duration-300">{shopName}</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex justify-center gap-8">
             <Link href="#" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
               Termos de Uso
             </Link>
             <Link href="#" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
               Privacidade
             </Link>
             <Link href="#" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
               Suporte
             </Link>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
             <p className="text-slate-400 dark:text-slate-600 text-xs uppercase tracking-wider font-bold mb-1 transition-colors duration-300">
                LavaCar System
             </p>
             <p className="text-slate-500 dark:text-slate-500 text-sm">
                © {new Date().getFullYear()} {shopName}.
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
