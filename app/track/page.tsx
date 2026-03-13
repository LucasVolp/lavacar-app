"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, Modal, Input, message } from "antd";
import { authService, TrackingAppointment } from "@/services/auth";
import { appointmentService } from "@/services/appointment";
import {
  TrackingStatusBanner,
  TrackingAppointmentDetails,
  TrackingShopInfo,
  TrackingLoading,
  TrackingError,
} from "@/components/track";

const { TextArea } = Input;

export default function TrackPage() {
  return (
    <Suspense fallback={<TrackingLoading />}>
      <TrackPageContent />
    </Suspense>
  );
}

function TrackPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const hasToken = !!token;

  const [appointment, setAppointment] = useState<TrackingAppointment | null>(null);
  const [loading, setLoading] = useState(hasToken);
  const [error, setError] = useState<string | null>(
    hasToken ? null : "Link inválido. Nenhum token fornecido."
  );
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const fetchAppointment = useCallback(async (trackingToken: string) => {
    try {
      const data = await authService.validateTrackingToken(trackingToken);
      setAppointment(data);
      setError(null);
    } catch {
      setError("Link expirado ou inválido. Solicite um novo link.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchAppointment(token);
  }, [token, fetchAppointment]);

  const handleRefresh = useCallback(() => {
    if (!token) return;
    setLoading(true);
    fetchAppointment(token);
  }, [token, fetchAppointment]);

  const handleConfirm = useCallback(async () => {
    if (!token) return;
    setConfirmLoading(true);
    try {
      await appointmentService.confirmByTracking(token);
      message.success("Agendamento confirmado!");
      handleRefresh();
    } catch {
      message.error("Erro ao confirmar agendamento.");
    } finally {
      setConfirmLoading(false);
    }
  }, [token, handleRefresh]);

  const handleCancelSubmit = useCallback(async () => {
    if (!token) return;
    setCancelLoading(true);
    try {
      await appointmentService.cancelByTracking(token, cancelReason || undefined);
      message.success("Agendamento cancelado.");
      setCancelModalOpen(false);
      setCancelReason("");
      handleRefresh();
    } catch {
      message.error("Erro ao cancelar agendamento.");
    } finally {
      setCancelLoading(false);
    }
  }, [token, cancelReason, handleRefresh]);

  const openCancelModal = useCallback(() => setCancelModalOpen(true), []);
  const closeCancelModal = useCallback(() => setCancelModalOpen(false), []);

  if (loading) return <TrackingLoading />;
  if (error || !appointment) return <TrackingError message={error || undefined} />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] p-4 sm:p-6">
      <div className="w-full max-w-2xl mx-auto">
        {appointment.shop?.logoUrl && (
          <div className="flex justify-center mb-4 sm:mb-6">
            <Image
              src={appointment.shop.logoUrl}
              alt={appointment.shop.name}
              width={56}
              height={56}
              className="rounded-xl object-cover"
              priority
            />
          </div>
        )}

        <div className="space-y-4">
          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-[#18181b]">
            <div className="mb-4 sm:mb-6">
              <TrackingStatusBanner
                status={appointment.status}
                onRefresh={handleRefresh}
                onConfirm={handleConfirm}
                onCancel={openCancelModal}
                confirmLoading={confirmLoading}
                cancelLoading={cancelLoading}
              />
            </div>
            <TrackingAppointmentDetails appointment={appointment} />
          </Card>

          {appointment.shop && <TrackingShopInfo shop={appointment.shop} />}
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6 px-4">
          Este link é pessoal e válido por 30 dias.
        </p>
      </div>

      <Modal
        title="Cancelar Agendamento"
        open={cancelModalOpen}
        onCancel={closeCancelModal}
        onOk={handleCancelSubmit}
        okText="Confirmar Cancelamento"
        cancelText="Voltar"
        okButtonProps={{ danger: true, loading: cancelLoading }}
        destroyOnClose
      >
        <p className="mb-4 text-zinc-600 dark:text-zinc-300 text-sm sm:text-base">
          Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
        </p>
        <TextArea
          placeholder="Motivo do cancelamento (opcional)"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          rows={3}
          className="text-base"
        />
      </Modal>
    </div>
  );
}
