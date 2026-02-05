"use client";

import React from "react";
import { DateTimePicker } from "@/components/booking";
import { Schedule } from "@/types/schedule";
import { Appointment } from "@/types/appointment";
import { Shop } from "@/types/shop";

interface DateTimeStepProps {
  schedules: Schedule[];
  existingAppointments: Appointment[];
  shop: Shop | null;
  totalDuration: number;
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
  isLoading: boolean;
}

export function DateTimeStep({
  schedules,
  existingAppointments,
  shop,
  totalDuration,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  isLoading,
}: DateTimeStepProps) {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Data e Horário
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Escolha o melhor momento para trazer seu veículo.
        </p>
      </div>

      <DateTimePicker
        shopSchedules={schedules}
        existingAppointments={existingAppointments}
        shop={shop}
        totalDuration={totalDuration}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onDateChange={onDateChange}
        onTimeChange={onTimeChange}
        loading={isLoading}
      />
    </div>
  );
}
