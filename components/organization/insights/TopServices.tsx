"use client";

import React from "react";

interface TopServicesProps {
  services: {
    serviceId: string;
    serviceName: string;
    count: number;
    revenue: number;
  }[];
}

export const TopServices: React.FC<TopServicesProps> = ({ services }) => {
  const maxRevenue = Math.max(...services.map((service) => service.revenue), 1);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 rounded-2xl h-full shadow-sm dark:shadow-none">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Serviços Mais Rentáveis</h3>

      {services.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 m-0">Sem serviços no período.</p>
      ) : (
        <div className="space-y-5">
          {services.map((item) => (
            <div key={item.serviceId}>
              <div className="flex justify-between text-sm mb-2 gap-3">
                <span className="text-zinc-700 dark:text-zinc-300 font-medium line-clamp-1">{item.serviceName}</span>
                <span className="text-zinc-500 whitespace-nowrap">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.revenue)}
                </span>
              </div>
              <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                />
              </div>
              <p className="m-0 mt-1 text-xs text-zinc-500">{item.count} atendimentos</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
