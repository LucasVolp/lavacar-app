import dayjs from "dayjs";
import type { Shop } from "@/types/shop";

export const formatDuration = (minutes: number) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs <= 0) {
    return `${mins}min`;
  }

  if (mins === 0) {
    return `${hrs}h`;
  }

  return `${hrs}:${String(mins).padStart(2, "0")}h`;
};

export const formatAddress = (shop?: Partial<Shop>) => {
  if (!shop) {
    return { line1: null, line2: null, line3: null };
  }

  const line1 = [shop.street, shop.number].filter(Boolean).join(", ") || null;
  const line2 = shop.neighborhood || null;
  const line3 = [shop.city, shop.state].filter(Boolean).join(" - ") || null;

  return { line1, line2, line3 };
};

export const formatCurrency = (value: number) => `R$ ${value.toFixed(2)}`;

export const formatReceiptNumber = (appointmentId: string) =>
  appointmentId.replace(/-/g, "").slice(0, 10).toUpperCase();

export const formatDateTime = (date: string) => dayjs(date).format("DD/MM/YYYY [às] HH:mm");
