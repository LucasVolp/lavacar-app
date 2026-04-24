"use client";

import React, { useState, useEffect } from "react";
import {
  ApiOutlined,
  LineChartOutlined,
  CalendarOutlined,
  RiseOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  ShopOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { formatVehiclePlate } from "@/utils/vehiclePlate";

export const OwnerBenefits = () => {
  return (
    <section id="benefits" className="py-28 px-6 bg-base-200 border-y border-base-content/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 md:gap-20 items-start">

          <div className="w-full md:w-[45%] md:sticky md:top-28">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/10 border border-blue-600/20 mb-6">
              <span className="text-blue-600 dark:text-blue-500 text-xs font-semibold tracking-wide uppercase">Gestão do Negócio</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-base-content mb-6 leading-[1.1]">
              Gestão Inteligente. <br />
              <span className="text-blue-600 dark:text-blue-500">
                Sem Perder o Controle.
              </span>
            </h2>

            <p className="text-base-content/70 text-lg mb-12 leading-[1.8]">
              Comande equipe, operação e financeiro em um só lugar. Sem planilhas. Sem retrabalho. Sem achismo.
            </p>

            <div className="space-y-8">
              <BenefitItem
                icon={<TeamOutlined />}
                title="Comando Total da Equipe"
                description="Cadastre atendentes, lavadores e gerentes com permissões diferentes. Cada pessoa no lugar certo, sob o seu comando."
              />
              <BenefitItem
                icon={<ApiOutlined />}
                title="Tecnologia Conectada"
                description="Comanda digital e painel sincronizados em tempo real. Do início do serviço ao registro da receita, tudo em um fluxo único."
              />
              <BenefitItem
                icon={<LineChartOutlined />}
                title="Dados que Decidem"
                description="Receita em tempo real, ticket médio e volume de atendimentos por filial. Você decide com números, não com suposição."
              />
            </div>
          </div>

          <div className="w-full md:w-[55%] relative">
            <MetricsCarousel />
          </div>

        </div>
      </div>
    </section>
  );
};

const BenefitItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex gap-5">
    <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex-shrink-0 flex items-center justify-center text-blue-600 dark:text-blue-500 text-xl border border-blue-600/20">
      {icon}
    </div>
    <div className="pt-1">
      <h3 className="text-base-content font-bold text-lg mb-2">{title}</h3>
      <p className="text-base-content/60 text-[15px] leading-[1.7]">{description}</p>
    </div>
  </div>
);

/* ─── Team Slide ─────────────────────────────────────────────────── */

const ROLE_STYLES: Record<string, string> = {
  MANAGER: "bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20",
  EMPLOYEE: "bg-zinc-200/80 text-zinc-600 dark:bg-zinc-700/50 dark:text-zinc-300 border border-zinc-300/50 dark:border-zinc-600/50",
  OWNER: "bg-amber-600/10 text-amber-600 dark:text-amber-400 border border-amber-600/20",
};

const ROLE_LABELS: Record<string, string> = {
  MANAGER: "Gerente",
  EMPLOYEE: "Funcionário",
  OWNER: "Proprietário",
};

interface MockMember {
  name: string;
  role: "MANAGER" | "EMPLOYEE" | "OWNER";
  shop: string;
  initials: string;
}

const ORG_MEMBERS: MockMember[] = [
  { name: "Carlos Silva", role: "MANAGER", shop: "Matriz", initials: "CS" },
  { name: "Rafael Souza", role: "EMPLOYEE", shop: "Matriz", initials: "RS" },
  { name: "João Pereira", role: "EMPLOYEE", shop: "Filial Sul", initials: "JP" },
  { name: "Pedro Lima", role: "EMPLOYEE", shop: "Matriz", initials: "PL" },
];

const SHOP_MANAGERS: { name: string; shop: string; initials: string }[] = [
  { name: "Carlos Silva", shop: "Matriz", initials: "CS" },
  { name: "Ana Costa", shop: "Filial Norte", initials: "AC" },
];

