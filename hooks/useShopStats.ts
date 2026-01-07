import { useAppointments } from "./useAppointments";
import dayjs from "dayjs";

/**
 * Hook para agregar estatísticas do shop
 * 
 * Calcula métricas com base nos agendamentos:
 * - Total de agendamentos hoje
 * - Agendamentos pendentes
 * - Agendamentos completos hoje
 * - Receita estimada do dia
 */
export function useShopStats(shopId: string | undefined) {
  const { data: appointments = [], isLoading } = useAppointments({ shopId }, !!shopId);

  const stats = {
    todayAppointments: 0,
    pendingAppointments: 0,
    completedToday: 0,
    todayRevenue: 0,
  };

  if (!isLoading && appointments.length > 0) {
    const today = dayjs().startOf("day");

    appointments.forEach((appointment) => {
      const appointmentDate = dayjs(appointment.scheduledAt).startOf("day");
      const isToday = appointmentDate.isSame(today);

      if (isToday) {
        stats.todayAppointments++;
        
        if (appointment.status === "COMPLETED") {
          stats.completedToday++;
          stats.todayRevenue += parseFloat(appointment.totalPrice);
        }
      }

      if (appointment.status === "PENDING" || appointment.status === "CONFIRMED") {
        stats.pendingAppointments++;
      }
    });
  }

  return {
    stats,
    isLoading,
  };
}
