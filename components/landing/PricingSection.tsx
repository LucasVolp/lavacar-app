"use client";

import React from "react";
import {
  CheckOutlined,
  ThunderboltFilled,
  ArrowRightOutlined,
  LockOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const FEATURES = [
  "Vitrine digital com URL personalizada",
  "Agendamento online 24h sem interrupções",
  "Dashboard de receita em tempo real",
  "Comanda digital integrada",
  "Gestão de equipe com permissões por função",
  "Múltiplas filiais no mesmo painel",
  "Suporte prioritário",
];

export const PricingSection = () => {
  const router = useRouter();

  return (
    <section id="pricing" className="py-28 px-6 bg-base-200 border-t border-base-content/5 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/10 border border-blue-600/20 mb-6">
            <span className="text-blue-600 dark:text-blue-500 text-xs font-semibold tracking-wide uppercase">
              Começar agora
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-base-content mb-6 leading-[1.1]">
            Comece grátis.{" "}
            <span className="text-blue-600 dark:text-blue-500">
              Veja o resultado em dias.
            </span>
          </h2>
          <p className="text-base-content/70 text-lg max-w-2xl mx-auto leading-[1.8]">
            15 dias para explorar tudo sem compromisso. Sem cartão de crédito. Cancele quando quiser.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="relative rounded-3xl p-10 bg-base-100 border-2 border-blue-600 shadow-xl shadow-blue-900/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-600 rounded-full text-white text-xs font-bold tracking-wider uppercase shadow-lg flex items-center gap-1.5">
              <ThunderboltFilled /> Plano NexoCar
            </div>

            <div className="mb-8 mt-2">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-2xl font-extrabold text-base-content">NexoCar</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20">
                  15 Dias Grátis
                </span>
              </div>
              <p className="text-base-content/60 text-sm leading-[1.7]">
                Um plano único, sem taxas escondidas e sem fidelidade. Você controla quando começa e quando para.
              </p>
            </div>

            {/* Trial value prop */}
            <div className="mb-8 pb-8 border-b border-base-content/10">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-600/5 border border-blue-600/15">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <CalendarOutlined className="text-blue-600 dark:text-blue-500 text-base" />
                </div>
                <div>
                  <p className="text-sm font-bold text-base-content">15 dias de teste completo</p>
                  <p className="text-xs text-base-content/60 leading-[1.6] mt-0.5">
                    Acesso a todas as funcionalidades. Nenhum recurso bloqueado durante o trial.
                  </p>
                </div>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-base-content/85">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-600 text-white">
                    <CheckOutlined className="text-[10px]" />
                  </div>
                  <span className="text-[15px] font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/billing")}
                className="w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 active:translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                Começar 15 dias grátis
                <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => router.push("/billing/checkout")}
                className="w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 bg-transparent hover:bg-base-200 border border-base-content/15 text-base-content/70 hover:text-base-content"
              >
                Ver planos e preços
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 mt-5 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <LockOutlined />
                Sem cartão de crédito
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-400" />
              <span>Cancele quando quiser</span>
              <span className="w-1 h-1 rounded-full bg-zinc-400" />
              <span>Sem fidelidade</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
