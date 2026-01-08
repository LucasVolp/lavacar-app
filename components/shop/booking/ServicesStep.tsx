"use client";

import { AppstoreOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { ServiceCard } from "@/components/booking";
import { Services } from "@/types/services";

interface ServicesStepProps {
  isLoading: boolean;
  services: Services[];
  selectedServices: Services[];
  onToggleService: (service: Services) => void;
  totalDuration: number;
  totalPrice: number;
  formatDuration: (minutes: number) => string;
}

export function ServicesStep({
  isLoading,
  services,
  selectedServices,
  onToggleService,
  totalDuration,
  totalPrice,
  formatDuration,
}: ServicesStepProps) {
  return (
    <div className="p-6 sm:p-10">
      {/* Step Header */}
      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-3xl shadow-lg shadow-pink-500/20">
          <AppstoreOutlined />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1 transition-colors duration-300">
            Escolha os Serviços
          </h2>
          <p className="text-slate-500 dark:text-slate-400 transition-colors duration-300">
            Selecione um ou mais serviços para o agendamento.
          </p>
        </div>
      </div>

      {/* Quick Summary Bar */}
      {selectedServices.length > 0 && (
        <div className="mb-8 p-4 bg-slate-50 dark:bg-[#09090b] rounded-2xl border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-between flex-wrap gap-4 shadow-lg shadow-indigo-500/5 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-200 dark:border-indigo-500/20 transition-colors duration-300">
              {selectedServices.length} selecionado(s)
            </span>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors duration-300">
              <ClockCircleOutlined />
              <span>{formatDuration(totalDuration)}</span>
            </div>
          </div>
          <span className="text-slate-900 dark:text-slate-50 font-bold text-lg transition-colors duration-300">
            {totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-[#09090b] rounded-3xl border border-slate-200 dark:border-[#27272a] border-dashed transition-colors duration-300">
          <p className="text-slate-500 dark:text-slate-400 transition-colors duration-300">Nenhum serviço disponível.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services
            .filter((s) => s.isActive !== false)
            .map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                selected={selectedServices.some((s) => s.id === service.id)}
                onSelect={onToggleService}
              />
            ))}
        </div>
      )}
    </div>
  );
}
