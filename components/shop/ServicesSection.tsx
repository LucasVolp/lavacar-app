"use client";

import {
  ClockCircleOutlined,
  ArrowRightOutlined,
  FireFilled,
  ThunderboltFilled,
  PictureOutlined,
} from "@ant-design/icons";
import { Services } from "@/types/services";

interface ServicesSectionProps {
  services: Services[];
  isLoading?: boolean;
  onBooking: () => void;
}

function formatPrice(price: string | number): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return numPrice.toLocaleString("pt-BR", {
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

function ServiceCard({
  service,
  isPopular,
  onBooking,
}: {
  service: Services;
  isPopular?: boolean;
  onBooking: () => void;
}) {
  return (
    <div
      onClick={onBooking}
      className={`
        group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer
        ${isPopular 
          ? "bg-white dark:bg-[#18181b] border-indigo-500/50 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20" 
          : "bg-white dark:bg-[#18181b] border-slate-200 dark:border-[#27272a] hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-[#27272a]"
        }
      `}
    >
      {service.photoUrl ? (
        <div className="relative w-full h-40 overflow-hidden">
          <img
            src={service.photoUrl}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      ) : (
        <div className="w-full h-20 bg-slate-50 dark:bg-[#27272a] flex items-center justify-center">
          <PictureOutlined className="text-2xl text-slate-300 dark:text-slate-600" />
        </div>
      )}

      {isPopular && (
        <div className="absolute top-0 right-0 z-10 transition-opacity">
          <div className="bg-indigo-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl shadow-lg flex items-center gap-1">
            <FireFilled /> Popular
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="mb-4">
          <h4 className="text-slate-900 dark:text-slate-50 font-bold text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {service.name}
          </h4>
          {service.description && (
            <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 h-10 transition-colors">
              {service.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-500 text-xs font-medium uppercase tracking-wide">
            <ClockCircleOutlined />
            <span>
              {formatDuration(service.duration)}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between pt-4 border-t border-slate-100 dark:border-[#27272a] group-hover:border-slate-200 dark:group-hover:border-slate-700/50 transition-colors">
          <div>
            <span className="text-slate-500 dark:text-slate-500 text-xs block mb-1">
              Investimento
            </span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-50 transition-colors">
              {formatPrice(service.price)}
            </span>
          </div>
          
          <button
            className={`
              w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
              ${isPopular 
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" 
                : "bg-slate-100 dark:bg-[#27272a] text-slate-500 dark:text-slate-400 group-hover:bg-indigo-500 group-hover:text-white"
              }
            `}
          >
            <ArrowRightOutlined className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ServicesSection({
  services,
  isLoading,
  onBooking,
}: ServicesSectionProps) {
  const activeServices = services.filter((s) => s.isActive !== false);

  if (isLoading) {
    return (
      <section className="py-24 bg-slate-50 dark:bg-[#09090b] border-y border-slate-200 dark:border-[#27272a] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
               <div key={i} className="h-64 rounded-2xl bg-white dark:bg-[#18181b] animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-slate-50 dark:bg-[#09090b] border-y border-slate-200 dark:border-[#27272a] relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-500/20">
              <ThunderboltFilled />
              <span>Serviços Premium</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4 tracking-tight transition-colors duration-300">
              Excelência em cada detalhe.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl transition-colors duration-300">
              Escolha entre nossos pacotes especializados, projetados para revitalizar seu veículo com precisão e cuidado.
            </p>
          </div>
          
          <button
            onClick={onBooking}
            className="group flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
          >
            Ver catálogo completo 
            <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {activeServices.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-[#18181b] rounded-3xl border border-dashed border-slate-300 dark:border-[#27272a]">
            <p className="text-slate-500">Nenhum serviço disponível no momento.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeServices.slice(0, 6).map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isPopular={index === 0}
                  onBooking={onBooking}
                />
              ))}
            </div>

            {activeServices.length > 6 && (
              <div className="text-center mt-16">
                <button
                  onClick={onBooking}
                  className="px-8 py-4 bg-slate-900 dark:bg-slate-50 text-white dark:text-black font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-white hover:scale-105 transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                >
                  Ver todos os {activeServices.length} serviços
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
