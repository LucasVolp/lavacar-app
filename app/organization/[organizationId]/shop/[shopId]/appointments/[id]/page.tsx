"use client";

import React, { useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Button,
  Empty,
  Spin,
  Row,
  Col,
  message,
  Tabs,
  Tag,
  Image
} from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useAppointment, useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import { useGetChecklist } from "@/hooks/useChecklist";
import dayjs from "dayjs";
import { formatCurrency, sanitizeText } from "@/lib/security";
import { ChecklistModal } from "@/components/modals/ChecklistModal";
import { formatVehiclePlate } from "@/utils/vehiclePlate";
import { AppointmentReceipt, ReceiptData } from "@/components/shared/AppointmentReceipt";

import { AppointmentDetailHeader } from "@/components/admin/shop/appointments/details/AppointmentDetailHeader";
import { AppointmentStatusCard } from "@/components/admin/shop/appointments/details/AppointmentStatusCard";
import { AppointmentClientVehicle } from "@/components/admin/shop/appointments/details/AppointmentClientVehicle";
import { AppointmentServicesList } from "@/components/admin/shop/appointments/details/AppointmentServicesList";
import { AppointmentFinancialSummary } from "@/components/admin/shop/appointments/details/AppointmentFinancialSummary";
import { AppointmentModals } from "@/components/admin/shop/appointments/details/AppointmentModals";

