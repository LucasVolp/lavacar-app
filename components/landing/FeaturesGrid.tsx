"use client";

import React from "react";
import { 
  CalendarOutlined, 
  DollarOutlined, 
  CheckCircleOutlined,
  ThunderboltOutlined 
} from "@ant-design/icons";

const features = [
  {
    title: "Agenda Digital Inteligente",
    description: "Adeus papel e caneta. Organize horários, bloqueie intervalos e elimine conflitos automaticamente.",
    icon: <CalendarOutlined className="text-2xl text-blue-500" />,
    className: "col-span-12 md:col-span-8 lg:col-span-6",
  },
  {
    title: "Zero No-Show",
    description: "Lembretes automáticos via WhatsApp reduzem faltas em até 80%. Garanta sua receita.",
    icon: <CheckCircleOutlined className="text-2xl text-green-500" />,
    className: "col-span-12 md:col-span-4 lg:col-span-3",
  },
  {
    title: "Controle Financeiro",
    description: "Saiba exatamente quanto lucrou no dia, semana ou mês com dashboards claros.",
    icon: <DollarOutlined className="text-2xl text-purple-500" />,
    className: "col-span-12 md:col-span-4 lg:col-span-3",
  },
  {
    title: "Gestão Ultra Rápida",
    description: "Cadastre serviços e preços em segundos. Tudo otimizado para mobile.",
    icon: <ThunderboltOutlined className="text-2xl text-yellow-500" />,
    className: "col-span-12 md:col-span-8 lg:col-span-12",
  },
];

export const FeaturesGrid = () => {
  return (
    <section id="features" className="py-24 px-6 bg-base-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-base-content mb-4">
            Feito para quem quer <span className="text-blue-500">crescer</span>
          </h2>
          <p className="text-base-content/60 text-lg max-w-2xl">
            Ferramentas poderosas para profissionalizar sua estética automotiva e fidelizar clientes.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                ${feature.className}
                group relative overflow-hidden
                bg-base-200/50 hover:bg-base-200
                border border-base-content/5 hover:border-base-content/10
                rounded-2xl p-8 transition-all duration-300
                backdrop-blur-sm
              `}
            >
              <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />
              
              <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                <div className="w-12 h-12 rounded-lg bg-base-300/50 border border-base-content/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-base-content mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-base-content/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
