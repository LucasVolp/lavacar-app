import { useAppointments } from "./useAppointments";
import { Appointment } from "@/types/appointment";
import dayjs from "dayjs";

export function useShopStats(shopId: string | undefined) {
  const { data: appointmentsData, isLoading } = useAppointments({ shopId, perPage: 500 }, !!shopId);
  
  const appointments: Appointment[] = appointmentsData?.data ?? [];

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