export default function AppointmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { shopId, organizationId } = useShopAdmin();
  const appointmentId = params?.id as string;

  const { data: appointment, isLoading, error } = useAppointment(appointmentId);
  const { data: checklist, isLoading: isChecklistLoading } = useGetChecklist(appointmentId);
  const updateStatus = useUpdateAppointmentStatus();

  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Recibo-${appointmentId?.slice(0, 8).toUpperCase() ?? ""}`,
  });

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [checklistModalOpen, setChecklistModalOpen] = useState(false);
  const [checklistWarningVisible, setChecklistWarningVisible] = useState(false);
  const [skipChecklistWarning, setSkipChecklistWarning] = useState(false);
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

    if (isStarting && isChecklistLoading) {
      message.warning("Verificando vistoria. Tente novamente em alguns segundos.");
      return;
    }

    if (isStarting && !checklist && !skipChecklistWarning) {
      setPendingStatus(newStatus);
      setChecklistWarningVisible(true);
      return;
    }

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
      setChecklistWarningVisible(false);
      setSkipChecklistWarning(false);
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
        <Button onClick={() => router.push(`/organization/${organizationId}/shop/${shopId}/appointments`)} className="mt-4">
          Voltar para Agenda
        </Button>
      </div>
    );
  }

  const isCanceled = ["CANCELED", "NO_SHOW"].includes(appointment.status);
  const summaryServices = appointment.services.map((service) => sanitizeText(service.serviceName));
  const clientName = appointment.user
    ? sanitizeText(`${appointment.user.firstName} ${appointment.user.lastName || ""}`.trim())
    : "Cliente não identificado";

  return (
    <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6">
      <AppointmentDetailHeader 
        onBack={() => router.push(`/organization/${organizationId}/shop/${shopId}/appointments`)}
        onPrint={() => handlePrint()}
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

            <Tabs
              defaultActiveKey="service"
              items={[
                {
                  key: "service",
                  label: "Atendimento",
                  children: (
                    <div className="space-y-8 pt-2">
                      <AppointmentClientVehicle appointment={appointment} />
                      <AppointmentServicesList services={appointment.services} />

                      {appointment.notes && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <FileTextOutlined className="text-amber-600 dark:text-amber-400" />
                            <h4 className="text-amber-800 dark:text-amber-300 font-bold m-0">
                              Observações
                            </h4>
                          </div>
                          <p className="text-amber-900 dark:text-amber-200/90 m-0 leading-relaxed whitespace-pre-wrap">
                            {sanitizeText(appointment.notes)}
                          </p>
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  key: "checklist",
                  label: "Vistoria",
                  children: (
                    <div className="pt-2">
                      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 m-0">
                            Detalhes da Vistoria
                          </h3>
                          <Button onClick={() => setChecklistModalOpen(true)} className="min-h-[44px] w-full sm:w-auto">
                            {checklist ? "Ver/Editar Vistoria" : "Criar Vistoria"}
                          </Button>
                        </div>

                        {!checklist ? (
                          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 text-amber-700 dark:text-amber-300">
                            Nenhuma vistoria cadastrada para este atendimento.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">Descrição</div>
                              <p className="m-0 text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
                                {checklist.description?.trim() || "Sem descrição informada"}
                              </p>
                            </div>
                            <div>
                              <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2">Fotos</div>
                              {checklist.photos.length === 0 ? (
                                <p className="text-zinc-500 dark:text-zinc-400 m-0">Sem fotos enviadas.</p>
                              ) : (
                                <Image.PreviewGroup>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {checklist.photos.map((photo, index) => (
                                      <Image
                                        key={`${photo}-${index}`}
                                        src={photo}
                                        alt={`Foto da vistoria ${index + 1}`}
                                        className="rounded-lg border border-zinc-200 dark:border-zinc-700"
                                      />
                                    ))}
                                  </div>
                                </Image.PreviewGroup>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Tag>Criado em {dayjs(checklist.createdAt).format("DD/MM/YYYY HH:mm")}</Tag>
                              <Tag>Atualizado em {dayjs(checklist.updatedAt).format("DD/MM/YYYY HH:mm")}</Tag>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </Col>

        <Col xs={24} lg={8}>
            <AppointmentFinancialSummary 
            appointment={appointment} 
            extraSummary={
              <div className="space-y-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">
                    Serviços contratados
                  </div>
                  <ul className="m-0 pl-4 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {summaryServices.map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-3 bg-zinc-50 dark:bg-zinc-800/50">
                  <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2">
                    Dados básicos do recibo
                  </div>
                  <div className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                    <div>Recibo: #{appointment.id.slice(0, 8).toUpperCase()}</div>
                    <div>Emissão: {dayjs().format("DD/MM/YYYY HH:mm")}</div>
                    <div>Cliente: {clientName}</div>
                    <div>Placa: {formatVehiclePlate(appointment.vehicle?.plate) || "-"}</div>
                    <div>Total: {formatCurrency(appointment.totalPrice)}</div>
                  </div>
                </div>
              </div>
            }
            onPrint={() => handlePrint()}
            />
        </Col>
      </Row>

      <div style={{ display: "none" }}>
        <AppointmentReceipt
          ref={receiptRef}
          data={{
            id: appointment.id,
            scheduledAt: appointment.scheduledAt,
            endTime: appointment.endTime,
            totalPrice: appointment.totalPrice,
            totalDuration: appointment.totalDuration,
            notes: appointment.notes,
            shop: {
              name: appointment.shop?.name ?? "",
              logoUrl: appointment.shop?.logoUrl ?? undefined,
              phone: appointment.shop?.phone,
              street: appointment.shop?.street,
              number: appointment.shop?.number,
              neighborhood: appointment.shop?.neighborhood,
              city: appointment.shop?.city,
              state: appointment.shop?.state,
            },
            vehicle: appointment.vehicle
              ? {
                  brand: appointment.vehicle.brand,
                  model: appointment.vehicle.model,
                  plate: appointment.vehicle.plate ?? undefined,
                  color: appointment.vehicle.color ?? undefined,
                }
              : undefined,
            services: appointment.services,
            clientName: clientName,
          } satisfies ReceiptData}
        />
      </div>

      <AppointmentModals
        cancelVisible={cancelModalVisible}
        confirmVisible={statusConfirmVisible}
        checklistWarningVisible={checklistWarningVisible}
        onCancelClose={() => {
            setCancelModalVisible(false);
            setCancelReason("");
        }}
        onConfirmClose={() => {
            setStatusConfirmVisible(false);
            setPendingStatus(null);
        }}
        onChecklistWarningClose={() => {
            setChecklistWarningVisible(false);
            setPendingStatus(null);
        }}
        onOpenChecklist={() => {
          setChecklistWarningVisible(false);
          setChecklistModalOpen(true);
        }}
        onChecklistProceed={() => {
          setSkipChecklistWarning(true);
          if (pendingStatus) {
            handleStatusChange(pendingStatus);
          }
        }}
        onCancelConfirm={() => handleStatusChange("CANCELED", cancelReason)}
        onStatusConfirm={confirmFutureStatusChange}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        loading={updateStatus.isPending}
        nextStatusLabel={pendingStatus ? statusLabels[pendingStatus] : ""}
        appointmentDate={dayjs(appointment.scheduledAt).format("DD/MM/YYYY")}
      />

      <ChecklistModal
        appointmentId={appointment.id}
        open={checklistModalOpen}
        onClose={() => setChecklistModalOpen(false)}
        readOnly={!!checklist}
      />
    </div>
  );
}
