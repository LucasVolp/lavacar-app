"use client";

import React from "react";
import { Button, Card, Divider } from "antd";
import { CheckCircleFilled, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Services } from "@/types/services";

interface BookingSuccessProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedServices: Services[];
  totalDuration: number;
  totalPrice: number;
  formatDuration: (min: number) => string;
  onReturnToShop: () => void;
  onReturnToHome: () => void;
}

export function BookingSuccess({
  selectedDate,
  selectedTime,
  selectedServices,
  totalDuration,
  totalPrice,
  formatDuration,
  onReturnToShop,
  onReturnToHome,
}: BookingSuccessProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#09090b] p-6">
      <Card className="max-w-xl w-full border-none shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-[#18181b]">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleFilled className="text-5xl text-emerald-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Agendamento Confirmado!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Seu veículo está agendado e estamos te esperando.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-[#09090b]/50 rounded-2xl p-6 mb-8 border border-slate-100 dark:border-[#27272a]">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                <CalendarOutlined className="text-lg" />
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Data</div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) : "-"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-500">
                <ClockCircleOutlined className="text-lg" />
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Horário</div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {selectedTime} ({formatDuration(totalDuration)})
                </div>
              </div>
            </div>
          </div>

          <Divider className="my-4 dark:border-[#27272a]" />

          <div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-3">Serviços Escolhidos</div>
            <ul className="space-y-2">
              {selectedServices.map(service => (
                <li key={service.id} className="flex justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-300">{service.name}</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    R$ {parseFloat(service.price).toFixed(2).replace('.', ',')}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-200 dark:border-[#27272a]">
              <span className="font-bold text-slate-900 dark:text-white">Total Estimado</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            type="primary" 
            size="large" 
            block 
            onClick={onReturnToHome}
            className="h-12 bg-slate-900 hover:bg-slate-800 border-none font-semibold rounded-xl"
          >
            Ver Meus Agendamentos
          </Button>
          <Button 
            size="large" 
            block 
            onClick={onReturnToShop}
            className="h-12 border-slate-200 dark:border-[#27272a] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold rounded-xl"
          >
            Novo Agendamento
          </Button>
        </div>
      </Card>
    </div>
  );
}
