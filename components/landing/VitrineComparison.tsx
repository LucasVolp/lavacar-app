"use client";

import { useRef, useState } from "react";
import {
  CloseCircleFilled,
  CheckCircleFilled,
  ClockCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  FireFilled,
  PictureOutlined,
  SafetyCertificateFilled,
  CheckCircleFilled as CheckFilled,
  CalendarOutlined,
  EnvironmentOutlined,
  StarFilled,
} from "@ant-design/icons";

export const VitrineComparison = () => {
  return (
    <section className="py-28 px-6 bg-base-100 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/10 border border-blue-600/20 mb-6">
            <span className="text-blue-600 dark:text-blue-500 text-xs font-semibold tracking-wide uppercase">
              O Diferencial
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-base-content mb-6 leading-[1.1]">
            Pare de se envergonhar{" "}
            <span className="text-blue-600 dark:text-blue-500">do seu link.</span>
          </h2>
          <p className="text-base-content/70 text-lg max-w-2xl mx-auto leading-[1.8]">
            Estéticas automotivas de alto padrão exigem uma vitrine à altura do seu serviço. Com o NexoCar, você tem um link limpo e personalizado que dá orgulho de colocar na bio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <CompetitorSide />
          <NexoCarSide />
        </div>
      </div>
    </section>
  );
};

/* ─── Left: Competitor (ugly link) ──────────────────────────────── */

const CompetitorSide = () => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-2">
      <CloseCircleFilled className="text-red-500 text-lg" />
      <span className="font-bold text-base-content/80">Como está hoje</span>
    </div>

    <div className="rounded-2xl border border-red-200 dark:border-red-900/40 bg-white dark:bg-zinc-950 overflow-hidden shadow-lg shadow-red-900/5">
      {/* Phone chrome */}
      <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-1 text-[11px] text-zinc-400 font-mono truncate">
          minhaautoagenda.com/painel/agendar?id=9238472&amp;estab=estetica&amp;token=xyz
        </div>
      </div>

      {/* Instagram DM mockup */}
      <div className="bg-white dark:bg-zinc-950 p-5">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            AE
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">AutoEstética Pro</div>
            <div className="text-[11px] text-zinc-400">Ativo há 2 horas</div>
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              CL
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[75%]">
              <p className="text-[13px] text-zinc-800 dark:text-zinc-200">
                Oi! Como faço pra agendar um polimento? 😊
              </p>
            </div>
          </div>

          <div className="flex items-end gap-2 flex-row-reverse">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              AE
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[80%]">
              <p className="text-[13px] text-white mb-1">Olá! Acesse o link abaixo:</p>
              <p className="text-[11px] text-white/80 font-mono break-all leading-[1.5]">
                minhaautoagenda.com/painel/agendar?id=9238472&estab=estetica&token=xyz8f2
              </p>
            </div>
          </div>

          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              CL
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[75%]">
              <p className="text-[13px] text-zinc-800 dark:text-zinc-200">
                Tá bem...{" "}
                <span className="text-zinc-400 dark:text-zinc-500">(não clicou)</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-2 px-1">
      <CloseCircleFilled className="text-red-500 text-sm flex-shrink-0" />
      <span className="text-sm text-red-600 dark:text-red-400 font-semibold">
        Link confuso. Cliente desiste. Você perde o serviço.
      </span>
    </div>
  </div>
);

/* ─── Right: NexoCar (real vitrine UI) ──────────────────────────── */

const VITRINE_SERVICES = [
  { name: "Lavagem Premium", duration: "45 min", price: "R$ 89,00", popular: true },
  { name: "Polimento 3M Completo", duration: "3h", price: "R$ 390,00", popular: false },
  { name: "Vitrificação Cerâmica", duration: "1 dia", price: "R$ 1.200,00", popular: false },
];

