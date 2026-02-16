"use client";

import {
  CalendarOutlined,
  EnvironmentOutlined,
  StarFilled,
  PhoneOutlined,
  CheckCircleFilled,
  CarFilled,
  SafetyCertificateFilled,
  InstagramOutlined,
  YoutubeOutlined,
  WhatsAppOutlined,
  TikTokFilled,
} from "@ant-design/icons";
import { Shop } from "@/types/shop";

interface HeroSectionProps {
  shop: Shop;
  averageRating: number;
  totalReviews: number;
  totalServices: number;
  onBooking: () => void;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  tiktokUrl?: string | null;
  whatsappUrl?: string | null;
}

export function HeroSection({
  shop,
  averageRating,
  totalReviews,
  totalServices,
  onBooking,
  instagramUrl,
  youtubeUrl,
  tiktokUrl,
  whatsappUrl,
}: HeroSectionProps) {
  
  const isOpen = shop.status === "ACTIVE";

  return (
    <section className="relative w-full bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-50 pt-16 pb-24 px-4 sm:px-6 overflow-hidden border-b border-slate-200 dark:border-[#27272a] transition-colors duration-300">
      {/* Background Decor - Subtle Gradients & Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Main Content Area (Left - Spans 7 cols) */}
        <div className="lg:col-span-7 flex flex-col pt-4">
          
          {/* Badges Row */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
             <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border shadow-sm backdrop-blur-sm transition-colors duration-300 ${isOpen ? 'bg-emerald-50/80 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' : 'bg-red-50/80 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400'}`}>
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpen ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpen ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                </span>
                <span className="text-xs font-bold tracking-wide uppercase">
                  {isOpen ? "Aberto Agora" : "Fechado"}
                </span>
             </div>

             <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 backdrop-blur-sm">
                <SafetyCertificateFilled className="text-indigo-500" />
                <span className="text-xs font-semibold">Loja Verificada</span>
             </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-[1.1] transition-colors duration-300">
            {shop.name}
            <span className="inline-block align-top ml-2 text-3xl sm:text-4xl text-blue-500">
               <CheckCircleFilled />
            </span>
          </h1>

          {/* Location Full */}
          <div className="flex flex-col gap-2 mb-8 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
               <EnvironmentOutlined className="text-indigo-500 text-lg flex-shrink-0" />
               <span className="text-lg font-medium">
                 {[shop.street, shop.number, shop.neighborhood].filter(Boolean).join(", ")}
               </span>
            </div>
            <div className="pl-7 text-base opacity-80">
               {[shop.city, shop.state, shop.zipCode].filter(Boolean).join(" - ")}
            </div>
          </div>

          {/* Description */}
          {shop.description && (
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-10 font-normal transition-colors duration-300 p-4 bg-white/50 dark:bg-white/5 border-l-4 border-indigo-500 rounded-r-xl">
              {shop.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
             <button
               onClick={onBooking}
               className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-slate-900 dark:bg-white dark:text-black rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-50 hover:shadow-xl hover:shadow-indigo-500/20 active:scale-95"
             >
                <CalendarOutlined className="mr-2 text-lg" />
                Agendar Agora
             </button>
             
             {shop.phone && (
              <a
                href={`tel:${shop.phone}`}
                className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-300 transition-all duration-300 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                  <PhoneOutlined className="mr-2 group-hover:text-indigo-500 transition-colors" />
                  Contato
              </a>
             )}
          </div>

          {(instagramUrl || youtubeUrl || tiktokUrl || whatsappUrl) && (
            <div className="mt-8 flex items-center gap-3 flex-wrap">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/social no-underline inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 !text-white shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-110 active:scale-95 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <InstagramOutlined className="text-xl !text-inherit group-hover/social:rotate-12 transition-transform duration-300" />
                </a>
              )}
              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/social no-underline inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-500 !text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-110 active:scale-95 transition-all duration-300"
                  aria-label="YouTube"
                >
                  <YoutubeOutlined className="text-xl !text-inherit group-hover/social:rotate-12 transition-transform duration-300" />
                </a>
              )}
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/social no-underline inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 !text-white dark:!text-black shadow-lg shadow-slate-900/25 dark:shadow-white/20 hover:shadow-xl hover:shadow-slate-900/40 dark:hover:shadow-white/30 hover:scale-110 active:scale-95 transition-all duration-300"
                  aria-label="TikTok"
                >
                  <TikTokFilled className="text-xl !text-inherit group-hover/social:rotate-12 transition-transform duration-300" />
                </a>
              )}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/social no-underline inline-flex items-center justify-center w-12 h-12 rounded-2xl !bg-[#25D366] dark:!bg-[#25D366] !text-white shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/50 hover:scale-110 active:scale-95 transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <WhatsAppOutlined className="text-xl !text-white group-hover/social:rotate-12 transition-transform duration-300" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right Side - Stats Card (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-5 relative justify-end">
            <div className="relative w-full max-w-sm bg-white dark:bg-[#18181b] rounded-3xl p-8 border border-slate-100 dark:border-[#27272a] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
               {/* Card Decor */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
               
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                     <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Avaliação Geral</p>
                        <div className="flex items-baseline gap-2">
                           <span className="text-5xl font-black text-slate-900 dark:text-white">{averageRating.toFixed(1)}</span>
                           <span className="text-slate-400 font-medium">/ 5.0</span>
                        </div>
                     </div>
                     <div className="w-16 h-16 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center">
                        <StarFilled className="text-3xl text-amber-400" />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                           <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                              <CarFilled />
                           </div>
                           <span className="font-semibold text-slate-700 dark:text-slate-300">Serviços Ativos</span>
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">{totalServices}</span>
                     </div>

                     <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                           <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                              <CheckCircleFilled />
                           </div>
                           <span className="font-semibold text-slate-700 dark:text-slate-300">Avaliações</span>
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">{totalReviews}+</span>
                     </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                     <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                        &quot;Especialistas em embelezamento automotivo e lavagem detalhada.&quot;
                     </p>
                  </div>
               </div>
            </div>
        </div>

      </div>
    </section>
  );
}
