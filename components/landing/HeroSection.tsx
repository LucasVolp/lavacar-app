"use client";

import React from "react";
import Link from "next/link";
import { CarOutlined, ShopOutlined, ArrowRightOutlined } from "@ant-design/icons";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 pt-20 pb-16 bg-base-100 overflow-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-content/5 border border-base-content/10 mb-8 backdrop-blur-sm animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-base-content/70 text-sm font-medium">
            Disponível em Três Lagoas
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-base-content mb-6 leading-tight">
          A Revolução Automotiva <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            na Palma da Mão
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-base-content/60 mb-12 max-w-2xl mx-auto leading-relaxed">
          Agendamento simples para quem ama carros. <br className="hidden sm:block"/>
          Gestão poderosa para quem ama lucrar.
        </p>

        {/* Dual Gate Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto w-full">
          {/* Driver Option */}
          <Link href="/client" className="group">
            <div className="h-full p-6 sm:p-8 rounded-2xl bg-blue-600 hover:bg-blue-500 border border-blue-500 transition-all duration-300 flex flex-col items-center sm:items-start text-center sm:text-left gap-4 shadow-lg shadow-blue-900/20 group-hover:shadow-blue-500/20 group-hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white text-2xl mb-2">
                <CarOutlined />
              </div>
              <div>
                <h3 className="text-white text-xl font-bold mb-1">
                  Sou Cliente
                </h3>
                <p className="text-blue-100 text-sm">
                  Cadastre seus veículos e acompanhe seus serviços em tempo real.
                </p>
              </div>
              <div className="mt-auto pt-4 flex items-center gap-2 text-white font-medium group-hover:translate-x-1 transition-transform">
                Acessar minha área <ArrowRightOutlined />
              </div>
            </div>
          </Link>

          {/* Business Owner Option */}
          <Link href="/owner" className="group">
            <div className="h-full p-6 sm:p-8 rounded-2xl bg-base-200/50 hover:bg-base-200 border border-base-300 hover:border-base-content/20 transition-all duration-300 flex flex-col items-center sm:items-start text-center sm:text-left gap-4 backdrop-blur-sm group-hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-base-300 flex items-center justify-center text-base-content text-2xl mb-2 border border-base-content/5">
                <ShopOutlined />
              </div>
              <div>
                <h3 className="text-base-content text-xl font-bold mb-1">
                  Sou Dono de Estética
                </h3>
                <p className="text-base-content/60 text-sm">
                  Gerencie agendamentos e faturamento do seu negócio.
                </p>
              </div>
              <div className="mt-auto pt-4 flex items-center gap-2 text-base-content/80 font-medium group-hover:text-base-content group-hover:translate-x-1 transition-transform">
                Acessar painel <ArrowRightOutlined />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
