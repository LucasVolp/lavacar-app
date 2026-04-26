"use client";

import { useEffect, useMemo, useState } from "react";
import { Empty } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Schedule } from "@/types/schedule";
import { Shop } from "@/types/shop";
import {
  nowInTimezone,
  formatMonthYear,
  formatDayMonth,
  createDateInTimezone,
  timeToMinutes,
  minutesToTime,
  addMonths,
  subMonths,
  startOfMonth,
  getDaysInMonth,
  getDay,
  isBefore,
  isAfter,
  isSameDay,
  startOfDay,
  addDays,
  WEEKDAY_MAP,
  DEFAULT_TIMEZONE,
} from "@/utils/dateUtils";

interface TimeSlot {
  time: string;
  available: boolean;
  label: string;
}

interface DateTimePickerProps {
  shopSchedules: Schedule[];
  availableSlots: string[];
  shop: Shop | null;
  totalDuration: number;
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
  showTimes?: boolean;
  onShowTimesChange?: (showTimes: boolean) => void;
  onBackToCalendar?: () => void;
  loading?: boolean;
}

export function DateTimePicker({
  shopSchedules,
  availableSlots,
  shop,
  totalDuration,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  showTimes = false,
  onShowTimesChange,
  onBackToCalendar,
  loading = false,
}: DateTimePickerProps) {
  const shopTimeZone = shop?.timeZone || DEFAULT_TIMEZONE;
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(nowInTimezone(shopTimeZone)));

  useEffect(() => {
    setCurrentMonth(startOfMonth(nowInTimezone(shopTimeZone)));
  }, [shopTimeZone]);

  const isDayOpen = (date: Date) => {
    const weekday = WEEKDAY_MAP[getDay(date)];
    const schedule = shopSchedules.find((s) => s.weekday === weekday);
    return schedule && schedule.isOpen === "ACTIVE";
  };

  const isDateAvailable = (date: Date) => {
    const today = startOfDay(nowInTimezone(shopTimeZone));
    const maxDate = addDays(today, shop?.maxAdvanceDays || 30);

    if (isBefore(date, today)) return false;
    if (isAfter(date, maxDate)) return false;
    if (!isDayOpen(date)) return false;

    return true;
  };

  const timeSlots = useMemo(() => {
    if (!selectedDate || !shop || totalDuration <= 0) return [];

    const weekday = WEEKDAY_MAP[getDay(selectedDate)];
    const schedule = shopSchedules.find((s) => s.weekday === weekday);
    if (!schedule || schedule.isOpen !== "ACTIVE") {
      return [];
    }

    const allSlots: TimeSlot[] = [];
    const slotInterval = shop.slotInterval || 30;
    const startMinutes = timeToMinutes(schedule.startTime);
    const endMinutes = timeToMinutes(schedule.endTime);
    const availableSlotSet = new Set(availableSlots);

    for (let current = startMinutes; current < endMinutes; current += slotInterval) {
      const time = minutesToTime(current);
      allSlots.push({
        time,
        available: availableSlotSet.has(time),
        label: time,
      });
    }

    return allSlots;
  }, [availableSlots, selectedDate, shop, shopSchedules, totalDuration]);

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getDay(startOfMonth(currentMonth));
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getDateFromDay = (day: number): Date => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return createDateInTimezone(year, month, day, 12, 0, shopTimeZone);
  };

  const handleDateSelect = (date: Date) => {
    onDateChange(date);
    onShowTimesChange?.(true);
  };

  const handleBackToCalendar = () => {
    onBackToCalendar?.();
    onShowTimesChange?.(false);
  };

  const selectedDateLabel = selectedDate
    ? formatDayMonth(selectedDate, shopTimeZone)
    : "Selecione uma data";

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-slate-50" />
          <span className="text-slate-500 text-sm">Carregando disponibilidade...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
      <div
        className={`bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-2xl p-4 sm:p-6 transition-all duration-300 ease-out shadow-sm ${
          showTimes ? "hidden lg:block" : "block"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-slate-900 dark:text-slate-50 text-lg font-bold flex items-center gap-2 transition-colors duration-300 capitalize">
            <CalendarOutlined />
            {formatMonthYear(currentMonth, shopTimeZone)}
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCurrentMonth((current) => subMonths(current, 1))}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-[#27272a] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              disabled={isBefore(currentMonth, startOfMonth(nowInTimezone(shopTimeZone)))}
            >
              <LeftOutlined />
            </button>
            <button
              type="button"
              onClick={() => setCurrentMonth((current) => addMonths(current, 1))}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-[#27272a] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <RightOutlined />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-4 text-center">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
            <div key={i} className="text-xs font-bold text-slate-400 dark:text-slate-500">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {blanks.map((i) => (
            <div key={`blank-${i}`} />
          ))}
          {daysArray.map((day) => {
            const date = getDateFromDay(day);
            const isSelected = selectedDate && isSameDay(selectedDate, date);
            const available = isDateAvailable(date);

            return (
              <button
                key={day}
                type="button"
                disabled={!available}
                onClick={() => handleDateSelect(date)}
                className={`
                  min-h-[44px] w-full rounded-lg text-sm font-medium transition-all duration-200 relative
                  ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                      : available
                      ? "bg-slate-50 dark:bg-[#27272a] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                      : "bg-transparent text-slate-300 dark:text-slate-700 cursor-not-allowed line-through"
                  }
                `}
              >
                {day}
                {available && isSelected && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`space-y-4 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-2xl p-4 sm:p-6 flex flex-col min-h-[400px] transition-all duration-300 ease-out shadow-sm ${
          showTimes ? "block" : "hidden lg:flex"
        }`}
      >
        <div className="mb-6">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="text-slate-900 dark:text-slate-50 text-lg font-bold flex items-center gap-2 transition-colors duration-300">
              <ClockCircleOutlined />
              Horários
            </h3>

            {showTimes && (
              <button
                type="button"
                onClick={handleBackToCalendar}
                className="lg:hidden inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 dark:border-[#27272a] px-3 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-[#27272a]"
              >
                <LeftOutlined />
                Voltar
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleBackToCalendar}
            className="mt-2 w-full rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-left transition-all duration-300 hover:border-slate-300 hover:bg-slate-100 dark:border-[#27272a] dark:bg-[#111113] dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-[#1b1b1e] lg:cursor-default"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Data selecionada
                </div>
                <div className="truncate font-semibold capitalize text-slate-700 dark:text-slate-100">
                  {selectedDateLabel}
                </div>
              </div>
              <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-xl bg-white px-3 text-sm font-medium text-slate-700 shadow-sm dark:bg-[#27272a] dark:text-slate-200 lg:hidden">
                <LeftOutlined />
              </span>
            </div>
          </button>

          <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300 mt-4">
            {selectedDate
              ? `Disponibilidade para ${selectedDateLabel}`
              : "Selecione uma data para ver os horários"}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-600 mt-1 flex items-center gap-1">
            <ClockCircleOutlined className="text-[10px]" />
            Fuso horário: {shopTimeZone === "America/Sao_Paulo" ? "Horário de Brasília" : shopTimeZone}
          </p>
        </div>

        {!selectedDate ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <CalendarOutlined className="text-4xl mb-4 opacity-50" />
            <p className="text-center">Selecione um dia no calendário</p>
          </div>
        ) : timeSlots.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <Empty
              description={<span className="text-slate-500">Nenhum horário disponível</span>}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="[&_.ant-empty-img-simple-path]:fill-slate-300 dark:[&_.ant-empty-img-simple-path]:fill-slate-700 [&_.ant-empty-img-simple-g]:stroke-slate-400 dark:[&_.ant-empty-img-simple-g]:stroke-slate-700 [&_.ant-empty-img-simple-ellipse]:fill-slate-100 dark:[&_.ant-empty-img-simple-ellipse]:fill-slate-800"
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                disabled={!slot.available}
                onClick={() => onTimeChange(slot.time)}
                className={`
                  min-h-[44px] py-3 px-2 rounded-lg text-sm font-medium border transition-all duration-200
                  ${
                    selectedTime === slot.time
                      ? "bg-slate-900 dark:bg-slate-50 text-white dark:text-black border-slate-900 dark:border-slate-50 shadow-lg shadow-slate-900/20 dark:shadow-white/20 transform scale-105"
                      : slot.available
                      ? "bg-slate-50 dark:bg-[#09090b] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#27272a] hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-white"
                      : "bg-slate-50 dark:bg-[#09090b] text-slate-300 dark:text-slate-700 border-transparent cursor-not-allowed opacity-50"
                  }
                `}
              >
                {slot.time}
              </button>
            ))}
          </div>
        )}

        {totalDuration > 0 && selectedDate && timeSlots.length > 0 && (
          <div className="mt-auto px-4 py-3 bg-slate-50 dark:bg-[#09090b] rounded-lg border border-slate-200 dark:border-[#27272a] flex items-center justify-between transition-colors duration-300">
            <span className="text-slate-500 dark:text-slate-400 text-sm">Duração estimada</span>
            <span className="text-slate-700 dark:text-slate-200 font-medium">
              {Math.floor(totalDuration / 60)}h {totalDuration % 60 > 0 ? `${totalDuration % 60}min` : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default DateTimePicker;
