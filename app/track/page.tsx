"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button, Card, Modal, Input, message } from "antd";
import { PrinterOutlined, FileTextOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import { authService, TrackingAppointment } from "@/services/auth";
import { appointmentService } from "@/services/appointment";
import {
  TrackingStatusBanner,
  TrackingAppointmentDetails,
  TrackingShopInfo,
  TrackingLoading,
  TrackingError,
} from "@/components/track";
import { AppointmentReceipt, ReceiptData } from "@/components/shared/AppointmentReceipt";

const { TextArea } = Input;

function buildReceiptData(appointment: TrackingAppointment): ReceiptData {
  return {
    id: appointment.id,
    scheduledAt: appointment.scheduledAt,
    endTime: appointment.endTime,
    totalPrice: appointment.totalPrice,
    totalDuration: appointment.totalDuration,
    notes: appointment.notes,
    shop: {
      name: appointment.shop.name,
      logoUrl: appointment.shop.logoUrl,
      phone: appointment.shop.phone,
      street: appointment.shop.street,
      number: appointment.shop.number,
      neighborhood: appointment.shop.neighborhood,
      city: appointment.shop.city,
      state: appointment.shop.state,
    },
    vehicle: appointment.vehicle,
    services: appointment.services,
  };
}

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
  const action = searchParams.get("action");
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
  const autoConfirmedRef = useRef(false);

  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Comprovante-${appointment?.id?.slice(0, 8).toUpperCase() ?? ""}`,
  });

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

  useEffect(() => {
    if (action !== "confirm" || !token || !appointment || autoConfirmedRef.current) return;
    if (appointment.status !== "PENDING") return;
    autoConfirmedRef.current = true;
    appointmentService
      .confirmByTracking(token)
      .then(() => {
        message.success("Agendamento confirmado!");
        fetchAppointment(token);
      })
      .catch(() => message.error("Erro ao confirmar agendamento."));
  }, [action, token, appointment, fetchAppointment]);

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

  const isCompleted = ["COMPLETED"].includes(appointment.status);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] p-4 sm:p-6">
      <div className="w-full max-w-2xl mx-auto">
        {appointment.shop?.logoUrl && (
          <div className="flex justify-center mb-6 sm:mb-8">
            <Image
              src={appointment.shop.logoUrl}
              alt={appointment.shop.name}
              width={64}
              height={64}
              className="rounded-2xl object-cover shadow-md"
              priority
            />
          </div>
        )}

        <div className="space-y-6">
          {/* Status + Details */}
          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-[#18181b]">
            <div className="mb-6">
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

          {/* Notes/Observations */}
          {appointment.notes && (
            <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white dark:bg-[#18181b]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                  <FileTextOutlined className="text-amber-600 dark:text-amber-400 text-sm" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider m-0">
                  Observações
                </p>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap m-0">
                {appointment.notes}
              </p>
            </Card>
          )}

          {/* Receipt / Print */}
          {isCompleted && (
            <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white dark:bg-[#18181b]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                    <PrinterOutlined className="text-emerald-600 dark:text-emerald-400 text-sm" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider m-0">
                    Comprovante
                  </p>
                </div>
                <Button
                  icon={<PrinterOutlined />}
                  onClick={() => handlePrint()}
                  className="rounded-xl font-medium"
                >
                  Imprimir / Salvar PDF
                </Button>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Recibo nº</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    #{appointment.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Serviços</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {appointment.services.length}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-zinc-700 pt-2 mt-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Total</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    R$ {parseFloat(appointment.totalPrice).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {appointment.shop && <TrackingShopInfo shop={appointment.shop} />}
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8 px-4">
          Este link é pessoal e válido por 30 dias.
        </p>
      </div>

      {/* Hidden printable receipt */}
      <div style={{ display: "none" }}>
        <AppointmentReceipt ref={receiptRef} data={buildReceiptData(appointment)} />
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
