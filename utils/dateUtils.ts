/**
 * Utilitários de data/hora com suporte a timezone explícito
 * Usando date-fns e date-fns-tz para garantir consistência entre frontend e backend
 */

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

// Timezone padrão do sistema (deve ser o mesmo do shop/backend)
export const DEFAULT_TIMEZONE = 'America/Sao_Paulo';

/**
 * Obtém a data/hora atual no timezone especificado
 */
export function nowInTimezone(timeZone: string = DEFAULT_TIMEZONE): Date {
  return toZonedTime(new Date(), timeZone);
}

/**
 * Cria uma data no timezone específico a partir de ano/mês/dia
 */
export function createDateInTimezone(
  year: number,
  month: number, // 0-indexed (0 = Janeiro)
  day: number,
  hour: number = 0,
  minute: number = 0,
  timeZone: string = DEFAULT_TIMEZONE
): Date {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
  // Parse como local e converte para o timezone
  const localDate = new Date(dateStr);
  return toZonedTime(localDate, timeZone);
}

/**
 * Formata uma data no timezone especificado
 */
export function formatDateInTimezone(
  date: Date,
  formatStr: string,
  timeZone: string = DEFAULT_TIMEZONE
): string {
  return formatInTimeZone(date, timeZone, formatStr, { locale: ptBR });
}

/**
 * Formata data para exibição no calendário (DD/MM/YYYY)
 */
export function formatDisplayDate(date: Date, timeZone: string = DEFAULT_TIMEZONE): string {
  return formatInTimeZone(date, timeZone, 'dd/MM/yyyy', { locale: ptBR });
}

/**
 * Formata para exibição do mês (MMMM YYYY)
 */
export function formatMonthYear(date: Date, timeZone: string = DEFAULT_TIMEZONE): string {
  return formatInTimeZone(date, timeZone, 'MMMM yyyy', { locale: ptBR });
}

/**
 * Formata para exibição do dia com mês (DD de MMMM)
 */
export function formatDayMonth(date: Date, timeZone: string = DEFAULT_TIMEZONE): string {
  return formatInTimeZone(date, timeZone, "dd 'de' MMMM", { locale: ptBR });
}

/**
 * Extrai hora HH:mm de uma Date
 */
export function extractTime(date: Date, timeZone: string = DEFAULT_TIMEZONE): string {
  return formatInTimeZone(date, timeZone, 'HH:mm');
}

/**
 * Converte string HH:mm para minutos desde meia-noite
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Converte minutos desde meia-noite para string HH:mm
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Cria uma Date com hora específica a partir de uma data base
 * A data resultante, quando convertida para ISO, será interpretada
 * corretamente no timezone America/Sao_Paulo pelo backend
 */
export function setTimeOnDate(date: Date, timeStr: string, timeZone: string = DEFAULT_TIMEZONE): Date {
  const [hour, minute] = timeStr.split(':').map(Number);
  const year = getYear(date);
  const month = getMonth(date);
  const day = getDate(date);
  
  // Cria uma string ISO representando o horário desejado no timezone da loja
  // e converte para UTC (que é o que toISOString() retorna)
  const dateTimeStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
  
  // fromZonedTime converte uma data "como se estivesse" no timezone especificado para UTC
  return fromZonedTime(dateTimeStr, timeZone);
}

/**
 * Mapeia índice do dia da semana (0-6) para nome em inglês maiúsculo
 */
export const WEEKDAY_MAP: Record<number, string> = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
};

/**
 * Obtém o dia da semana de uma data
 */
export function getWeekdayName(date: Date): string {
  return WEEKDAY_MAP[getDay(date)];
}

// Re-exports úteis de date-fns para não precisar importar de dois lugares
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
