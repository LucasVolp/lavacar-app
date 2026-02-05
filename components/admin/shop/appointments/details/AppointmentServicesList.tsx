"use client";

import React from "react";
import { ToolOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { AppointmentService } from "@/types/appointment";
import { sanitizeText, formatCurrency } from "@/lib/security";

interface AppointmentServicesListProps {
  services: AppointmentService[];
}

export const AppointmentServicesList: React.FC<AppointmentServicesListProps> = ({ services }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-colors">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ToolOutlined className="text-blue-500" />
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 m-0">
            Serviços Contratados
          </h3>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
          {services.length} {services.length === 1 ? "serviço" : "serviços"}
        </span>
      </div>

      {/* List */}
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800" role="list" aria-label="Lista de serviços">
        {services.map((service) => (
          <li
            key={service.id}
            className="px-6 py-4 flex justify-between items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-900/30"
                aria-hidden="true"
              >
                <ToolOutlined />
              </div>
              <div>
                <h4 className="font-bold text-zinc-800 dark:text-zinc-100 text-base m-0">
                  {sanitizeText(service.serviceName)}
                </h4>
                <span className="inline-flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md mt-1">
                  <ClockCircleOutlined className="text-[10px]" />
                  {service.duration} min
                </span>
              </div>
            </div>
            <span className="font-bold text-zinc-700 dark:text-zinc-200 text-lg">
              {formatCurrency(service.servicePrice)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
