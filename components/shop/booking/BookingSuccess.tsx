"use client";

import { CheckCircleFilled } from "@ant-design/icons";
import { Services } from "@/types/services";
import { formatDisplayDate } from "@/utils/dateUtils";

interface BookingSuccessProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedServices: Services[];
  totalDuration: number;
  totalPrice: number;
  formatDuration: (minutes: number) => string;
  onReturnToShop: () => void;
  onReturnToHome: () => void;
}

export function BookingSuccess({
  selectedDate,
  selectedTime,
  selectedServices,
  totalDuration,
  totalPrice,
  formatDuration,
  onReturnToShop,
  onReturnToHome,
}: BookingSuccessProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-lg w-full text-center bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/50 transition-colors duration-300">
        <div className="py-12 px-8">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] transition-colors duration-300">
            <CheckCircleFilled className="text-5xl text-emerald-500" />
          </div>

          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-50 mb-2 transition-colors duration-300">
            Agendamento Confirmado!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 transition-colors duration-300">
            Seu agendamento foi realizado com sucesso.
          </p>

          {/* Booking Details */}
          <div className="bg-slate-50 dark:bg-[#27272a]/50 rounded-2xl p-6 mb-8 text-left space-y-4 border border-slate-100 dark:border-[#27272a] transition-colors duration-300">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300">Data</span>
              <span className="text-slate-800 dark:text-slate-50 font-medium transition-colors duration-300">
                {selectedDate ? formatDisplayDate(selectedDate) : '-'}
              </span>
            </div>
            <div className="h-px bg-slate-200 dark:bg-[#27272a] transition-colors duration-300" />
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300">Horário</span>
              <span className="text-slate-800 dark:text-slate-50 font-medium transition-colors duration-300">
                {selectedTime}
              </span>
            </div>
            <div className="h-px bg-slate-200 dark:bg-[#27272a] transition-colors duration-300" />
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300">Serviços</span>
              <span className="text-slate-800 dark:text-slate-50 font-medium transition-colors duration-300">
                {selectedServices.length} selecionado(s)
              </span>
            </div>
            <div className="h-px bg-slate-200 dark:bg-[#27272a] transition-colors duration-300" />
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300">Duração</span>
              <span className="text-slate-800 dark:text-slate-50 font-medium transition-colors duration-300">
                {formatDuration(totalDuration)}
              </span>
            </div>
            <div className="h-px bg-slate-200 dark:bg-[#27272a] transition-colors duration-300" />
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300">Total</span>
              <span className="text-emerald-500 font-bold text-xl transition-colors duration-300">
                {totalPrice.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onReturnToShop}
              className="flex-1 py-3 bg-slate-100 dark:bg-[#27272a] text-slate-800 dark:text-slate-50 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-[#3f3f46] transition-all"
            >
              Voltar para a Loja
            </button>
            <button
              onClick={onReturnToHome}
              className="flex-1 py-3 bg-slate-900 dark:bg-slate-50 text-white dark:text-black font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-white transition-all shadow-lg shadow-slate-900/10 dark:shadow-white/10"
            >
              Meus Agendamentos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
