"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button, Card, Modal, Input, message } from "antd";
import { PrinterOutlined, FileTextOutlined, CarOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import { authService, TrackingAppointment } from "@/services/auth";
import { appointmentService } from "@/services/appointment";
import {
  TrackingProgressTracker,
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
  const serviceNames = appointment.services.map((service) => service.serviceName);
  const vehiclePlate = appointment.vehicle.plate || "Sem placa informada";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto w-full max-w-2xl">
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
          <Card className="border-none shadow-2xl rounded-[28px] overflow-hidden bg-white dark:bg-[#18181b]">
            <div className="rounded-[24px] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-5 text-white shadow-2xl shadow-slate-950/20 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-300/80">
                    Resumo do agendamento
                  </p>
                  <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                    {appointment.vehicle.brand} {appointment.vehicle.model}
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200/80">
                    Acompanhe o progresso, a placa do veículo e os serviços contratados em uma visão rápida.
                  </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10 backdrop-blur">
                  <CarOutlined className="text-2xl text-white" />
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10 backdrop-blur">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-300/80">
                    Placa
                  </p>
                  <p className="mt-1 text-lg font-black tracking-[0.16em] text-white">
                    {vehiclePlate}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10 backdrop-blur">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-300/80">
                    Serviços
                  </p>
                  <p className="mt-1 text-lg font-black text-white">{appointment.services.length} contratado(s)</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {serviceNames.slice(0, 4).map((serviceName) => (
                  <span
                    key={serviceName}
                    className="inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white ring-1 ring-white/10"
                  >
                    {serviceName}
                  </span>
                ))}
                {serviceNames.length > 4 && (
                  <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white ring-1 ring-white/10">
                    +{serviceNames.length - 4}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <TrackingProgressTracker status={appointment.status} />
            </div>

            {appointment.status === "PENDING" && (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Button
                  type="primary"
                  onClick={handleConfirm}
                  loading={confirmLoading}
                  className="min-h-[44px] rounded-xl border-none bg-indigo-600 font-semibold shadow-none hover:!bg-indigo-700"
                >
                  Confirmar
                </Button>
                <Button
                  onClick={openCancelModal}
                  loading={cancelLoading}
                  danger
                  className="min-h-[44px] rounded-xl font-semibold"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleRefresh}
                  className="min-h-[44px] rounded-xl font-semibold"
                >
                  Atualizar
                </Button>
              </div>
            )}
          </Card>

          <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white dark:bg-[#18181b]">
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                    <PrinterOutlined className="text-emerald-600 dark:text-emerald-400 text-sm" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider m-0">
                    Comprovante
                  </p>
                </div>
                <Button
                  icon={<PrinterOutlined />}
                  onClick={() => handlePrint()}
                  className="rounded-xl font-medium w-full sm:w-auto min-h-[44px]"
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
        destroyOnHidden
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
