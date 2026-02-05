"use client";

import React, { useState, useMemo } from "react";
import { Tag, Button, Tooltip } from "antd";
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
    <div className="flex flex-col xl:flex-row gap-8 min-h-[800px] h-auto bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      
      {/* LEFT: Custom Calendar Grid */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 capitalize m-0">
              {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
            </h2>
            <p className="text-slate-400 text-sm m-0">Gerencie sua agenda mensal</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <Button type="text" shape="circle" icon={<LeftOutlined />} onClick={prevMonth} />
            <Button type="text" className="font-semibold px-4" onClick={goToToday}>Hoje</Button>
            <Button type="text" shape="circle" icon={<RightOutlined />} onClick={nextMonth} />
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-4">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
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
                    ? "bg-blue-50/30 border-blue-500 ring-1 ring-blue-500 z-10 shadow-md" 
                    : "bg-white border-transparent hover:border-slate-200 hover:bg-slate-50"}
                  ${!isCurrentMonth ? "bg-slate-50/50" : ""}
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
                                    ? "text-blue-600 bg-blue-100" 
                                    : !isCurrentMonth ? "text-slate-300" : "text-slate-700"}
                        `}
                    >
                        {format(day, "d")}
                    </span>
                </div>

                {/* Detailed Event Chips */}
                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                    {appointments.slice(0, 3).map((apt) => {
                         // Determine text color based on status for contrast
                         // Usually statusConfig colors are strong, so we use them for text/border and light bg
                         const isConfirmed = ['CONFIRMED', 'WAITING', 'IN_PROGRESS'].includes(apt.status);
                         const isPending = apt.status === 'PENDING';
                         const isCompleted = apt.status === 'COMPLETED';

                         let chipClass = "bg-slate-100 text-slate-600 border-slate-200";
                         if (isConfirmed) chipClass = "bg-blue-50 text-blue-700 border-blue-100";
                         if (isPending) chipClass = "bg-orange-50 text-orange-700 border-orange-100";
                         if (isCompleted) chipClass = "bg-green-50 text-green-700 border-green-100";
                         if (apt.status === 'CANCELED') chipClass = "bg-red-50 text-red-400 border-red-100 line-through opacity-70";

                         return (
                            <div 
                                key={apt.id}
                                className={`
                                    text-[10px] leading-tight px-1.5 py-1 rounded-md border truncate font-medium
                                    ${chipClass}
                                `}
                                title={`${format(parseISO(apt.scheduledAt), 'HH:mm')} - ${apt.user?.firstName || 'Cliente'}`}
                            >
                                <span className="font-bold mr-1">{format(parseISO(apt.scheduledAt), 'HH:mm')}</span>
                                {apt.user?.firstName || "Cliente"}
                            </div>
                        )
                    })}
                    
                    {appointments.length > 3 && (
                        <div className="text-[10px] text-slate-400 font-bold px-1.5 pt-0.5">
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
      <div className="w-full xl:w-[420px] bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col h-full overflow-hidden shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-white">
            <h3 className="text-lg font-bold text-slate-800 m-0 capitalize">
                {format(selectedDate, "EEEE", { locale: ptBR })}
            </h3>
            <p className="text-slate-500 m-0">
                {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </p>
            <div className="mt-4 flex items-center gap-2">
                <Tag color="blue" className="rounded-full px-3 border-none bg-blue-100 text-blue-700 font-bold">
                    {selectedDayAppointments.length} agendamentos
                </Tag>
                {isToday(selectedDate) && (
                    <Tag color="green" className="rounded-full px-3 border-none bg-green-100 text-green-700 font-bold">
                        Hoje
                    </Tag>
                )}
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {selectedDayAppointments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                    <CalendarOutlined className="text-5xl mb-4" />
                    <p className="text-lg font-medium">Sem agendamentos</p>
                </div>
            ) : (
                <div className="space-y-0 relative">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200 z-0" />

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
                                    className="absolute left-[13px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm z-20"
                                    style={{ backgroundColor: status?.color || '#cbd5e1' }}
                                />

                                {/* Card */}
                                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group-hover:-translate-y-1 duration-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-slate-800 tracking-tight">
                                                {time}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
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
                                        <div className="text-sm font-semibold text-slate-700">
                                            {apt.services[0]?.serviceName}
                                        </div>
                                        {apt.services.length > 1 && (
                                            <div className="text-xs text-slate-400 mt-0.5">
                                                + {apt.services.length - 1} outros serviços
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Info */}
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-2">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <UserOutlined />
                                            <span className="truncate max-w-[100px] font-medium">
                                                {apt.user?.firstName || "Cliente"}
                                            </span>
                                        </div>
                                        <div className="font-bold text-emerald-600 text-sm">
                                            R$ {parseFloat(apt.totalPrice).toFixed(0)}
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