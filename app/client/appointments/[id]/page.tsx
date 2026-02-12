"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  Spin,
  Button,
  Tag,
  message,
  Modal,
  Input,
  Result,
  Tooltip,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CarOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EnvironmentOutlined,
  RightOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useAppointment,
  useUpdateAppointmentStatus,
  useCancelAppointment,
} from "@/hooks/useAppointments";
import { useAuth } from "@/contexts/AuthContext";

const { TextArea } = Input;

const statusConfig: Record<
  string,
  { className: string; label: string; icon: React.ReactNode }
> = {
  PENDING: {
    className: "bg-amber-100/50 text-amber-700 border border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30 dark:shadow-[0_0_10px_rgba(245,158,11,0.2)]",
    label: "Pendente",
    icon: <ExclamationCircleOutlined />,
  },
  CONFIRMED: {
    className: "bg-blue-100/50 text-blue-700 border border-blue-300 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30 dark:shadow-[0_0_10px_rgba(59,130,246,0.2)]",
    label: "Confirmado",
    icon: <CheckCircleOutlined />,
  },
  IN_PROGRESS: {
    className: "bg-indigo-100/50 text-indigo-700 border border-indigo-300 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30 dark:shadow-[0_0_10px_rgba(99,102,241,0.2)]",
    label: "Em Andamento",
    icon: <ClockCircleOutlined />,
  },
  COMPLETED: {
    className: "bg-emerald-100/50 text-emerald-700 border border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 dark:shadow-[0_0_10px_rgba(16,185,129,0.2)]",
    label: "Concluído",
    icon: <CheckCircleOutlined />,
  },
  CANCELED: {
    className: "bg-red-100/50 text-red-700 border border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30 dark:shadow-[0_0_10px_rgba(239,68,68,0.2)]",
    label: "Cancelado",
    icon: <CloseCircleOutlined />,
  },
};

