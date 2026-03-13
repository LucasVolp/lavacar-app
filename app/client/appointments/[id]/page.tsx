"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Result, Spin, message } from "antd";
import dayjs from "dayjs";
import {
  useAppointment,
  useCancelAppointment,
  useUpdateAppointmentStatus,
} from "@/hooks/useAppointments";
import { useAuth } from "@/contexts/AuthContext";
import {
  AppointmentCancelModal,
  AppointmentDateTimeCard,
  AppointmentDetailHeader,
  AppointmentEstablishmentCard,
  AppointmentNotesCard,
  AppointmentServiceReceiptCard,
  AppointmentVehicleCard,
} from "@/components/client/appointment-details";

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  useAuth();
  const appointmentId = params.id as string;

  const {
    data: appointment,
    isLoading,
    error,
  } = useAppointment(appointmentId, !!appointmentId);
  const updateStatus = useUpdateAppointmentStatus();
  const cancelAppointment = useCancelAppointment();

  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState("");

  const handleConfirm = async () => {
    try {
      await updateStatus.mutateAsync({
        id: appointmentId,
        status: "CONFIRMED",
      });
      message.success("Agendamento confirmado com sucesso!");
    } catch {
      message.error("Erro ao confirmar agendamento");
    }
  };

  const handleCancelOpen = () => {
    setCancelReason("");
    setCancelModalOpen(true);
  };

  const handleCancelSubmit = async () => {
    try {
      await cancelAppointment.mutateAsync({
        id: appointmentId,
        reason: cancelReason,
      });
      message.success("Agendamento cancelado");
      setCancelModalOpen(false);
    } catch {
      message.error("Erro ao cancelar agendamento");
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <Result
          status="404"
          title="Agendamento não encontrado"
          subTitle="O agendamento que você está procurando não existe ou foi removido."
          extra={
            <Button type="primary" onClick={() => router.push("/client/appointments")}>
              Voltar para Agendamentos
            </Button>
          }
        />
      </div>
    );
  }

  const isPast = dayjs(appointment.scheduledAt).isBefore(dayjs());
  const canModify =
    !isPast &&
    appointment.status !== "COMPLETED" &&
    appointment.status !== "CANCELED";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <AppointmentDetailHeader
        appointment={appointment}
        canModify={canModify}
        confirmLoading={updateStatus.isPending}
        onBack={() => router.push("/client/appointments")}
        onConfirm={handleConfirm}
        onCancel={handleCancelOpen}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <AppointmentDateTimeCard appointment={appointment} />
          <AppointmentEstablishmentCard shop={appointment.shop} />
          <AppointmentVehicleCard vehicle={appointment.vehicle} />
        </div>

        <div className="flex flex-col gap-8">
          <AppointmentServiceReceiptCard appointment={appointment} />
          {appointment.notes && <AppointmentNotesCard notes={appointment.notes} />}
        </div>
      </div>

      <AppointmentCancelModal
        open={cancelModalOpen}
        reason={cancelReason}
        loading={cancelAppointment.isPending}
        onReasonChange={setCancelReason}
        onCancel={() => setCancelModalOpen(false)}
        onConfirm={handleCancelSubmit}
      />
    </div>
  );
}
