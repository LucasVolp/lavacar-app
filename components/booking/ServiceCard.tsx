"use client";

import { Services } from "@/types/services";
import { ClockCircleOutlined, DollarOutlined, CheckCircleFilled } from "@ant-design/icons";

interface ServiceCardProps {
  service: Services;
  selected?: boolean;
  onSelect?: (service: Services) => void;
}

export function ServiceCard({
  service,
  selected = false,
  onSelect,
}: ServiceCardProps) {
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return numPrice.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div
      onClick={() => onSelect?.(service)}
      className={`
        relative overflow-hidden group p-6 rounded-xl border transition-all duration-300 cursor-pointer h-full flex flex-col
        ${
          selected
            ? "bg-slate-50 dark:bg-[#18181b] border-indigo-500 dark:border-slate-50 shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)] dark:shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)] scale-[1.02]"
            : "bg-white dark:bg-[#18181b] border-slate-200 dark:border-[#27272a] hover:border-slate-400 dark:hover:border-slate-500 hover:scale-[1.01]"
        }
      `}
    >
      {/* Selection Indicator */}
      {selected && (
        <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-200">
          <CheckCircleFilled className="text-emerald-500 dark:text-emerald-400 text-xl shadow-lg rounded-full bg-white dark:bg-black/50" />
        </div>
      )}

      <div className="flex flex-col gap-4 flex-1">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2 leading-tight tracking-tight pr-8 service-title transition-colors duration-300">
            {service.name}
          </h3>
          {service.description && (
             <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-0 line-clamp-3 transition-colors duration-300">
               {service.description}
             </p>
          )}
        </div>

        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-100 dark:border-[#27272a] transition-colors duration-300">
           <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
              <DollarOutlined />
              <span>{formatPrice(service.price)}</span>
           </div>
           
           <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm px-2">
              <ClockCircleOutlined />
              <span>{formatDuration(service.duration)}</span>
           </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
