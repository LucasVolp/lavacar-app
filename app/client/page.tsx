"use client";

import React, { useMemo, useState } from "react";
import { Spin, Modal, message, Button } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useUserVehicles } from "@/hooks/useVehicles";
import {
  useAppointments,
  useUpdateAppointmentStatus,
  useCancelAppointment,
} from "@/hooks/useAppointments";
import { useUserEvaluations } from "@/hooks/useEvaluations";
import {
  DashboardHeader,
  QuickStatsWidget,
  LatestReviewsWidget,
} from "@/components/client/dashboard";
import { UpcomingAppointmentsList } from "@/components/client/UpcomingAppointmentsList";
import { VehicleCard } from "@/components/client/VehicleCard";
import { PlusOutlined, CarOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Link from "next/link";
import type { Appointment } from "@/types/appointment";
import type { EvaluationWithRelations } from "@/types/evaluation";

export default function ClientDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const { data: vehicles = [], isLoading: vehiclesLoading } = useUserVehicles(
    user?.id || null,
    !!user?.id
  );

  const { data: appointmentsData, isLoading: appointmentsLoading } = useAppointments(
    { userId: user?.id, perPage: 100 },
    !!user?.id,
    { refetchInterval: 60000 }
  );

  const { data: evaluationsData, isLoading: evaluationsLoading } = useUserEvaluations(
    user?.id || null,
    { perPage: 50 },
    !!user?.id
  );

  const updateStatus = useUpdateAppointmentStatus();
  const cancelAppointment = useCancelAppointment();

  const allAppointments = useMemo((): Appointment[] => {
    return appointmentsData?.data ?? [];
  }, [appointmentsData]);

  const upcomingAppointments = useMemo(() => {
    return allAppointments
      .filter((a) => ["PENDING", "CONFIRMED", "WAITING", "IN_PROGRESS"].includes(a.status))
      .filter((a) => dayjs(a.scheduledAt).isAfter(dayjs().subtract(2, "hour")))
      .sort((a, b) => dayjs(a.scheduledAt).valueOf() - dayjs(b.scheduledAt).valueOf());
  }, [allAppointments]);

  const lastShopInfo = useMemo(() => {
    const completedApps = allAppointments
      .filter((a) => a.status === "COMPLETED")
      .sort((a, b) => dayjs(b.scheduledAt).valueOf() - dayjs(a.scheduledAt).valueOf());

    if (completedApps.length === 0 || !completedApps[0].shop) return null;
    
    return {
      name: completedApps[0].shop.name,
      slug: completedApps[0].shop.slug
    };
  }, [allAppointments]);

  const evaluationsList = useMemo(() => {
    const evals: EvaluationWithRelations[] = evaluationsData?.data ?? [];
    return evals.slice(0, 3).map((e) => ({
      id: e.id,
      rating: e.rating,
      comment: e.comment,
      createdAt: e.createdAt,
      shopName: e.appointment?.shop?.name,
      serviceName: e.appointment?.services?.map((s) => s.serviceName).join(", "),
    }));
  }, [evaluationsData]);

  const stats = useMemo(() => {
    const totalVisits = allAppointments.filter((a) => a.status === "COMPLETED").length;

    const currentMonth = dayjs().month();
    const currentYear = dayjs().year();
    const monthlySpending = allAppointments
      .filter(
        (a) =>
          a.status === "COMPLETED" &&
          dayjs(a.scheduledAt).month() === currentMonth &&
          dayjs(a.scheduledAt).year() === currentYear
      )
      .reduce((sum, app) => sum + (parseFloat(app.totalPrice) || 0), 0);

    const evals: EvaluationWithRelations[] = evaluationsData?.data ?? [];
    const avgRating =
      evals.length > 0 ? evals.reduce((sum, e) => sum + e.rating, 0) / evals.length : 0;

    return { totalVisits, monthlySpending, avgRating };
  }, [allAppointments, evaluationsData]);

  const vehiclesNormalized = useMemo(() => {
    return vehicles.map((v) => ({
      id: v.id,
      plate: v.plate,
      brand: v.brand ?? "Veículo",
      model: v.model ?? "Não informado",
      color: v.color || "-",
      year: v.year || 0,
    }));
  }, [vehicles]);

  const handleConfirm = (id: string) => {
    updateStatus.mutate(
      { id, status: "CONFIRMED" },
      {
        onSuccess: () => message.success("Presença confirmada!"),
        onError: () => message.error("Erro ao confirmar presença"),
      }
    );
  };

  const handleCancelClick = (id: string) => {
    setSelectedAppointmentId(id);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = () => {
    if (!selectedAppointmentId) return;
    cancelAppointment.mutate(
      { id: selectedAppointmentId },
      {
        onSuccess: () => {
          message.success("Agendamento cancelado");
          setCancelModalOpen(false);
          setSelectedAppointmentId(null);
        },
        onError: () => message.error("Erro ao cancelar agendamento"),
      }
    );
  };

  const handleAppointmentClick = (id: string) => {
    router.push(`/client/appointments/${id}`);
  };

  if (!user) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Spin size="large" />
        <span className="mt-4 text-slate-500 dark:text-slate-400">Preparando sua área...</span>
      </div>
    );
  }

  if (vehiclesLoading || appointmentsLoading || evaluationsLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Spin size="large" />
        <span className="mt-4 text-slate-500 dark:text-slate-400">Carregando informações...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-in pb-10">
      <DashboardHeader userName={user.firstName} lastShopInfo={lastShopInfo} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <UpcomingAppointmentsList
            appointments={upcomingAppointments}
            onConfirm={handleConfirm}
            onCancel={handleCancelClick}
            onClick={handleAppointmentClick}
            isConfirming={updateStatus.isPending}
            lastShopInfo={lastShopInfo}
            maxItems={4}
          />
        </div>

        <div>
          <QuickStatsWidget
            totalVisits={stats.totalVisits}
            monthlySpending={stats.monthlySpending}
            avgRating={stats.avgRating}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm transition-colors overflow-hidden h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CarOutlined className="text-emerald-600 dark:text-emerald-400 text-sm" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 m-0">
                  Meus Veículos
                </h3>
              </div>
              <Link href="/client/vehicles">
                <Button
                  type="text"
                  size="small"
                  className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-medium text-xs h-7 px-2"
                >
                  Ver todos <RightOutlined className="text-[10px]" />
                </Button>
              </Link>
            </div>

            <div className="p-4">
              {vehiclesNormalized.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <CarOutlined className="text-xl text-zinc-400" />
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-3">
                    Nenhum veículo cadastrado
                  </p>
                  <Link href="/client/vehicles">
                    <Button icon={<PlusOutlined />} size="small" className="rounded-lg text-xs h-7">
                      Adicionar
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehiclesNormalized.slice(0, 4).map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <LatestReviewsWidget evaluations={evaluationsList} />
        </div>
      </div>

      <Modal
        title="Cancelar agendamento"
        open={cancelModalOpen}
        onOk={handleCancelConfirm}
        onCancel={() => setCancelModalOpen(false)}
        okText="Sim, cancelar"
        cancelText="Voltar"
        okButtonProps={{ danger: true, loading: cancelAppointment.isPending }}
      >
        <p className="text-slate-600 dark:text-slate-300">
          Tem certeza que deseja cancelar este agendamento?
        </p>
      </Modal>
    </div>
  );
}
