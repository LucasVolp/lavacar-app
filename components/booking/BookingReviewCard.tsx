"use client";

import { CheckCircleFilled } from "@ant-design/icons";
import { Services, ServiceVariant } from "@/types/services";
import { formatDisplayDate } from "@/utils/dateUtils";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  plate?: string;
  color?: string;
}

interface BookingReviewCardProps {
  selectedServices: Services[];
  selectedVehicle: Vehicle | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  totalPrice: number;
  totalDuration: number;
  isLoading?: boolean;
  disabled?: boolean;
  onConfirm: () => void;
  vehicleSize?: string;
}

function getEffectivePrice(service: Services, vehicleSize?: string): number {
  if (service.hasVariants && service.variants?.length && vehicleSize) {
    const variant = service.variants.find((v: ServiceVariant) => v.size === vehicleSize);
    if (variant) return typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price;
  }
  return typeof service.price === 'string' ? parseFloat(service.price) : service.price;
}

function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

export function BookingReviewCard({
  selectedServices,
  selectedVehicle,
  selectedDate,
  selectedTime,
  totalPrice,
  totalDuration,
  isLoading,
  disabled,
  onConfirm,
  vehicleSize,
}: BookingReviewCardProps) {
  const hasVehicle = !!selectedVehicle;
  const hasServices = selectedServices.length > 0;
  const hasDateTime = !!selectedDate && !!selectedTime;
  const isComplete = hasVehicle && hasServices && hasDateTime;

  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200 dark:border-[#27272a] shadow-xl shadow-indigo-500/5 dark:shadow-black/40 sticky top-24 overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-slate-200 dark:border-[#27272a] transition-colors duration-300">
        <h3 className="text-slate-900 dark:text-slate-50 font-bold text-lg mb-1 transition-colors duration-300">
          Resumo do Agendamento
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">
          {isComplete ? "Tudo pronto! Revise e confirme." : "Complete as etapas para finalizar."}
        </p>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex gap-4 group">
           <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${hasVehicle ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-500" : "bg-transparent border-slate-200 dark:border-[#27272a] text-slate-300 dark:text-[#52525b]"}`}>
               {hasVehicle ? <CheckCircleFilled className="text-sm" /> : <span className="text-xs font-bold">1</span>}
           </div>
           <div>
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 transition-colors duration-300">VEÍCULO</div>
              {hasVehicle ? (
                 <div className="text-slate-800 dark:text-slate-200 text-sm font-medium transition-colors duration-300">{selectedVehicle.brand} {selectedVehicle.model}</div>
              ) : (
                <div className="text-slate-400 dark:text-[#52525b] text-sm italic transition-colors duration-300">Pendente...</div>
              )}
           </div>
        </div>

         <div className="flex gap-4 group">
           <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${hasServices ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-500" : "bg-transparent border-slate-200 dark:border-[#27272a] text-slate-300 dark:text-[#52525b]"}`}>
               {hasServices ? <CheckCircleFilled className="text-sm" /> : <span className="text-xs font-bold">2</span>}
           </div>
           <div className="flex-1">
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 transition-colors duration-300">SERVIÇOS</div>
              {hasServices ? (
                 <div className="space-y-1">
                    {selectedServices.map(s => (
                       <div key={s.id} className="flex justify-between text-sm">
                          <span className="text-slate-700 dark:text-slate-200 transition-colors duration-300">{s.name}</span>
                          <span className="text-slate-500 transition-colors duration-300">{formatPrice(getEffectivePrice(s, vehicleSize))}</span>
                       </div>
                    ))}
                 </div>
              ) : (
                <div className="text-slate-400 dark:text-[#52525b] text-sm italic transition-colors duration-300">Pendente...</div>
              )}
           </div>
        </div>

        <div className="flex gap-4 group">
           <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${hasDateTime ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-500" : "bg-transparent border-slate-200 dark:border-[#27272a] text-slate-300 dark:text-[#52525b]"}`}>
               {hasDateTime ? <CheckCircleFilled className="text-sm" /> : <span className="text-xs font-bold">3</span>}
           </div>
           <div>
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 transition-colors duration-300">DATA E HORA</div>
              {hasDateTime ? (
                 <div className="text-slate-800 dark:text-slate-200 text-sm font-medium transition-colors duration-300">
                    {formatDisplayDate(selectedDate)} às {selectedTime}
                 </div>
              ) : (
                <div className="text-slate-400 dark:text-[#52525b] text-sm italic transition-colors duration-300">Pendente...</div>
              )}
           </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-[#09090b] p-6 border-t border-slate-200 dark:border-[#27272a] transition-colors duration-300">
         <div className="flex justify-between items-end mb-6">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors duration-300">Total Estimado</span>
            <div className="text-right">
               <span className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight transition-colors duration-300">{formatPrice(totalPrice)}</span>
               <div className="text-slate-500 text-xs mt-1 transition-colors duration-300">{formatDuration(totalDuration)} de duração</div>
            </div>
         </div>

         <button
            onClick={onConfirm}
            disabled={disabled || !isComplete}
            className={`
               w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300
               ${disabled || !isComplete 
                  ? "bg-slate-200 dark:bg-[#27272a] text-slate-400 dark:text-slate-500 cursor-not-allowed" 
                  : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-black dark:hover:bg-white hover:shadow-lg dark:hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] hover:-translate-y-0.5"
               }
            `}
         >
            {isLoading ? (
               <div className="flex items-center justify-center gap-2">
                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                 Confirmando...
               </div>
            ) : "CONFIRMAR AGENDAMENTO"}
         </button>
      </div>
    </div>
  );
}