export const TeamSlide: React.FC = () => (
  <div className="h-full flex flex-col animate-fade-in">
    <div className="flex items-center justify-between mb-5">
      <div>
        <div className="text-base-content/50 text-xs mb-1 font-semibold tracking-wider uppercase">Equipe Cadastrada</div>
        <div className="text-2xl font-extrabold text-base-content">6 membros ativos</div>
      </div>
      <div className="w-11 h-11 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-500 border border-blue-600/20">
        <TeamOutlined className="text-lg" />
      </div>
    </div>

    <div className="grid grid-cols-3 gap-2 mb-4">
      <div className="p-3 bg-base-200 rounded-xl border border-base-content/5 text-center">
        <div className="text-base-content/50 text-[10px] mb-1 font-semibold uppercase">Gerentes</div>
        <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">2</div>
      </div>
      <div className="p-3 bg-base-200 rounded-xl border border-base-content/5 text-center">
        <div className="text-base-content/50 text-[10px] mb-1 font-semibold uppercase">Funcionários</div>
        <div className="text-lg font-extrabold text-base-content">4</div>
      </div>
      <div className="p-3 bg-base-200 rounded-xl border border-base-content/5 text-center">
        <div className="text-base-content/50 text-[10px] mb-1 font-semibold uppercase">Shops</div>
        <div className="text-lg font-extrabold text-base-content">3</div>
      </div>
    </div>

    {/* Org Members */}
    <div className="mb-3">
      <div className="flex items-center gap-1.5 mb-2">
        <TeamOutlined className="text-blue-600 dark:text-blue-400 text-xs" />
        <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider">Membros da Organização</span>
      </div>
      <div className="space-y-1.5">
        {ORG_MEMBERS.map((m) => (
          <div key={m.name} className="flex items-center gap-2.5 px-3 py-2 bg-base-200 rounded-xl border border-base-content/5">
            <div className="w-7 h-7 rounded-full bg-indigo-600/20 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              {m.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-base-content truncate">{m.name}</div>
              <div className="text-[10px] text-base-content/50 flex items-center gap-1">
                <ShopOutlined className="text-[9px]" />
                {m.shop}
              </div>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${ROLE_STYLES[m.role]}`}>
              {ROLE_LABELS[m.role]}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Shop Managers */}
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <ShopOutlined className="text-emerald-600 dark:text-emerald-400 text-xs" />
        <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider">Gerentes por Shop</span>
      </div>
      <div className="space-y-1.5">
        {SHOP_MANAGERS.map((m) => (
          <div key={m.name + m.shop} className="flex items-center gap-2.5 px-3 py-2 bg-base-200 rounded-xl border border-base-content/5">
            <div className="w-7 h-7 rounded-full bg-emerald-600/20 flex items-center justify-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              {m.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-base-content truncate">{m.name}</div>
              <div className="text-[10px] text-base-content/50">{m.shop}</div>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-600/20">
              Ativo
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-auto pt-4 border-t border-base-content/10">
      <span className="text-xs text-base-content/50 font-medium">Cada função com o acesso certo</span>
    </div>
  </div>
);

/* ─── Revenue Slide ──────────────────────────────────────────────── */

interface InsightMetricCardProps {
  icon: React.ReactNode;
  iconBg: string;
  borderColor: string;
  label: string;
  value: string;
  badge?: React.ReactNode;
  sub?: React.ReactNode;
}

const InsightMetricCard: React.FC<InsightMetricCardProps> = ({ icon, iconBg, borderColor, label, value, badge, sub }) => (
  <div className={`bg-base-100 border border-base-content/10 border-l-4 ${borderColor} rounded-xl p-4`}>
    <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center mb-3`}>
      {icon}
    </div>
    <p className="text-[10px] font-semibold text-base-content/50 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-xl font-extrabold text-base-content leading-tight">{value}</p>
    {badge && <div className="mt-1.5">{badge}</div>}
    {sub && <div className="mt-1">{sub}</div>}
  </div>
);

const GrowthBadge: React.FC<{ value: number }> = ({ value }) => (
  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
    value >= 0
      ? "bg-emerald-600/10 text-emerald-600 dark:text-emerald-400"
      : "bg-red-600/10 text-red-600 dark:text-red-400"
  }`}>
    {value >= 0 ? "↗" : "↘"} {Math.abs(value)}% vs mês ant.
  </span>
);

const TOP_SERVICES = [
  { name: "Lavagem Completa", count: 98, revenue: "R$ 18.420", pct: 100 },
  { name: "Enceramento", count: 61, revenue: "R$ 11.340", pct: 62 },
  { name: "Polimento", count: 44, revenue: "R$ 8.280", pct: 45 },
];

export const RevenueSlide: React.FC = () => (
  <div className="h-full flex flex-col animate-fade-in">
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="text-base-content/50 text-xs mb-1 font-semibold tracking-wider uppercase">Insights · Últimos 30 dias</div>
        <div className="text-2xl font-extrabold text-base-content">R$ 42.580</div>
      </div>
      <div className="px-2.5 py-1 bg-emerald-600/10 rounded-lg border border-emerald-600/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
        <RiseOutlined /> +22%
      </div>
    </div>

    {/* Metric cards — matches InsightsKeyMetrics */}
    <div className="grid grid-cols-2 gap-2 mb-4">
      <InsightMetricCard
        icon={<CalendarOutlined className="text-blue-600 dark:text-blue-400" />}
        iconBg="bg-blue-600/10"
        borderColor="border-l-blue-500"
        label="Agendamentos"
        value="218"
        badge={
          <div className="flex gap-1 flex-wrap">
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-600/10 text-amber-600 dark:text-amber-400 font-semibold">12 pendentes</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 font-semibold">206 concluídos</span>
          </div>
        }
      />
      <InsightMetricCard
        icon={<DollarOutlined className="text-emerald-600 dark:text-emerald-400" />}
        iconBg="bg-emerald-600/10"
        borderColor="border-l-emerald-500"
        label="Receita do Mês"
        value="R$ 42.580"
        badge={<GrowthBadge value={22} />}
        sub={<span className="text-[10px] text-base-content/50">Hoje: <strong className="text-base-content/70">R$ 1.840</strong></span>}
      />
      <InsightMetricCard
        icon={<ThunderboltOutlined className="text-purple-600 dark:text-purple-400" />}
        iconBg="bg-purple-600/10"
        borderColor="border-l-purple-500"
        label="Ticket Médio"
        value="R$ 195"
        badge={<GrowthBadge value={8.3} />}
      />
      <InsightMetricCard
        icon={<ClockCircleOutlined className="text-cyan-600 dark:text-cyan-400" />}
        iconBg="bg-cyan-600/10"
        borderColor="border-l-cyan-500"
        label="Duração Média"
        value="42 min"
        sub={<span className="text-[10px] text-base-content/50">Tempo médio de atendimento</span>}
      />
    </div>

    {/* Top services — matches InsightsTopServices */}
    <div className="flex-1">
      <div className="flex items-center gap-1.5 mb-2">
        <TrophyOutlined className="text-amber-500 text-xs" />
        <span className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider">Serviços Mais Populares</span>
      </div>
      <div className="space-y-2">
        {TOP_SERVICES.map((svc, idx) => (
          <div key={svc.name}>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="flex items-center gap-1 text-base-content/70 font-medium">
                {idx === 0 && <TrophyOutlined className="text-amber-500 text-[10px]" />}
                {idx === 1 && <TrophyOutlined className="text-zinc-400 text-[10px]" />}
                {idx === 2 && <TrophyOutlined className="text-amber-700 text-[10px]" />}
                {svc.name}
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{svc.revenue}</span>
            </div>
            <div className="h-1.5 bg-base-300 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${svc.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-4 pt-4 border-t border-base-content/10">
      <span className="text-xs text-base-content/50 font-medium">Receita por serviço, em tempo real</span>
    </div>
  </div>
);

/* ─── Operation Slide ────────────────────────────────────────────── */

export const OperationSlide: React.FC = () => (
  <div className="h-full flex flex-col animate-fade-in">
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="text-base-content/50 text-xs mb-2 font-semibold tracking-wider uppercase">Operação em Tempo Real</div>
        <div className="text-2xl font-extrabold text-base-content">Tempo médio: 42min</div>
      </div>
      <div className="w-11 h-11 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-500 border border-blue-600/20">
        <CalendarOutlined className="text-lg" />
      </div>
    </div>

    <div className="space-y-3 flex-1">
      {[
        { time: "09:00", plate: "ABC-1234", car: "Toyota Corolla", status: "Em lavagem", color: "blue", attendant: "Carlos" },
        { time: "10:30", plate: "XYZ-9876", car: "Honda Civic", status: "Concluído", color: "emerald", attendant: "Rafael" },
        { time: "11:00", plate: "DEF-5678", car: "Jeep Compass", status: "Em fila", color: "amber", attendant: "Pedro" },
      ].map((item, idx) => (
        <div key={idx} className="flex items-center gap-3 p-3.5 bg-base-200 rounded-xl border border-base-content/5">
          <div className="bg-base-300 px-2.5 py-1.5 rounded-md text-xs font-mono font-bold text-base-content/80">
            {item.time}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-base-content truncate">{item.car}</div>
            <div className="text-xs text-base-content/50 font-mono">{formatVehiclePlate(item.plate)} · {item.attendant}</div>
          </div>
          <div className={`text-[10px] px-2 py-1 rounded-md font-bold tracking-wide uppercase ${
            item.color === "blue" ? "bg-blue-600/10 text-blue-600 dark:text-blue-500 border border-blue-600/20" :
            item.color === "emerald" ? "bg-emerald-600/10 text-emerald-600 dark:text-emerald-500 border border-emerald-600/20" :
            "bg-amber-600/10 text-amber-600 dark:text-amber-500 border border-amber-600/20"
          }`}>
            {item.status}
          </div>
        </div>
      ))}
    </div>

    <div className="mt-6 pt-6 border-t border-base-content/10 flex items-center gap-2">
      <ClockCircleOutlined className="text-emerald-600 dark:text-emerald-500" />
      <span className="text-xs text-base-content/60 font-medium">Operação sincronizada do início ao caixa</span>
    </div>
  </div>
);

/* ─── Carousel ───────────────────────────────────────────────────── */

const MetricsCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    <TeamSlide key="team" />,
    <RevenueSlide key="revenue" />,
    <OperationSlide key="operation" />,
  ];

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length, isHovered]);

  return (
    <div
      className="relative z-10 bg-base-100 border border-base-content/10 rounded-2xl p-8 shadow-xl shadow-base-content/5 h-[560px] flex flex-col transition-colors duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-1 overflow-hidden relative">
        <div key={activeSlide} className="animate-fade-in-up h-full">
          {slides[activeSlide]}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6 pt-6 border-t border-base-content/5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeSlide === idx
                ? "w-8 bg-blue-600"
                : "w-2 bg-base-content/20 hover:bg-base-content/40"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
