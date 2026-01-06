"use client";

import { useState, useMemo } from "react";
import { Button, Typography, Spin, Empty } from "antd";
import { LeftOutlined, RightOutlined, ClockCircleOutlined } from "@ant-design/icons";
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
    const slotInterval = shop.slotInterval || 30;
    const bufferTime = shop.bufferBetweenSlots || 0;
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

      const available =
        !isInBreak && !exceedsEndTime && !tooSoon && !hasConflict;

      slots.push({
        time,
        available,
        label: time,
      });

      current = current.add(slotInterval + bufferTime, "minute");
    }

    return slots;
  }, [
    selectedDate,
    shop,
    shopSchedules,
    totalDuration,
    existingAppointments,
  ]);

  const handleMonthChange = (direction: "prev" | "next") => {
    setCurrentMonth((prev) =>
      direction === "prev" ? prev.subtract(1, "month") : prev.add(1, "month")
    );
  };

  const renderDateCell = (date: Dayjs) => {
    const isAvailable = isDateAvailable(date);
    const isSelected = selectedDate && date.isSame(selectedDate, "day");
    const isToday = date.isSame(dayjs(), "day");

    return (
      <div
        className={`
          w-full h-full flex items-center justify-center rounded-lg transition-all
          ${isAvailable ? "cursor-pointer hover:bg-primary/10" : "cursor-not-allowed opacity-40"}
          ${isSelected ? "bg-primary text-white" : ""}
          ${isToday && !isSelected ? "border-2 border-primary" : ""}
        `}
        onClick={() => isAvailable && onDateChange(date)}
      >
        {date.date()}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendário */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            icon={<LeftOutlined />}
            onClick={() => handleMonthChange("prev")}
          />
          <Title level={5} className="!mb-0 capitalize">
            {currentMonth.format("MMMM YYYY")}
          </Title>
          <Button
            icon={<RightOutlined />}
            onClick={() => handleMonthChange("next")}
          />
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {(() => {
            const firstDay = currentMonth.startOf("month");
            const lastDay = currentMonth.endOf("month");
            const startPadding = firstDay.day();
            const days = [];

            // Padding inicial
            for (let i = 0; i < startPadding; i++) {
              days.push(
                <div key={`pad-start-${i}`} className="h-10 w-full" />
              );
            }

            // Dias do mês
            let day = firstDay;
            while (day.isSameOrBefore(lastDay)) {
              const currentDay = day;
              days.push(
                <div key={day.format("YYYY-MM-DD")} className="h-10 w-full">
                  {renderDateCell(currentDay)}
                </div>
              );
              day = day.add(1, "day");
            }

            return days;
          })()}
        </div>
      </div>

      {/* Horários */}
      {selectedDate && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <ClockCircleOutlined className="text-primary" />
            <Title level={5} className="!mb-0">
              Horários disponíveis - {selectedDate.format("DD/MM/YYYY")}
            </Title>
          </div>

          {timeSlots.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Nenhum horário disponível para esta data"
            />
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  type={selectedTime === slot.time ? "primary" : "default"}
                  disabled={!slot.available}
                  onClick={() => slot.available && onTimeChange(slot.time)}
                  className={`
                    ${!slot.available ? "opacity-40" : ""}
                    ${selectedTime === slot.time ? "" : "hover:border-primary hover:text-primary"}
                  `}
                >
                  {slot.label}
                </Button>
              ))}
            </div>
          )}

          {totalDuration > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <Text type="secondary">
                Duração total do serviço:{" "}
                <strong>{Math.floor(totalDuration / 60)}h {totalDuration % 60}min</strong>
              </Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DateTimePicker;
