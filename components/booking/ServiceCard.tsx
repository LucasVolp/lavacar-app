"use client";

import { Services, ServiceVariant } from "@/types/services";
import { ClockCircleOutlined, DollarOutlined, CheckCircleFilled, PictureOutlined } from "@ant-design/icons";

function getEffectivePricing(service: Services, vehicleSize?: string): { price: string; duration: number } {
  if (service.hasVariants && service.variants?.length && vehicleSize) {
    const variant = service.variants.find((v: ServiceVariant) => v.size === vehicleSize);
    if (variant) return { price: variant.price, duration: variant.duration };
  }
  return { price: service.price, duration: service.duration };
}

interface ServiceCardProps {
  service: Services;
  selected?: boolean;
  onSelect?: (service: Services) => void;
  vehicleSize?: string;
}

export function ServiceCard({
  service,
  selected = false,
  onSelect,
  vehicleSize,
}: ServiceCardProps) {
  const effective = getEffectivePricing(service, vehicleSize);

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
        relative overflow-hidden group p-0 rounded-xl border transition-all duration-300 cursor-pointer h-full flex flex-col
        ${
          selected
            ? "bg-slate-50 dark:bg-[#18181b] border-indigo-500 dark:border-slate-50 shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)] dark:shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)] scale-[1.02]"
            : "bg-white dark:bg-[#18181b] border-slate-200 dark:border-[#27272a] hover:border-slate-400 dark:hover:border-slate-500 hover:scale-[1.01]"
        }
      `}
    >
      {service.photoUrl ? (
        <div className="relative w-full h-28 sm:h-36 overflow-hidden">
          <img
            src={service.photoUrl}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
            }}
          />
          <div className="hidden w-full h-full bg-slate-100 dark:bg-[#27272a] flex items-center justify-center">
            <PictureOutlined className="text-3xl text-slate-400" />
          </div>
        </div>
      ) : null}

      {selected && (
        <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-200 z-10">
          <CheckCircleFilled className="text-emerald-500 dark:text-emerald-400 text-xl shadow-lg rounded-full bg-white dark:bg-black/50" />
        </div>
      )}

      <div className="flex flex-col gap-3 sm:gap-4 flex-1 p-4 sm:p-6">
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
              <span>{formatPrice(effective.price)}</span>
           </div>
           
           <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm px-2">
              <ClockCircleOutlined />
              <span>{formatDuration(effective.duration)}</span>
           </div>

           {service.hasVariants && vehicleSize && (
             <span className="text-[10px] font-semibold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full ml-auto">
               {vehicleSize === "SMALL" ? "P" : vehicleSize === "MEDIUM" ? "M" : vehicleSize === "LARGE" ? "G" : vehicleSize}
             </span>
           )}
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
