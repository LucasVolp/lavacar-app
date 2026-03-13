"use client";

import React from "react";
import { Services } from "@/types/services";
import { ServiceCard } from "@/components/booking";

interface ServicesStepProps {
  isLoading: boolean;
  services: Services[];
  selectedServices: Services[];
  totalDuration: number;
  totalPrice: number;
  onToggleService: (service: Services) => void;
  formatDuration: (minutes: number) => string;
  vehicleSize?: string;
}

export function ServicesStep({
  isLoading,
  services,
  selectedServices,
  onToggleService,
  vehicleSize,
}: ServicesStepProps) {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Selecione os Serviços
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Escolha os serviços que deseja realizar no seu veículo.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 rounded-xl bg-slate-100 dark:bg-[#27272a] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((service) => {
            const isSelected = selectedServices.some((s) => s.id === service.id);
            return (
              <ServiceCard
                key={service.id}
                service={service}
                selected={isSelected}
                onSelect={onToggleService}
                vehicleSize={vehicleSize}
              />
            );
          })}
        </div>
      )}

      {services.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            Nenhum serviço disponível no momento.
          </p>
        </div>
      )}
    </div>
  );
}
