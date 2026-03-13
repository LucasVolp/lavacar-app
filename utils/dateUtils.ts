import {
  format,
  addMinutes,
  addDays,
  addMonths,
  subMonths,
  startOfDay,
  startOfMonth,
  getDay,
  getDaysInMonth,
  isBefore,
  isAfter,
  isSameDay,
  isSameMonth,
  getYear,
  getMonth,
  getDate,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';

export const DEFAULT_TIMEZONE = 'America/Campo_Grande';

export function nowInTimezone(timeZone: string = DEFAULT_TIMEZONE): Date {
  return toZonedTime(new Date(), timeZone);
}

export function createDateInTimezone(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0,
  timeZone: string = DEFAULT_TIMEZONE
): Date {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
  const localDate = new Date(dateStr);
  return toZonedTime(localDate, timeZone);
}

export function formatDateInTimezone(
  date: Date,
  formatStr: string,
  timeZone: string = DEFAULT_TIMEZONE
): string {
  return formatInTimeZone(date, timeZone, formatStr, { locale: ptBR });
}

export function formatDisplayDate(date: Date, timeZone: string = DEFAULT_TIMEZONE): string {
  return formatInTimeZone(date, timeZone, 'dd/MM/yyyy', { locale: ptBR });
}

export function formatMonthYear(date: Date, timeZone: string = DEFAULT_TIMEZONE): string {
  return formatInTimeZone(date, timeZone, 'MMMM yyyy', { locale: ptBR });
}

export function formatDayMonth(date: Date, timeZone: string = DEFAULT_TIMEZONE): string {
  return formatInTimeZone(date, timeZone, "dd 'de' MMMM", { locale: ptBR });
}

export function extractTime(date: Date, timeZone: string = DEFAULT_TIMEZONE): string {
  return formatInTimeZone(date, timeZone, 'HH:mm');
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function setTimeOnDate(date: Date, timeStr: string, timeZone: string = DEFAULT_TIMEZONE): Date {
  const [hour, minute] = timeStr.split(':').map(Number);
  const year = getYear(date);
  const month = getMonth(date);
  const day = getDate(date);

  const dateTimeStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;

  return fromZonedTime(dateTimeStr, timeZone);
}

export const WEEKDAY_MAP: Record<number, string> = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
};

export function getWeekdayName(date: Date): string {
  return WEEKDAY_MAP[getDay(date)];
}

export {
  addMinutes,
  addDays,
  addMonths,
  subMonths,
  startOfDay,
  startOfMonth,
  getDay,
  getDaysInMonth,
  isBefore,
  isAfter,
  isSameDay,
  isSameMonth,
  format,
};
