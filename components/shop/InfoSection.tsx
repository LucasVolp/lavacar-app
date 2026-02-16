"use client";

import {
  EnvironmentFilled,
  PhoneFilled,
  MailFilled,
  ClockCircleFilled,
  CompassFilled,
} from "@ant-design/icons";
import { Shop } from "@/types/shop";
import { maskPhone } from "@/lib/masks";

interface Schedule {
  id: string;
  weekday: string;
  startTime: string;
  endTime: string;
  isOpen: string;
}

interface InfoSectionProps {
  shop: Shop;
  schedules: Schedule[];
  isLoading?: boolean;
}

const weekdayLabels: Record<string, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const weekdayOrder = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export function InfoSection({ shop, schedules, isLoading }: InfoSectionProps) {
  const fullAddress = [
    shop.street,
    shop.number,
    shop.neighborhood,
    shop.city,
    shop.state,
    shop.zipCode,
    "Brasil",
  ]
    .filter(Boolean)
    .join(", ");

  const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;
  const mapsExternalUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  const sortedSchedules = [...schedules].sort(
    (a, b) => weekdayOrder.indexOf(a.weekday) - weekdayOrder.indexOf(b.weekday)
  );

  // Check current day
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  return (
    <section className="py-24 bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-500/20">
            <EnvironmentFilled />
            <span>Localização & Contato</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3 tracking-tight transition-colors duration-300">
            Visite nossa unidade.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto transition-colors duration-300">
             Instalações modernas preparadas para receber seu veículo.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white dark:bg-[#18181b] rounded-3xl p-8 border border-slate-200 dark:border-[#27272a] shadow-xl dark:shadow-2xl overflow-hidden relative group transition-colors duration-300">
             {/* Glow Effect */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-500" />

            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-500 text-xl border border-emerald-500/20">
                 <CompassFilled />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 transition-colors duration-300">Contato & Endereço</h3>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#27272a] flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0 transition-colors duration-300">
                  <EnvironmentFilled />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 uppercase tracking-wide transition-colors duration-300">
                    Endereço
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm transition-colors duration-300">
                    {shop.street}, {shop.number}
                    {shop.complement && ` - ${shop.complement}`}
                    <br />
                    {shop.neighborhood} - {shop.city}/{shop.state}
                    <br />
                    CEP: {shop.zipCode}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#27272a] flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0 transition-colors duration-300">
                  <PhoneFilled />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 uppercase tracking-wide transition-colors duration-300">
                    Telefone
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">
                    {maskPhone(shop.phone)}
                  </p>
                </div>
              </div>

              {/* Email */}
              {shop.email && (
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#27272a] flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0 transition-colors duration-300">
                    <MailFilled />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 uppercase tracking-wide transition-colors duration-300">
                      Email
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">
                      {shop.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Maps */}
              <div className="pt-2">
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-[#27272a] shadow-sm bg-white dark:bg-[#101012]">
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-[#27272a] flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                      Como Chegar
                    </h4>
                    <a
                      href={mapsExternalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Abrir no Google Maps
                    </a>
                  </div>
                  <iframe
                    title={`Mapa da loja ${shop.name}`}
                    src={mapsEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-56 border-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
           <div className="bg-white dark:bg-[#18181b] rounded-3xl p-8 border border-slate-200 dark:border-[#27272a] shadow-xl dark:shadow-2xl relative transition-colors duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-500 text-xl border border-indigo-500/20">
                 <ClockCircleFilled />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 transition-colors duration-300">Horários de Funcionamento</h3>
            </div>

            {isLoading ? (
               <div className="space-y-4">
                  {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-[#27272a] rounded-lg animate-pulse" />)}
               </div>
            ) : schedules.length === 0 ? (
               <p className="text-slate-500 italic">Horários não disponíveis no momento.</p>
            ) : (
              <div className="space-y-2">
                {sortedSchedules.map((schedule) => {
                  const isToday = today === schedule.weekday;
                  const isOpen = schedule.isOpen === "ACTIVE";

                  return (
                    <div
                      key={schedule.id}
                      className={`flex justify-between items-center p-4 rounded-xl transition-all border ${
                        isToday
                          ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30"
                          : "bg-transparent hover:bg-slate-50 dark:bg-[#27272a]/30 dark:hover:bg-[#27272a] border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isToday && (
                          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        )}
                        <span
                          className={`text-sm font-medium ${isToday ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"}`}
                        >
                          {weekdayLabels[schedule.weekday]}
                        </span>
                        {isToday && (
                           <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">
                             Hoje
                           </span>
                        )}
                      </div>
                      
                      {isOpen ? (
                        <span className={`text-sm font-mono ${isToday ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}>
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-red-500/80 dark:text-red-500/50 uppercase tracking-wide bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded border border-red-100 dark:border-transparent">
                          Fechado
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
