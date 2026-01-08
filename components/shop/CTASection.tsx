"use client";

import { CalendarFilled, CheckCircleFilled } from "@ant-design/icons";

interface CTASectionProps {
  shopName: string;
  onBooking: () => void;
}

export function CTASection({ shopName, onBooking }: CTASectionProps) {
  return (
    <section className="relative py-32 overflow-hidden bg-slate-50 dark:bg-[#09090b] border-t border-slate-200 dark:border-[#27272a] transition-colors duration-300">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="inline-flex items-center justify-center p-3 mb-8 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]">
           <span className="text-3xl">✨</span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-700 to-slate-500 dark:from-slate-50 dark:via-slate-200 dark:to-slate-400 mb-6 tracking-tight transition-all duration-300">
          Pronto para elevar o nível?
        </h2>
        
        <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-lg mb-12 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
          Agende agora mesmo em <strong className="text-slate-900 dark:text-slate-200">{shopName}</strong> e experimente um serviço automotivo de classe mundial. Cuidado, precisão e excelência.
        </p>

        <button
          onClick={onBooking}
          className="group relative inline-flex items-center gap-3 px-10 py-5 bg-slate-900 dark:bg-slate-50 text-white dark:text-black text-lg font-bold rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:bg-slate-800 dark:hover:bg-white"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none mix-blend-color-burn" />
          <CalendarFilled className="text-xl" />
          <span>Agendar Serviço Agora</span>
        </button>
        
        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-12 text-slate-500 dark:text-slate-500 text-sm font-medium">
          <div className="flex items-center gap-2">
            <CheckCircleFilled className="text-emerald-500" />
            <span>Agendamento rápido</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <div className="flex items-center gap-2">
            <CheckCircleFilled className="text-emerald-500" />
            <span>Confirmação imediata</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <div className="flex items-center gap-2">
            <CheckCircleFilled className="text-emerald-500" />
            <span>Sem compromisso</span>
          </div>
        </div>
      </div>
    </section>
  );
}
