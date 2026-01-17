export type Weekday = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export interface ScheduleFormData {
  isOpen: boolean;
  startTime: Date | null;
  endTime: Date | null;
  hasBreak: boolean;
  breakStartTime: Date | null;
  breakEndTime: Date | null;
}

export const WEEKDAYS: { key: Weekday; label: string; short: string }[] = [
  { key: "MONDAY", label: "Segunda-feira", short: "Seg" },
  { key: "TUESDAY", label: "Terça-feira", short: "Ter" },
  { key: "WEDNESDAY", label: "Quarta-feira", short: "Qua" },
  { key: "THURSDAY", label: "Quinta-feira", short: "Qui" },
  { key: "FRIDAY", label: "Sexta-feira", short: "Sex" },
  { key: "SATURDAY", label: "Sábado", short: "Sáb" },
  { key: "SUNDAY", label: "Domingo", short: "Dom" },
];