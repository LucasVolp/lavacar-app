"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightOutlined,
  LineChartOutlined,
  TeamOutlined,
  ControlOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";

const ROTATING_PHRASES = [
  "vitrine digital",
  "ferramenta de gestão",
  "página de agendamentos",
];

const TYPING_SPEED = 55;
const ERASING_SPEED = 30;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_ERASE = 300;

function useTypingAnimation() {
  const [displayed, setDisplayed] = useState(ROTATING_PHRASES[0]);
  const [isErasing, setIsErasing] = useState(false);
  const phraseIndex = useRef(0);
  const charIndex = useRef(ROTATING_PHRASES[0].length);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const tick = () => {
      const current = ROTATING_PHRASES[phraseIndex.current];

      if (!isErasing) {
        if (charIndex.current < current.length) {
          charIndex.current += 1;
          setDisplayed(current.slice(0, charIndex.current));
          timeout.current = setTimeout(tick, TYPING_SPEED);
        } else {
          timeout.current = setTimeout(() => setIsErasing(true), PAUSE_AFTER_TYPE);
        }
      } else {
        if (charIndex.current > 0) {
          charIndex.current -= 1;
          setDisplayed(current.slice(0, charIndex.current));
          timeout.current = setTimeout(tick, ERASING_SPEED);
        } else {
          phraseIndex.current = (phraseIndex.current + 1) % ROTATING_PHRASES.length;
          setIsErasing(false);
          timeout.current = setTimeout(tick, PAUSE_AFTER_ERASE);
        }
      }
    };

    timeout.current = setTimeout(tick, PAUSE_AFTER_TYPE);
    return () => { if (timeout.current) clearTimeout(timeout.current); };
  }, [isErasing]);

  return displayed;
}

export const HeroSection = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const rotatingPhrase = useTypingAnimation();

  const handlePrimaryCta = () => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/billing");
      return;
    }
    const hasAnyOrg =
      (user?.organizations?.length ?? 0) > 0 ||
      (user?.organizationMembers?.length ?? 0) > 0;
    router.push(hasAnyOrg ? "/organization/select" : "/billing");
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
          A primeira{" "}
          {rotatingPhrase}
          <span className="animate-pulse text-base-content/40">|</span>{" "}
          <span className="text-blue-600 dark:text-blue-500">
            que você vai ter orgulho de colocar na bio.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-base-content/70 max-w-2xl mx-auto leading-[1.8] mb-12">
          Automatize seus agendamentos com uma gestão de elite e dê aos seus
          clientes uma experiência premium com a sua marca:{" "}
          <span className="font-semibold text-base-content/90 font-mono text-base">
            nexocar.com.br/shop/sua-estetica
          </span>
          . Teste 15 dias grátis, sem cartão.
        </p>

        <div className="flex flex-col items-center gap-2 mb-20">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handlePrimaryCta}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-900/20 active:translate-y-0.5 transition-colors w-full sm:w-auto"
            >
              Começar 15 dias grátis
              <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleSecondaryCta}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-base-200 hover:bg-base-300 border border-base-content/10 text-base-content font-semibold text-base transition-colors w-full sm:w-auto"
            >
              Ver funcionalidades
            </button>
          </div>
          <p className="text-sm text-zinc-500 mt-2">Sem necessidade de cartão de crédito.</p>
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
