"use client";

import React, { useState, useMemo } from "react";
import { Button, Tooltip } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Appointment } from "@/types/appointment";
import { useRouter } from "next/navigation";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { sanitizeText, formatCurrency } from "@/lib/security";

interface AppointmentsCalendarProps {
  appointmentsByDate: Record<string, Appointment[]>;
  statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode; bgColor: string }>;
  shopId: string;
}

export const AppointmentsCalendar: React.FC<AppointmentsCalendarProps> = ({
  appointmentsByDate,
  statusConfig,
  shopId,
}) => {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate calendar grid days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart); // defaults to Sunday
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const selectedDateKey = format(selectedDate, "yyyy-MM-dd");
  const selectedDayAppointments = (appointmentsByDate[selectedDateKey] || []).sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    const now = new Date();
    setCurrentMonth(now);
    setSelectedDate(now);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 min-h-[800px] h-auto bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors">

      {/* LEFT: Custom Calendar Grid */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 capitalize m-0">
              {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
            </h2>
            <p className="text-zinc-400 dark:text-zinc-500 text-sm m-0">Gerencie sua agenda mensal</p>
          </div>
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <Button type="text" shape="circle" icon={<LeftOutlined />} onClick={prevMonth} />
            <Button type="text" className="font-semibold px-4" onClick={goToToday}>Hoje</Button>
            <Button type="text" shape="circle" icon={<RightOutlined />} onClick={nextMonth} />
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-4">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div key={day} className="text-center text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-2">
          {calendarDays.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const appointments = (appointmentsByDate[dateKey] || []).sort(
                (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
            );
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isDayToday = isToday(day);

            return (
              <div
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  relative rounded-xl p-1.5 cursor-pointer transition-all duration-200 flex flex-col
                  border
                  ${isSelected
                    ? "bg-blue-50/30 dark:bg-blue-900/20 border-blue-500 ring-1 ring-blue-500 z-10 shadow-md"
                    : "bg-white dark:bg-zinc-900 border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"}
                  ${!isCurrentMonth ? "bg-zinc-50/50 dark:bg-zinc-800/30" : ""}
                `}
              >
                {/* Day Number */}
                <div className="flex justify-between items-start mb-1 px-1">
                    <span
                        className={`
                            text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full
                            ${isDayToday
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                                : isSelected
                                    ? "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50"
                                    : !isCurrentMonth ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-700 dark:text-zinc-300"}
                        `}
                    >
                        {format(day, "d")}
                    </span>
                </div>

                {/* Detailed Event Chips */}
                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                    {appointments.slice(0, 3).map((apt) => {
                         const isConfirmed = ['CONFIRMED', 'WAITING', 'IN_PROGRESS'].includes(apt.status);
                         const isPending = apt.status === 'PENDING';
                         const isCompleted = apt.status === 'COMPLETED';

                         let chipClass = "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700";
                         if (isConfirmed) chipClass = "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800";
                         if (isPending) chipClass = "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-800";
                         if (isCompleted) chipClass = "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800";
                         if (apt.status === 'CANCELED') chipClass = "bg-red-50 dark:bg-red-900/30 text-red-400 dark:text-red-500 border-red-100 dark:border-red-800 line-through opacity-70";

                         return (
                            <div
                                key={apt.id}
                                className={`
                                    text-[10px] leading-tight px-1.5 py-1 rounded-md border truncate font-medium
                                    ${chipClass}
                                `}
                                title={`${format(parseISO(apt.scheduledAt), 'HH:mm')} - ${sanitizeText(apt.user?.firstName || 'Cliente')}`}
                            >
                                <span className="font-bold mr-1">{format(parseISO(apt.scheduledAt), 'HH:mm')}</span>
                                {sanitizeText(apt.user?.firstName || "Cliente")}
                            </div>
                        )
                    })}

                    {appointments.length > 3 && (
                        <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold px-1.5 pt-0.5">
                            + {appointments.length - 3} mais
                        </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Detailed Timeline Agenda */}
      <div className="w-full xl:w-[420px] bg-zinc-50/50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex flex-col h-full overflow-hidden shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 m-0 capitalize">
                {format(selectedDate, "EEEE", { locale: ptBR })}
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 m-0">
                {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </p>
            <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    {selectedDayAppointments.length} agendamentos
                </span>
                {isToday(selectedDate) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        Hoje
                    </span>
                )}
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {selectedDayAppointments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 opacity-60">
                    <CalendarOutlined className="text-5xl mb-4" />
                    <p className="text-lg font-medium">Sem agendamentos</p>
                </div>
            ) : (
                <div className="space-y-0 relative">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-zinc-200 dark:bg-zinc-700 z-0" />

                    {selectedDayAppointments.map((apt) => {
                        const status = statusConfig[apt.status];
                        const time = format(parseISO(apt.scheduledAt), "HH:mm");

                        return (
                            <div
                                key={apt.id}
                                className="relative z-10 pl-10 pb-6 last:pb-0 group"
                                onClick={() => router.push(`/admin/shop/${shopId}/appointments/${apt.id}`)}
                            >
                                <div
                                    className="absolute left-[13px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm z-20"
                                    style={{ backgroundColor: status?.color || '#71717a' }}
                                />

                                {/* Card */}
                                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group-hover:-translate-y-1 duration-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
                                                {time}
                                            </span>
                                            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-100 dark:border-zinc-700">
                                                {apt.totalDuration} min
                                            </span>
                                        </div>
                                        <Tooltip title={status?.label}>
                                            <div style={{ color: status?.color }} className="text-lg">
                                                {status?.icon}
                                            </div>
                                        </Tooltip>
                                    </div>

                                    {/* Service List (First 2) */}
                                    <div className="mb-3">
                                        <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                            {sanitizeText(apt.services[0]?.serviceName)}
                                        </div>
                                        {apt.services.length > 1 && (
                                            <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                                                + {apt.services.length - 1} outros serviços
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Info */}
                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-50 dark:border-zinc-800 mt-2">
                                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                                            <UserOutlined />
                                            <span className="truncate max-w-[100px] font-medium">
                                                {sanitizeText(apt.user?.firstName || "Cliente")}
                                            </span>
                                        </div>
                                        <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                                            {formatCurrency(apt.totalPrice)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};