const NexoCarSide = () => {
  const [activeCard, setActiveCard] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = (index: number) => {
    setActiveCard(index);
    if (trackRef.current) {
      const cardWidth = trackRef.current.offsetWidth;
      trackRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CheckCircleFilled className="text-emerald-500 text-lg" />
        <span className="font-bold text-base-content/80">Com o NexoCar</span>
      </div>

      {/* Browser frame */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-white dark:bg-zinc-950 overflow-hidden shadow-lg shadow-emerald-900/10">
        {/* Browser chrome */}
        <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-2 bg-white dark:bg-zinc-800 border border-emerald-300/60 dark:border-emerald-700/50 rounded-md px-3 py-1 flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-600 dark:text-zinc-300 font-mono font-semibold truncate">
              nexocar.com.br/shop/<span className="text-emerald-600 dark:text-emerald-400">sua-estetica-aqui</span>
            </span>
          </div>
        </div>

        {/* Real vitrine UI */}
        <div className="bg-slate-50 dark:bg-[#09090b] overflow-hidden">
          {/* Hero section replica */}
          <div className="relative px-5 pt-5 pb-4 border-b border-slate-200 dark:border-[#27272a]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border bg-emerald-50/80 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span className="text-[10px] font-bold tracking-wide uppercase">Aberto Agora</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  <SafetyCertificateFilled className="text-indigo-500 text-[10px]" />
                  <span className="text-[10px] font-semibold">Loja Verificada</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mb-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                  Estética Premium
                </h3>
                <CheckFilled className="text-blue-500 text-sm" />
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <EnvironmentOutlined className="text-indigo-500 text-[11px]" />
                  <span className="text-[11px]">Av. Paulista, 1000 — São Paulo</span>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded-lg border border-amber-200 dark:border-amber-500/20">
                  <StarFilled className="text-amber-400 text-[10px]" />
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">4.9</span>
                  <span className="text-[10px] text-slate-400">(247)</span>
                </div>
              </div>

              <button className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm flex items-center justify-center gap-2">
                <CalendarOutlined />
                Agendar Agora
              </button>
            </div>
          </div>

          {/* Services carousel */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
                Serviços Premium
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => goTo(Math.max(0, activeCard - 1))}
                  disabled={activeCard === 0}
                  className="w-6 h-6 rounded-full bg-slate-100 dark:bg-[#27272a] border border-slate-200 dark:border-[#3f3f46] flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#3f3f46] disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <ArrowLeftOutlined className="text-[9px]" />
                </button>
                <button
                  onClick={() => goTo(Math.min(VITRINE_SERVICES.length - 1, activeCard + 1))}
                  disabled={activeCard === VITRINE_SERVICES.length - 1}
                  className="w-6 h-6 rounded-full bg-slate-100 dark:bg-[#27272a] border border-slate-200 dark:border-[#3f3f46] flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#3f3f46] disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <ArrowRightOutlined className="text-[9px]" />
                </button>
              </div>
            </div>

            {/* Track */}
            <div
              ref={trackRef}
              className="flex overflow-hidden gap-3"
            >
              {VITRINE_SERVICES.map((svc) => (
                <div
                  key={svc.name}
                  className={`relative overflow-hidden rounded-2xl border flex-shrink-0 w-full transition-all duration-300 ${
                    svc.popular
                      ? "bg-white dark:bg-[#18181b] border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                      : "bg-white dark:bg-[#18181b] border-slate-200 dark:border-[#27272a]"
                  }`}
                >
                  <div className="w-full h-10 bg-slate-50 dark:bg-[#27272a] flex items-center justify-center">
                    <PictureOutlined className="text-slate-300 dark:text-slate-600" />
                  </div>

                  {svc.popular && (
                    <div className="absolute top-0 right-0 z-10">
                      <div className="bg-indigo-500 text-white text-[9px] uppercase font-bold px-2.5 py-0.5 rounded-bl-xl flex items-center gap-1">
                        <FireFilled /> Popular
                      </div>
                    </div>
                  )}

                  <div className="px-4 py-3">
                    <h4 className={`font-bold text-[13px] mb-1 ${svc.popular ? "text-indigo-600 dark:text-indigo-400" : "text-slate-900 dark:text-slate-50"}`}>
                      {svc.name}
                    </h4>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-500 text-[10px] font-medium uppercase tracking-wide mb-3">
                      <ClockCircleOutlined />
                      <span>{svc.duration}</span>
                    </div>

                    <div className="flex items-end justify-between pt-2.5 border-t border-slate-100 dark:border-[#27272a]">
                      <div>
                        <span className="text-slate-500 dark:text-slate-500 text-[10px] block mb-0.5">Investimento</span>
                        <span className="text-base font-bold text-slate-900 dark:text-slate-50">{svc.price}</span>
                      </div>
                      <button className={`w-8 h-8 rounded-full flex items-center justify-center ${svc.popular ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-[#27272a] text-slate-500 dark:text-slate-400"}`}>
                        <ArrowRightOutlined className="-rotate-45 text-[11px]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {VITRINE_SERVICES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeCard
                      ? "w-4 h-1.5 bg-indigo-500"
                      : "w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        <CheckCircleFilled className="text-emerald-500 text-sm flex-shrink-0" />
        <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
          Sua marca. Seu link. O cliente agendou em 30 segundos.
        </span>
      </div>
    </div>
  );
};
