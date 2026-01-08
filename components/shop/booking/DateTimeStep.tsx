"use client";

import { CalendarOutlined } from "@ant-design/icons";
import { DateTimePicker } from "@/components/booking";
import { Schedule } from "@/types/schedule";
import { Appointment } from "@/types/appointment";
import { Shop } from "@/types/shop";
import { Dayjs } from "dayjs";

interface DateTimeStepProps {
  schedules: Schedule[];
  existingAppointments: Appointment[];
  shop: Shop | null;
  totalDuration: number;
  selectedDate: Dayjs | null;
  selectedTime: string | null;
  onDateChange: (date: Dayjs) => void;
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
    <div className="p-6 sm:p-10">
      {/* Step Header */}
      <div className="flex items-center gap-5 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl shadow-lg shadow-emerald-500/20">
          <CalendarOutlined />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1 transition-colors duration-300">
            Escolha a Data e Horário
          </h2>
          <p className="text-slate-500 dark:text-slate-400 transition-colors duration-300">
            Selecione o melhor momento para o serviço.
          </p>
        </div>
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
