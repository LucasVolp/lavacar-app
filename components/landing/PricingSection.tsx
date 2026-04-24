"use client";

import React, { useState } from "react";
import { CheckOutlined, ThunderboltFilled } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { PLAN_CONFIG } from "@/types/billing";

type BillingCycle = "MONTHLY" | "ANNUALLY";

export const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("MONTHLY");
  const router = useRouter();

  const isAnnually = billingCycle === "ANNUALLY";
  const plan = PLAN_CONFIG[billingCycle];

  const features = [
    "Comanda digital integrada",
    "Dashboard de receita em tempo real",
    "Gestão de equipe com permissões por função",
    "Operação em tempo real",
    "Múltiplas filiais no mesmo painel",
    "Histórico de atendimentos por filial",
    "Suporte prioritário",
  ];

  return (
    <section id="pricing" className="py-28 px-6 bg-base-200 border-t border-base-content/5 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/10 border border-blue-600/20 mb-6">
            <span className="text-blue-600 dark:text-blue-500 text-xs font-semibold tracking-wide uppercase">Investimento</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-base-content mb-6 leading-[1.1]">
            Perder controle da operação <br />
            <span className="text-blue-600 dark:text-blue-500">
              custa dinheiro todos os dias.
            </span>
          </h2>
          <p className="text-base-content/70 text-lg max-w-2xl mx-auto mb-12 leading-[1.8]">
            Um plano único, sem taxas escondidas e sem fidelidade. Você controla quando começa e quando para.
          </p>

          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-semibold transition-colors ${!isAnnually ? 'text-base-content' : 'text-base-content/50'}`}>
              Mensal
            </span>

            <button
              onClick={() => setBillingCycle(isAnnually ? "MONTHLY" : "ANNUALLY")}
              className="relative w-16 h-8 bg-base-300 rounded-full p-1 transition-colors hover:bg-base-300/80 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            >
              <div
                className={`w-6 h-6 bg-blue-600 rounded-full shadow-lg transform transition-transform duration-300 ${
                  isAnnually ? "translate-x-8" : "translate-x-0"
                }`}
              />
            </button>

            <span className={`text-sm font-semibold transition-colors flex items-center gap-2 ${isAnnually ? 'text-base-content' : 'text-base-content/50'}`}>
              Anual
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-600/10 text-emerald-600 dark:text-emerald-500 border border-emerald-600/20">
                {PLAN_CONFIG.ANNUALLY.savings}
              </span>
            </span>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <div className="relative rounded-3xl p-10 bg-base-100 border-2 border-blue-600 shadow-xl shadow-blue-900/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-600 rounded-full text-white text-xs font-bold tracking-wider uppercase shadow-lg flex items-center gap-1.5">
              <ThunderboltFilled /> Plano NexoCar
            </div>

            <div className="mb-8 mt-2">
              <h3 className="text-2xl font-extrabold text-base-content mb-2">NexoCar</h3>
              <p className="text-base-content/60 text-sm leading-[1.7]">
                Para lava-rápidos e estéticas que querem controle, tecnologia e operação previsível.
              </p>
            </div>

            <div className="mb-8 pb-8 border-b border-base-content/10">
              <div className="flex items-baseline gap-2">
                <span className="text-base-content/60 text-lg font-semibold">R$</span>
                <span className="text-5xl font-extrabold text-base-content tracking-tight transition-all duration-300">
                  {plan.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-base-content/60 text-lg font-medium">/mês</span>
              </div>

              {isAnnually && (
                <div className="mt-3 text-sm flex items-center flex-wrap gap-2">
                  <span className="text-base-content/40 line-through">
                    de R$ {PLAN_CONFIG.MONTHLY.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-blue-600 dark:text-blue-500 font-semibold">
                    · Cobrado anualmente R$ {(PLAN_CONFIG.ANNUALLY.price * 12).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              )}
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-base-content/85">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-600 text-white">
                    <CheckOutlined className="text-[10px]" />
                  </div>
                  <span className="text-[15px] font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => router.push("/billing/checkout")}
              className="w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 active:translate-y-0.5"
            >
              {isAnnually ? 'Assinar Anual' : 'Começar Agora'}
            </button>

            <p className="text-center text-sm text-base-content/70 mt-6 font-medium leading-[1.7]">
              Com organização e dados claros, o sistema se paga rapidamente.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
