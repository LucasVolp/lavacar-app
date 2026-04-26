"use client";

import React, { useMemo, useState } from "react";
import { LeftOutlined, CalendarOutlined } from "@ant-design/icons";
import { DateTimePicker } from "@/components/booking";
import { Schedule } from "@/types/schedule";
import { Shop } from "@/types/shop";

interface DateTimeStepProps {
  schedules: Schedule[];
  availableSlots: string[];
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
  availableSlots,
  shop,
  totalDuration,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  isLoading,
}: DateTimeStepProps) {
  const [hiddenByUser, setHiddenByUser] = useState(false);
  const showTimes = !!selectedDate && !hiddenByUser;

  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) {
      return "Selecione uma data";
    }

    return selectedDate.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
  }, [selectedDate]);

  const handleDateChange = (date: Date) => {
    onDateChange(date);
    setHiddenByUser(false);
  };

  const handleBackToCalendar = () => {
    setHiddenByUser(true);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Data e Horário
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Escolha o melhor momento para trazer seu veículo.
        </p>
      </div>

      <div className="md:hidden mb-4">
        <button
          type="button"
          onClick={showTimes ? handleBackToCalendar : undefined}
          disabled={!showTimes || !selectedDate}
          className={`w-full rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
            selectedDate
              ? "border-slate-200 bg-white text-slate-900 dark:border-[#27272a] dark:bg-[#18181b] dark:text-white"
              : "border-dashed border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-[#111113] dark:text-slate-500"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">
                {showTimes ? "Data selecionada" : "Calendário"}
              </div>
              <div className="truncate font-semibold capitalize">{selectedDateLabel}</div>
            </div>
            {showTimes ? (
              <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-xl bg-slate-100 px-3 text-sm font-medium text-slate-700 dark:bg-[#27272a] dark:text-slate-200">
                <LeftOutlined />
              </span>
            ) : (
              <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-xl bg-slate-100 px-3 text-sm font-medium text-slate-700 dark:bg-[#27272a] dark:text-slate-200">
                <CalendarOutlined />
              </span>
            )}
          </div>
        </button>
      </div>

      <DateTimePicker
        shopSchedules={schedules}
        availableSlots={availableSlots}
        shop={shop}
        totalDuration={totalDuration}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onDateChange={handleDateChange}
        onTimeChange={onTimeChange}
        loading={isLoading}
        showTimes={showTimes}
        onShowTimesChange={(show) => setHiddenByUser(!show)}
        onBackToCalendar={handleBackToCalendar}
      />
    </div>
  );
}
