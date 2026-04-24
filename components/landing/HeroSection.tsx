"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightOutlined,
  LineChartOutlined,
  TeamOutlined,
  ControlOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";

export const HeroSection = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const handlePrimaryCta = () => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/organization/select");
      return;
    }
    const hasAnyOrg =
      (user?.organizations?.length ?? 0) > 0 ||
      (user?.organizationMembers?.length ?? 0) > 0;
    router.push(hasAnyOrg ? "/organization/select" : "/billing/checkout");
  };

  const handleSecondaryCta = () => {
    const el = document.getElementById("features");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center px-6 pt-32 pb-24 bg-base-100">
      <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-base-200 border border-base-content/10">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-base-content/70 text-sm font-semibold tracking-wide">
              Mais de 500 estéticas automotivas já usam NexoCar
            </span>
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-base-content mb-8 leading-[1.05]">
          Controle Total do <br />
          <span className="text-blue-600 dark:text-blue-500">
            Seu Lava-Rápido
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-base-content/70 max-w-2xl mx-auto leading-[1.8] mb-12">
          Veja em tempo real o que acontece na sua operação, controle sua equipe
          e entenda seu lucro com clareza.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button
            onClick={handlePrimaryCta}
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-900/20 active:translate-y-0.5 transition-colors w-full sm:w-auto"
          >
            Assumir o comando
            <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={handleSecondaryCta}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-base-200 hover:bg-base-300 border border-base-content/10 text-base-content font-semibold text-base transition-colors w-full sm:w-auto"
          >
            Ver funcionalidades
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <PillarCard
            icon={<TeamOutlined />}
            label="Equipe organizada"
            hint="Cadastre a equipe, defina funções e controle o acesso."
          />
          <PillarCard
            icon={<ControlOutlined />}
            label="Operação centralizada"
            hint="Agenda, comanda e filiais em um único painel."
          />
          <PillarCard
            icon={<LineChartOutlined />}
            label="Receita com clareza"
            hint="Acompanhe o quanto entrou em cada dia e filial."
          />
        </div>
      </div>
    </section>
  );
};

const PillarCard = ({
  icon,
  label,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
}) => (
  <div className="p-6 rounded-xl bg-base-200 border border-base-content/10 text-left">
    <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-500 text-lg mb-4">
      {icon}
    </div>
    <div className="text-base font-bold text-base-content mb-1.5">{label}</div>
    <div className="text-sm text-base-content/60 font-medium leading-[1.7]">
      {hint}
    </div>
  </div>
);
