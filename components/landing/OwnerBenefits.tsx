"use client";

import React, { useState, useEffect } from "react";
import { 
  RiseOutlined, 
  TeamOutlined, 
  SafetyCertificateOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";

export const OwnerBenefits = () => {
  return (
    <section id="benefits" className="py-24 px-6 bg-base-200 border-y border-base-content/5 relative overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          
          {/* Content */}
          <div className="w-full md:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <span className="text-blue-500 text-sm font-medium">Exclusivo para Donos</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-6 leading-tight">
              Sua estética opera no <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                piloto automático
              </span>
            </h2>
            
            <p className="text-base-content/60 text-lg mb-8 leading-relaxed">
              Enquanto você cuida da qualidade do serviço, nós cuidamos da burocracia. 
              Elimine planilhas, papelada e erros de cálculo.
            </p>

            <div className="space-y-6">
              <BenefitItem 
                icon={<RiseOutlined />}
                title="Aumente seu Faturamento"
                description="Lembretes automáticos trazem o cliente de volta com mais frequência."
              />
              <BenefitItem 
                icon={<TeamOutlined />}
                title="Gestão de Equipe"
                description="Controle comissões de lavadores e produtividade individual."
              />
              <BenefitItem 
                icon={<SafetyCertificateOutlined />}
                title="Profissionalismo Total"
                description="O cliente recebe notificações de status (Em lavagem, Pronto) direto no WhatsApp."
              />
            </div>
          </div>

          {/* Visual/Stats Representation - Carousel */}
          <div className="w-full md:w-1/2 relative">
            <AppCarousel />
            
            {/* Background elements */}
            <div className="absolute -z-10 top-10 -right-10 w-full h-full bg-base-300/30 rounded-2xl transform rotate-6 border border-base-content/5" />
            <div className="absolute -z-20 top-20 -right-20 w-full h-full bg-base-200/20 rounded-2xl transform rotate-12 border border-base-content/5" />
          </div>

        </div>
      </div>
    </section>
  );
};

const BenefitItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex gap-4">
    <div className="w-12 h-12 rounded-xl bg-base-200 flex-shrink-0 flex items-center justify-center text-blue-500 text-xl border border-base-content/10">
      {icon}
    </div>
    <div>
      <h3 className="text-base-content font-semibold mb-1">{title}</h3>
      <p className="text-base-content/60 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const AppCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    // Slide 1: Financeiro
    <div key="finance" className="h-full flex flex-col justify-between animate-fade-in">
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-base-content/60 text-sm mb-1 font-medium tracking-wide uppercase">Receita Mensal</div>
            <div className="text-3xl font-bold text-base-content">R$ 42.580,00</div>
          </div>
          <div className="px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 text-green-500 text-sm font-medium flex items-center gap-1">
            <RiseOutlined /> +18.4%
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-2 bg-base-200 rounded-full overflow-hidden">
            <div className="h-full w-[75%] bg-blue-500 rounded-full" />
          </div>
          <div className="flex justify-between text-sm text-base-content/60">
            <span>Meta mensal</span>
            <span>75% atingida</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-base-content/10 grid grid-cols-2 gap-4">
        <div className="p-4 bg-base-200/50 rounded-xl border border-base-content/10">
          <div className="text-base-content/60 text-xs mb-1">Agendamentos hoje</div>
          <div className="text-xl font-bold text-base-content">24</div>
        </div>
        <div className="p-4 bg-base-200/50 rounded-xl border border-base-content/10">
          <div className="text-base-content/60 text-xs mb-1">Ticket Médio</div>
          <div className="text-xl font-bold text-base-content">R$ 85,00</div>
        </div>
      </div>
    </div>,

    // Slide 2: Agenda
    <div key="schedule" className="h-full flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
           <div className="text-base-content/60 text-sm mb-1 font-medium tracking-wide uppercase">Agenda de Hoje</div>
           <div className="text-2xl font-bold text-base-content">Próximos Clientes</div>
        </div>
        <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
           <CalendarOutlined />
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {[
          { time: "09:00", plate: "ABC-1234", car: "Toyota Corolla", status: "Em andamento", color: "blue" },
          { time: "10:30", plate: "XYZ-9876", car: "Honda Civic", status: "Confirmado", color: "green" },
          { time: "11:00", plate: "DEF-5678", car: "Jeep Compass", status: "Pendente", color: "orange" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 p-3 bg-base-200/50 rounded-xl border border-base-content/5">
            <div className="bg-base-300 px-2 py-1 rounded text-xs font-mono text-base-content/80">
              {item.time}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-base-content">{item.car}</div>
              <div className="text-xs text-base-content/50">{item.plate}</div>
            </div>
            <div className={`text-[10px] px-2 py-0.5 rounded-full bg-${item.color}-500/10 text-${item.color}-500 font-medium border border-${item.color}-500/20`}>
              {item.status}
            </div>
          </div>
        ))}
        <div className="p-3 bg-base-200/30 rounded-xl border border-base-content/5 opacity-50 flex justify-center items-center text-xs text-base-content/40">
           + 4 agendamentos hoje
        </div>
      </div>
    </div>,

    // Slide 3: Avaliações e Clientes
    <div key="reviews" className="h-full flex flex-col justify-between animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
           <div className="text-base-content/60 text-sm mb-1 font-medium tracking-wide uppercase">Reputação</div>
           <div className="text-2xl font-bold text-base-content">Nota 4.9/5.0</div>
        </div>
        <div className="flex text-yellow-500 gap-1 text-sm">
           <StarOutlined /><StarOutlined /><StarOutlined /><StarOutlined /><StarOutlined />
        </div>
      </div>

      <div className="space-y-4 mb-4">
        {[
          { name: "Maria Oliveira", text: "Serviço impecável! Meu carro ficou novo.", time: "há 2h" },
          { name: "Carlos Santos", text: "Muito rápido e organizado. Recomendo.", time: "há 5h" },
        ].map((review, idx) => (
          <div key={idx} className="p-4 bg-base-200/50 rounded-xl border border-base-content/5">
             <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-secondary text-[10px] text-white flex items-center justify-center">
                     {review.name.charAt(0)}
                   </div>
                   <span className="text-sm font-semibold text-base-content">{review.name}</span>
                </div>
                <span className="text-xs text-base-content/40">{review.time}</span>
             </div>
             <p className="text-xs text-base-content/70 italic">&quot;{review.text}&quot;</p>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl">
        <CheckCircleOutlined className="text-green-500" />
        <span className="text-xs text-green-500 font-medium">Selo de Super Estética conquistado este mês!</span>
      </div>
    </div>
  ];

  useEffect(() => {
    if (isHovered) return; // Pause on hover

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // 4 seconds per slide

    return () => clearInterval(interval);
  }, [slides.length, isHovered]);

  return (
    <div 
      className="relative z-10 bg-base-100 border border-base-content/10 rounded-2xl p-8 shadow-2xl h-[450px] flex flex-col transition-all duration-300 hover:shadow-primary/5 hover:border-primary/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slide Content */}
      <div className="flex-1 overflow-hidden relative">
         <div key={activeSlide} className="animate-fade-in-up h-full">
            {slides[activeSlide]}
         </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6 pt-6 border-t border-base-content/5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeSlide === idx 
                ? "w-8 bg-blue-500" 
                : "w-2 bg-base-content/20 hover:bg-base-content/40"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
