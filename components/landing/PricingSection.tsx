"use client";

import React, { useState } from "react";
import { CheckOutlined, ThunderboltFilled } from "@ant-design/icons";

type BillingCycle = "monthly" | "yearly";

export const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const isYearly = billingCycle === "yearly";

  return (
    <section id="pricing" className="py-24 px-6 bg-base-100 relative overflow-hidden transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-base-content mb-4">
            Planos transparentes para <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              todo tamanho de negócio
            </span>
          </h2>
          <p className="text-base-content/60 text-lg max-w-2xl mx-auto mb-10">
            Comece grátis e escale conforme seu faturamento cresce.
            Sem taxas escondidas.
          </p>

          {/* Billing Switch */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-base-content' : 'text-base-content/50'}`}>
              Mensal
            </span>
            
            <button
              onClick={() => setBillingCycle(isYearly ? "monthly" : "yearly")}
              className="relative w-16 h-8 bg-base-300 rounded-full p-1 transition-colors hover:bg-base-300/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <div
                className={`w-6 h-6 bg-primary rounded-full shadow-lg transform transition-transform duration-300 ${
                  isYearly ? "translate-x-8" : "translate-x-0"
                }`}
              />
            </button>

            <span className={`text-sm font-medium transition-colors flex items-center gap-2 ${isYearly ? 'text-base-content' : 'text-base-content/50'}`}>
              Anual
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-500/10 text-green-500 animate-pulse">
                -16%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Plan */}
          <PricingCard
            title="Básico"
            description="Para estéticas que estão começando."
            monthlyPrice={89.90}
            yearlyPrice={74.90}
            yearlyTotal={899.00}
            billingCycle={billingCycle}
            features={[
              "Agenda digital completa",
              "Até 2 profissionais",
              "Lembretes via E-mail",
              "Página de agendamento online",
              "Histórico de clientes"
            ]}
          />

          {/* Pro Plan */}
          <PricingCard
            title="Pro"
            description="Para quem quer automação total."
            monthlyPrice={149.90}
            yearlyPrice={124.90}
            yearlyTotal={1499.00}
            billingCycle={billingCycle}
            isPopular
            features={[
              "Tudo do Básico",
              "Profissionais ilimitados",
              "Lembretes via WhatsApp (Automático)",
              "Gestão Financeira e Comissões",
              "Campanhas de Marketing",
              "Suporte Prioritário"
            ]}
          />
        </div>
      </div>
    </section>
  );
};

interface PricingCardProps {
  title: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyTotal: number;
  billingCycle: BillingCycle;
  features: string[];
  isPopular?: boolean;
}

const PricingCard = ({
  title,
  description,
  monthlyPrice,
  yearlyPrice,
  yearlyTotal,
  billingCycle,
  features,
  isPopular = false,
}: PricingCardProps) => {
  const isYearly = billingCycle === "yearly";
  const currentPrice = isYearly ? yearlyPrice : monthlyPrice;

  return (
    <div className={`
      relative rounded-3xl p-8 backdrop-blur-sm transition-all duration-300 border
      ${isPopular 
        ? 'bg-base-200/50 border-primary shadow-2xl shadow-primary/10 scale-105 z-10' 
        : 'bg-base-100 border-base-content/10 hover:border-base-content/20'
      }
    `}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-secondary rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-lg">
          <ThunderboltFilled /> MAIS POPULAR
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-bold text-base-content mb-2">{title}</h3>
        <p className="text-base-content/60 text-sm">{description}</p>
      </div>

      <div className="mb-8 h-20"> {/* Fixed height to maintain alignment */}
        <div className="flex items-baseline gap-2">
          <span className="text-base-content/60 text-lg">R$</span>
          
          <div className="flex flex-col">
            <span className="text-5xl font-bold text-base-content tracking-tight transition-all duration-300">
              {currentPrice.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <span className="text-base-content/60 text-lg">/mês</span>
        </div>
        
        {/* Comparison & Total lines */}
        <div className={`mt-2 text-sm transition-opacity duration-300 ${isYearly ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col">
            <span className="text-base-content/40 line-through">
              de R$ {monthlyPrice.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-primary font-medium">
              Cobrado anualmente R$ {yearlyTotal.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-3 text-base-content/80">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
              isPopular ? 'bg-primary/20 text-primary' : 'bg-base-300 text-base-content/60'
            }`}>
              <CheckOutlined className="text-xs" />
            </div>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button className={`
        w-full py-4 rounded-xl font-bold transition-all duration-300
        ${isPopular
          ? 'bg-primary hover:bg-secondary text-white shadow-lg hover:shadow-primary/25 translate-y-0 active:translate-y-1'
          : 'bg-base-200 hover:bg-base-300 text-base-content'
        }
      `}>
        {isYearly ? 'Assinar Anual' : 'Começar Gratuitamente'}
      </button>

      {!isPopular && (
        <p className="text-center text-xs text-base-content/40 mt-4">
          Não requer cartão de crédito
        </p>
      )}
    </div>
  );
};
