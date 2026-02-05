"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Button, 
  Empty, 
  Spin, 
  Row, 
  Col, 
  message,
} from "antd";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useAppointment, useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import dayjs from "dayjs";

// Components
import { AppointmentDetailHeader } from "@/components/admin/shop/appointments/details/AppointmentDetailHeader";
import { AppointmentStatusCard } from "@/components/admin/shop/appointments/details/AppointmentStatusCard";
import { AppointmentClientVehicle } from "@/components/admin/shop/appointments/details/AppointmentClientVehicle";
import { AppointmentServicesList } from "@/components/admin/shop/appointments/details/AppointmentServicesList";
import { AppointmentFinancialSummary } from "@/components/admin/shop/appointments/details/AppointmentFinancialSummary";
import { AppointmentModals } from "@/components/admin/shop/appointments/details/AppointmentModals";

export default function AppointmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { shopId } = useShopAdmin();
  const appointmentId = params?.id as string;

  const { data: appointment, isLoading, error } = useAppointment(appointmentId);
  const updateStatus = useUpdateAppointmentStatus();

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  
  const [statusConfirmVisible, setStatusConfirmVisible] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const statusLabels: Record<string, string> = {
    PENDING: "Pendente",
    CONFIRMED: "Confirmado",
    WAITING: "Aguardando",
    IN_PROGRESS: "Em Andamento",
    COMPLETED: "Concluído",
    CANCELED: "Cancelado",
    NO_SHOW: "Não Compareceu",
  };

  const handleStatusChange = async (newStatus: string, reason?: string) => {
    const isFuture = dayjs(appointment?.scheduledAt).isAfter(dayjs());
    const isFinishing = newStatus === 'COMPLETED';
    const isStarting = newStatus === 'IN_PROGRESS';

    if (isFuture && (isFinishing || isStarting) && !statusConfirmVisible && !reason) {
        setPendingStatus(newStatus);
        setStatusConfirmVisible(true);
        return;
    }

    try {
      await updateStatus.mutateAsync({
        id: appointmentId,
        status: newStatus,
        cancellationReason: reason,
      });
      message.success("Status atualizado com sucesso!");
      setCancelModalVisible(false);
      setStatusConfirmVisible(false);
      setCancelReason("");
      setPendingStatus(null);
    } catch {
      message.error("Erro ao atualizar status. Tente novamente.");
    }
  };

  const confirmFutureStatusChange = () => {
      if (pendingStatus) {
          handleStatusChange(pendingStatus);
      }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando detalhes..." />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Empty description="Agendamento não encontrado" />
        <Button onClick={() => router.push(`/admin/shop/${shopId}/appointments`)} className="mt-4">
          Voltar para Agenda
        </Button>
      </div>
    );
  }

  const isCanceled = ["CANCELED", "NO_SHOW"].includes(appointment.status);

  return (
    <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6">
      <AppointmentDetailHeader 
        onBack={() => router.push(`/admin/shop/${shopId}/appointments`)}
        onPrint={() => message.info("Funcionalidade de impressão em desenvolvimento")}
        onCancel={() => setCancelModalVisible(true)}
        isCanceled={isCanceled}
      />

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={16}>
          <div className="space-y-8">
            <AppointmentStatusCard 
              appointment={appointment} 
              onNextStatus={handleStatusChange}
              loading={updateStatus.isPending}
            />
                <AppointmentClientVehicle appointment={appointment} />

                <AppointmentServicesList services={appointment.services} />


            {/* Observations Card (can be componentized if reused, but simple enough here) */}
            {appointment.notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <h4 className="text-amber-800 font-bold mb-2">Observações</h4>
                    <p className="text-amber-900 m-0 leading-relaxed">{appointment.notes}</p>
                </div>
            )}
          </div>
        </Col>

        <Col xs={24} lg={8}>
            <AppointmentFinancialSummary 
            appointment={appointment} 
            onPrint={() => message.info("Funcionalidade de impressão em desenvolvimento")}
            />
        </Col>
      </Row>

      <AppointmentModals 
        cancelVisible={cancelModalVisible}
        confirmVisible={statusConfirmVisible}
        onCancelClose={() => {
            setCancelModalVisible(false);
            setCancelReason("");
        }}
        onConfirmClose={() => {
            setStatusConfirmVisible(false);
            setPendingStatus(null);
        }}
        onCancelConfirm={() => handleStatusChange("CANCELED", cancelReason)}
        onStatusConfirm={confirmFutureStatusChange}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        loading={updateStatus.isPending}
        nextStatusLabel={pendingStatus ? statusLabels[pendingStatus] : ""}
        appointmentDate={dayjs(appointment.scheduledAt).format("DD/MM/YYYY")}
      />
    </div>
  );
}