// Helper to format duration
const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
        return `${hrs}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins}min`;
};

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
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
        userId: user?.id,
      });
      message.success("Agendamento cancelado");
      setCancelModalOpen(false);
      // Optional: Refresh or redirect
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

  const status = statusConfig[appointment.status] || statusConfig.PENDING;
  const scheduledDate = dayjs(appointment.scheduledAt);
  const endDate = dayjs(appointment.endTime);
  const isPast = scheduledDate.isBefore(dayjs());
  const canModify =
    !isPast &&
    appointment.status !== "COMPLETED" &&
    appointment.status !== "CANCELED";

  // Helper to format address parts preventing "undefined"
  const formatAddress = (shop: { street?: string; number?: string; neighborhood?: string; city?: string; state?: string }) => {
    const parts = [];
    if (shop.street) parts.push(shop.street);
    if (shop.number) parts.push(shop.number);
    const firstLine = parts.join(", ");
    
    const secondLineParts = [];
    if (shop.neighborhood) secondLineParts.push(shop.neighborhood);
    
    const cityParts = [];
    if (shop.city) cityParts.push(shop.city);
    if (shop.state) cityParts.push(shop.state);
    
    return {
      line1: firstLine || null,
      line2: secondLineParts.join("") || null,
      line3: cityParts.join(" - ") || null
    };
  };

  const address = appointment.shop ? formatAddress(appointment.shop) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
            <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/client/appointments")}
            className="dark:bg-zinc-800 dark:border-zinc-700"
            >
            Voltar
            </Button>
            <div>
            <h1 className="text-2xl font-bold m-0 dark:text-zinc-100">Agendamento #{appointment.id.substring(0, 6)}</h1>
            <p className="text-zinc-500 dark:text-zinc-400 m-0 text-sm">
                Criado em {dayjs(appointment.createdAt).format("DD/MM/YYYY [às] HH:mm")}
            </p>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
             <Tag icon={status.icon} className={`px-3 py-1 text-sm font-medium rounded-full border m-0 ${status.className}`}>
                {status.label}
            </Tag>
            
            {/* Action Buttons in Header */}
            {canModify && appointment.status === "PENDING" && (
                 <Button 
                    type="primary" 
                    icon={<CheckCircleOutlined />} 
                    onClick={handleConfirm}
                    loading={updateStatus.isPending}
                    className="bg-green-600 hover:bg-green-500 border-green-600 shadow-sm"
                 >
                    Confirmar Presença
                 </Button>
            )}
            {canModify && (
               <Tooltip title="Cancelar agendamento">
                <Button 
                    type="text"
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={handleCancelOpen}
                    className="hover:bg-red-50 dark:hover:bg-red-900/20 shadow-none border-0"
                >
                    Cancelar
                </Button>
               </Tooltip>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Date & Time Card */}
          <Card className="border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-cyan-100 dark:border-cyan-500/10">
                <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                  {scheduledDate.format("DD")}
                </span>
                <span className="text-xs font-bold text-cyan-500 dark:text-cyan-400 uppercase tracking-wider">
                  {scheduledDate.format("MMM")}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold m-0 text-zinc-800 dark:text-zinc-100 capitalize">
                  {scheduledDate.format("dddd")}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 m-0 mb-3">
                    {scheduledDate.format("DD [de] MMMM [de] YYYY")}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-700/50">
                  <span className="flex items-center gap-2 font-medium">
                    <ClockCircleOutlined className="text-cyan-500" />
                    {scheduledDate.format("HH:mm")} - {endDate.format("HH:mm")}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600 hidden sm:block" />
                  <span className="text-sm">
                     Duração estimada: <span className="font-semibold">{formatDuration(appointment.totalDuration)}</span>
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Shop Card */}
          <Card
            title={
              <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                <ShopOutlined className="text-cyan-500" />
                <span>Estabelecimento</span>
              </div>
            }
            className="border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm rounded-2xl"
          >
            {appointment.shop ? (
              <div className="flex items-start gap-4">
                  <div className="mt-1">
                      <EnvironmentOutlined className="text-xl text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold m-0 text-zinc-800 dark:text-zinc-100">{appointment.shop.name}</h4>
                    <div className="text-zinc-500 dark:text-zinc-400 mt-2 space-y-1">
                        {address?.line1 && <p className="m-0">{address.line1}</p>}
                        {address?.line2 && <p className="m-0">{address.line2}</p>}
                        {address?.line3 && <p className="m-0">{address.line3}</p>}
                    </div>
                  </div>
              </div>
            ) : (
              <p className="text-zinc-500 italic">Informações do estabelecimento não disponíveis</p>
            )}
          </Card>

           {/* Vehicle Card - Clickable */}
           <Link href={appointment.vehicle ? `/client/vehicles/${appointment.vehicle.id}` : '#'} className={!appointment.vehicle ? 'pointer-events-none' : ''}>
            <Card
                title={
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                    <CarOutlined className="text-cyan-500" />
                    <span>Veículo</span>
                </div>
                }
                extra={appointment.vehicle && <RightOutlined className="text-zinc-400" />}
                className="border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm rounded-2xl hover:border-cyan-300 dark:hover:border-cyan-700 transition-colors cursor-pointer group"
            >
                {appointment.vehicle ? (
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/20 transition-colors">
                      <CarOutlined className="text-3xl text-zinc-400 group-hover:text-cyan-500 transition-colors" />
                    </div>
                    <div>
                    <h4 className="font-bold text-lg m-0 text-zinc-800 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {appointment.vehicle.brand} {appointment.vehicle.model}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                        <Tag className="font-mono m-0 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                            {appointment.vehicle.plate}
                        </Tag>
                        <span className="text-zinc-400 text-sm">
                             {appointment.vehicle.color && appointment.vehicle.year ? `${appointment.vehicle.color} • ${appointment.vehicle.year}` : ''}
                        </span>
                    </div>
                    </div>
                </div>
                ) : (
                <p className="text-zinc-500 italic">Veículo não disponível</p>
                )}
            </Card>
           </Link>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-8">
            {/* Services Summary */}
            <Card
                title={
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                    <CalendarOutlined className="text-cyan-500" />
                    <span>Resumo do Serviço</span>
                </div>
                }
                className="border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm rounded-2xl"
            >
                <div className="space-y-4">
                    {appointment.services.map((service, index) => (
                        <div
                        key={index}
                        className="flex justify-between items-start pb-4 border-b border-dashed border-zinc-100 dark:border-zinc-800 last:border-0 last:pb-0"
                        >
                        <div>
                            <p className="font-medium m-0 text-zinc-700 dark:text-zinc-200">{service.serviceName}</p>
                            <p className="text-xs text-zinc-400 m-0 mt-1">{service.duration} min</p>
                        </div>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                            R$ {Number(service.servicePrice).toFixed(2)}
                        </span>
                        </div>
                    ))}
                    
                    <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-zinc-800 dark:text-zinc-100">Total Estimado</span>
                            <span className="font-bold text-green-600 dark:text-green-500">
                                R$ {Number(appointment.totalPrice).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Notes if any */}
            {appointment.notes && (
                 <Card className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/30 shadow-none rounded-2xl">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-500 mb-2 flex items-center gap-2">
                        <ExclamationCircleOutlined /> Observações
                    </h4>
                    <p className="text-yellow-700 dark:text-yellow-400/80 m-0 text-sm">
                        {appointment.notes}
                    </p>
                 </Card>
            )}
        </div>
      </div>

       <Modal
        title="Cancelar Agendamento"
        open={cancelModalOpen}
        onCancel={() => setCancelModalOpen(false)}
        onOk={handleCancelSubmit}
        okText="Confirmar Cancelamento"
        cancelText="Voltar"
        okButtonProps={{
          danger: true,
          loading: cancelAppointment.isPending,
        }}
      >
        <p className="mb-4 text-zinc-600 dark:text-zinc-300">
          Tem certeza que deseja cancelar este agendamento? Esta ação não pode
          ser desfeita e liberará o horário para outros clientes.
        </p>
        <TextArea
          placeholder="Motivo do cancelamento (opcional)"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          rows={3}
          className="dark:bg-zinc-800 dark:border-zinc-700"
        />
      </Modal>
    </div>
  );
}