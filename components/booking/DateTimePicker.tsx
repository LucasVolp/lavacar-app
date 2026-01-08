"use client";

import { useState, useMemo } from "react";
import { Button, Typography, Spin, Empty } from "antd";
import { LeftOutlined, RightOutlined, ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Schedule } from "@/types/schedule";
import { Appointment } from "@/types/appointment";
import { Shop } from "@/types/shop";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale("pt-br");

const { Title, Text } = Typography;

const WEEKDAY_MAP: Record<number, string> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

interface TimeSlot {
  time: string;
  available: boolean;
  label: string;
}

interface DateTimePickerProps {
  shopSchedules: Schedule[];
  existingAppointments: Appointment[];
  shop: Shop | null;
  totalDuration: number; // Duração total dos serviços selecionados em minutos
  selectedDate: Dayjs | null;
  selectedTime: string | null;
  onDateChange: (date: Dayjs) => void;
  onTimeChange: (time: string) => void;
  loading?: boolean;
}

export function DateTimePicker({
  shopSchedules,
  existingAppointments,
  shop,
  totalDuration,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  loading = false,
}: DateTimePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  // Verifica se um dia está aberto baseado nos schedules
  const isDayOpen = (date: Dayjs) => {
    const weekday = WEEKDAY_MAP[date.day()];
    const schedule = shopSchedules.find((s) => s.weekday === weekday);
    return schedule && schedule.isOpen === "ACTIVE";
  };

  // Verifica se a data está disponível para agendamento
  const isDateAvailable = (date: Dayjs) => {
    const today = dayjs().startOf("day");
    const maxDate = today.add(shop?.maxAdvanceDays || 30, "day");

    // Não pode agendar no passado
    if (date.isBefore(today)) return false;

    // Não pode ultrapassar o máximo de dias à frente
    if (date.isAfter(maxDate)) return false;

    // Verifica se o dia está aberto
    if (!isDayOpen(date)) return false;

    return true;
  };

  // Gera os slots de horário para a data selecionada
  const timeSlots = useMemo(() => {
    if (!selectedDate || !shop) return [];

    const weekday = WEEKDAY_MAP[selectedDate.day()];
    const schedule = shopSchedules.find((s) => s.weekday === weekday);

    if (!schedule || schedule.isOpen !== "ACTIVE") return [];

    const slots: TimeSlot[] = [];
    const minAdvanceMinutes = shop.minAdvanceMinutes || 60;

    // Parse horários
    const [startHour, startMin] = schedule.startTime.split(":").map(Number);
    const [endHour, endMin] = schedule.endTime.split(":").map(Number);

    let current = selectedDate.hour(startHour).minute(startMin);
    const end = selectedDate.hour(endHour).minute(endMin);

    // Horário de intervalo (almoço)
    let breakStart: Dayjs | null = null;
    let breakEnd: Dayjs | null = null;

    if (schedule.breakStartTime && schedule.breakEndTime) {
      const [bsHour, bsMin] = schedule.breakStartTime.split(":").map(Number);
      const [beHour, beMin] = schedule.breakEndTime.split(":").map(Number);
      breakStart = selectedDate.hour(bsHour).minute(bsMin);
      breakEnd = selectedDate.hour(beHour).minute(beMin);
    }

    while (current.isBefore(end)) {
      const slotEnd = current.add(totalDuration, "minute");
      const time = current.format("HH:mm");

      // Verifica se está no horário de intervalo
      const isInBreak =
        breakStart &&
        breakEnd &&
        ((current.isSameOrAfter(breakStart) && current.isBefore(breakEnd)) ||
          (slotEnd.isAfter(breakStart) && slotEnd.isSameOrBefore(breakEnd)));

      // Verifica se ultrapassa o horário de fechamento
      const exceedsEndTime = slotEnd.isAfter(end);

      // Verifica antecedência mínima
      const now = dayjs();
      const minTime = now.add(minAdvanceMinutes, "minute");
      const tooSoon = selectedDate.isSame(now, "day") && current.isBefore(minTime);

      // Verifica conflito com agendamentos existentes
      const hasConflict = existingAppointments.some((apt) => {
        const aptStart = dayjs(apt.scheduledAt);
        const aptEnd = dayjs(apt.endTime);

        // Considera apenas agendamentos não cancelados
        if (apt.status === "CANCELED" || apt.status === "NO_SHOW") return false;

        // Verifica sobreposição
        return (
          (current.isSameOrAfter(aptStart) && current.isBefore(aptEnd)) ||
          (slotEnd.isAfter(aptStart) && slotEnd.isSameOrBefore(aptEnd)) ||
          (current.isBefore(aptStart) && slotEnd.isAfter(aptEnd))
        );
      });

      const isAvailable = !isInBreak && !exceedsEndTime && !tooSoon && !hasConflict;

      slots.push({
        time,
        available: isAvailable,
        label: time,
      });

      current = current.add(shop.slotInterval || 30, "minute"); // Default interval update
    }

    return slots;
  }, [
    selectedDate,
    shop,
    shopSchedules,
    totalDuration,
    existingAppointments,
  ]);

  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  // Calendar generation logic
  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfMonth = currentMonth.startOf("month").day();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-3">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-slate-50"></div>
           <span className="text-slate-500 text-sm">Carregando disponibilidade...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Calendar Section */}
      <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-2xl p-6 transition-colors duration-300 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-slate-900 dark:text-slate-50 text-lg font-bold flex items-center gap-2 transition-colors duration-300">
            <CalendarOutlined />
            {currentMonth.format("MMMM YYYY")}
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={prevMonth} 
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#27272a] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              disabled={currentMonth.isBefore(dayjs(), 'month')}
            >
              <LeftOutlined />
            </button>
            <button 
              onClick={nextMonth} 
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#27272a] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <RightOutlined />
            </button>
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-4 text-center">
           {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
             <div key={i} className="text-xs font-bold text-slate-400 dark:text-slate-500">{d}</div>
           ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
           {blanks.map(i => <div key={`blank-${i}`} />)}
           {daysArray.map(day => {
              const date = currentMonth.date(day);
              const isSelected = selectedDate?.isSame(date, 'day');
              const available = isDateAvailable(date);
              
              return (
                <button
                   key={day}
                   disabled={!available}
                   onClick={() => onDateChange(date)}
                   className={`
                     h-10 w-full rounded-lg text-sm font-medium transition-all duration-200 relative
                     ${isSelected 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                        : available 
                          ? 'bg-slate-50 dark:bg-[#27272a] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700' 
                          : 'bg-transparent text-slate-300 dark:text-slate-700 cursor-not-allowed line-through'
                      }
                   `}
                >
                   {day}
                   {available && isSelected && (
                     <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 bg-white rounded-full"></span>
                   )}
                </button>
              );
           })}
        </div>
      </div>

      {/* Time Slots Section */}
      <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-2xl p-6 flex flex-col min-h-[400px] transition-colors duration-300 shadow-sm">
          <div className="mb-6">
             <h3 className="text-slate-900 dark:text-slate-50 text-lg font-bold flex items-center gap-2 mb-1 transition-colors duration-300">
                <ClockCircleOutlined />
                Horários
             </h3>
             <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">
                {selectedDate 
                  ? `Disponibilidade para ${selectedDate.format("DD [de] MMMM")}`
                  : "Selecione uma data para ver os horários"
                }
             </p>
          </div>

          {!selectedDate ? (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <CalendarOutlined className="text-4xl mb-4 opacity-50" />
                <p>Selecione um dia no calendário</p>
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
                {timeSlots.map(slot => (
                   <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => onTimeChange(slot.time)}
                      className={`
                         py-2 px-1 rounded-lg text-sm font-medium border transition-all duration-200
                         ${selectedTime === slot.time
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
                {Math.floor(totalDuration / 60)}h {totalDuration % 60 > 0 ? `${totalDuration % 60}min` : ''}
              </span>
            </div>
          )}
      </div>
    </div>
  );
}

export default DateTimePicker;
