"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Card, 
  Descriptions, 
  Tag, 
  Button, 
  Empty, 
  Spin, 
  Typography, 
  Row, 
  Col, 
  Divider,
  Space,
  Modal,
  Input,
  message,
  Steps,
  Tooltip,
} from "antd";
import { 
  LeftOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  DollarOutlined, 
  UserOutlined, 
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  PrinterOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useAppointment, useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

/**
 * Detalhes do Agendamento - Interface profissional
 */
export default function AppointmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { shopId } = useShopAdmin();
  const appointmentId = params?.id as string;

  const { data: appointment, isLoading, error } = useAppointment(appointmentId);
  const updateStatus = useUpdateAppointmentStatus();

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
    PENDING: { color: "orange", label: "Pendente", icon: <ClockCircleOutlined /> },
    CONFIRMED: { color: "blue", label: "Confirmado", icon: <CheckCircleOutlined /> },
    WAITING: { color: "cyan", label: "Aguardando", icon: <ClockCircleOutlined /> },
    IN_PROGRESS: { color: "purple", label: "Em Andamento", icon: <CarOutlined /> },
    COMPLETED: { color: "green", label: "Concluído", icon: <CheckCircleOutlined /> },
    CANCELED: { color: "red", label: "Cancelado", icon: <CloseCircleOutlined /> },
    NO_SHOW: { color: "default", label: "Não Compareceu", icon: <ExclamationCircleOutlined /> },
  };

  // Ordem dos status para o stepper
  const statusOrder = ["PENDING", "CONFIRMED", "WAITING", "IN_PROGRESS", "COMPLETED"];

  const handleStatusChange = async (newStatus: string, reason?: string) => {
    try {
      await updateStatus.mutateAsync({
        id: appointmentId,
        status: newStatus,
        cancellationReason: reason,
      });
      message.success("Status atualizado com sucesso!");
      setCancelModalVisible(false);
      setCancelReason("");
    } catch {
      message.error("Erro ao atualizar status. Tente novamente.");
    }
  };

  const getStatusActions = () => {
    if (!appointment) return [];
    const items: { key: string; label: string; icon: React.ReactNode; type: "primary" | "default" | "dashed"; danger?: boolean }[] = [];
    
    if (appointment.status === "PENDING") {
      items.push({ key: "CONFIRMED", label: "Confirmar", icon: <CheckCircleOutlined />, type: "primary" });
    }
    if (["PENDING", "CONFIRMED"].includes(appointment.status)) {
      items.push({ key: "WAITING", label: "Cliente Chegou", icon: <UserOutlined />, type: "default" });
    }
    if (["CONFIRMED", "WAITING"].includes(appointment.status)) {
      items.push({ key: "IN_PROGRESS", label: "Iniciar Atendimento", icon: <PlayCircleOutlined />, type: "primary" });
    }
    if (appointment.status === "IN_PROGRESS") {
      items.push({ key: "COMPLETED", label: "Finalizar", icon: <CheckCircleOutlined />, type: "primary" });
    }
    if (!["COMPLETED", "CANCELED", "NO_SHOW"].includes(appointment.status)) {
      items.push({ key: "CANCEL", label: "Cancelar", icon: <CloseCircleOutlined />, type: "default", danger: true });
      items.push({ key: "NO_SHOW", label: "Não Compareceu", icon: <StopOutlined />, type: "dashed", danger: true });
    }

    return items;
  };

  const currentStep = appointment 
    ? statusOrder.indexOf(appointment.status)
    : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando agendamento..." />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <Card>
        <Empty
          description="Agendamento não encontrado"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button 
            type="primary" 
            onClick={() => router.push(`/admin/shop/${shopId}/appointments`)}
          >
            Voltar para Lista
          </Button>
        </Empty>
      </Card>
    );
  }

  const isCanceled = ["CANCELED", "NO_SHOW"].includes(appointment.status);
  const isCompleted = appointment.status === "COMPLETED";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          type="link"
          icon={<LeftOutlined />}
          onClick={() => router.push(`/admin/shop/${shopId}/appointments`)}
          className="!pl-0 mb-2"
        >
          Voltar para Agendamentos
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Title level={3} className="!mb-0">
                Agendamento
              </Title>
              <Tag 
                color={statusConfig[appointment.status]?.color} 
                icon={statusConfig[appointment.status]?.icon}
                className="text-sm"
              >
                {statusConfig[appointment.status]?.label}
              </Tag>
            </div>
            <Text type="secondary" className="font-mono text-xs">
              #{appointment.id.slice(0, 8)}
            </Text>
          </div>

          <Space wrap>
            <Button icon={<PrinterOutlined />}>
              Imprimir
            </Button>
            {!isCanceled && !isCompleted && getStatusActions().map((action) => (
              <Tooltip key={action.key} title={action.label}>
                <Button
                  type={action.type}
                  danger={action.danger}
                  icon={action.icon}
                  loading={updateStatus.isPending}
                  onClick={() => {
                    if (action.key === "CANCEL") {
                      setCancelModalVisible(true);
                    } else {
                      handleStatusChange(action.key);
                    }
                  }}
                >
                  {action.label}
                </Button>
              </Tooltip>
            ))}
          </Space>
        </div>
      </div>

      {/* Status Progress (apenas se não cancelado) */}
      {!isCanceled && (
        <Card>
          <Steps
            current={currentStep}
            status={isCompleted ? "finish" : "process"}
            items={[
              { title: "Pendente", icon: <ClockCircleOutlined /> },
              { title: "Confirmado", icon: <CheckCircleOutlined /> },
              { title: "Aguardando", icon: <UserOutlined /> },
              { title: "Em Andamento", icon: <CarOutlined /> },
              { title: "Concluído", icon: <CheckCircleOutlined /> },
            ]}
          />
        </Card>
      )}

      {/* Alerta de Cancelado */}
      {isCanceled && (
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <CloseCircleOutlined className="text-3xl text-red-500" />
            <div>
              <Text strong className="text-red-600 text-lg">
                {appointment.status === "CANCELED" ? "Agendamento Cancelado" : "Cliente Não Compareceu"}
              </Text>
              {appointment.cancellationReason && (
                <Paragraph className="text-red-500 mb-0 mt-1">
                  Motivo: {appointment.cancellationReason}
                </Paragraph>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Cards de Resumo */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="text-center h-full hover:shadow-lg transition-shadow">
            <CalendarOutlined className="text-4xl text-blue-500 mb-3" />
            <div className="text-gray-500 mb-1">Data</div>
            <Text strong className="text-xl">
              {dayjs(appointment.scheduledAt).format("DD/MM/YYYY")}
            </Text>
            <div className="text-gray-400 text-sm mt-1">
              {dayjs(appointment.scheduledAt).format("dddd")}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center h-full hover:shadow-lg transition-shadow">
            <ClockCircleOutlined className="text-4xl text-green-500 mb-3" />
            <div className="text-gray-500 mb-1">Horário</div>
            <Text strong className="text-xl">
              {dayjs(appointment.scheduledAt).format("HH:mm")} - {dayjs(appointment.endTime).format("HH:mm")}
            </Text>
            <div className="text-gray-400 text-sm mt-1">
              Duração: {appointment.totalDuration} minutos
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center h-full hover:shadow-lg transition-shadow bg-green-50">
            <DollarOutlined className="text-4xl text-green-600 mb-3" />
            <div className="text-gray-500 mb-1">Valor Total</div>
            <Text strong className="text-2xl text-green-600">
              R$ {parseFloat(appointment.totalPrice).toFixed(2)}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Informações do Cliente e Veículo */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card 
            title={
              <div className="flex items-center gap-2">
                <UserOutlined className="text-blue-500" />
                <span>Cliente</span>
              </div>
            }
            className="h-full"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserOutlined className="text-xl text-blue-500" />
                </div>
                <div>
                  <Text strong>Cliente</Text>
                  <div className="text-gray-500 text-xs font-mono">
                    ID: {appointment.userId.slice(0, 12)}...
                  </div>
                </div>
              </div>
              <Text type="secondary" className="text-xs">
                * Dados completos do cliente requerem integração adicional
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title={
              <div className="flex items-center gap-2">
                <CarOutlined className="text-purple-500" />
                <span>Veículo</span>
              </div>
            }
            className="h-full"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <CarOutlined className="text-xl text-purple-500" />
                </div>
                <div>
                  <Text strong>Veículo</Text>
                  <div className="text-gray-500 text-xs font-mono">
                    ID: {appointment.vehicleId.slice(0, 12)}...
                  </div>
                </div>
              </div>
              <Text type="secondary" className="text-xs">
                * Dados completos do veículo requerem integração adicional
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Serviços */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <CheckCircleOutlined className="text-green-500" />
            <span>Serviços Contratados</span>
            <Tag color="blue">{appointment.services.length}</Tag>
          </div>
        }
      >
        {appointment.services && appointment.services.length > 0 ? (
          <div className="space-y-3">
            {appointment.services.map((service, index) => (
              <div 
                key={service.id} 
                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <Text strong className="text-base">{service.serviceName}</Text>
                    <div className="text-gray-500 text-sm">
                      <ClockCircleOutlined className="mr-1" />
                      {service.duration} minutos
                    </div>
                  </div>
                </div>
                <Text strong className="text-lg text-green-600">
                  R$ {parseFloat(service.servicePrice).toFixed(2)}
                </Text>
              </div>
            ))}

            <Divider className="my-4" />

            <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
              <div>
                <Text strong className="text-lg">Total</Text>
                <div className="text-gray-500 text-sm">{appointment.totalDuration} minutos</div>
              </div>
              <Text strong className="text-2xl text-green-600">
                R$ {parseFloat(appointment.totalPrice).toFixed(2)}
              </Text>
            </div>
          </div>
        ) : (
          <Empty 
            description="Nenhum serviço encontrado" 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
          />
        )}
      </Card>

      {/* Observações */}
      {appointment.notes && (
        <Card 
          title={
            <div className="flex items-center gap-2">
              <ExclamationCircleOutlined className="text-blue-500" />
              <span>Observações do Cliente</span>
            </div>
          }
        >
          <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
            <Text>{appointment.notes}</Text>
          </div>
        </Card>
      )}

      {/* Metadados */}
      <Card 
        title="Informações do Sistema"
        className="bg-gray-50"
      >
        <Descriptions column={{ xs: 1, sm: 2, md: 4 }} size="small">
          <Descriptions.Item label="Criado em">
            {dayjs(appointment.createdAt).format("DD/MM/YYYY [às] HH:mm")}
          </Descriptions.Item>
          <Descriptions.Item label="Atualizado em">
            {dayjs(appointment.updatedAt).format("DD/MM/YYYY [às] HH:mm")}
          </Descriptions.Item>
          <Descriptions.Item label="ID Completo">
            <Text className="font-mono text-xs">{appointment.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Shop ID">
            <Text className="font-mono text-xs">{appointment.shopId.slice(0, 8)}...</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Modal de Cancelamento */}
      <Modal
        title="Cancelar Agendamento"
        open={cancelModalVisible}
        onCancel={() => {
          setCancelModalVisible(false);
          setCancelReason("");
        }}
        onOk={() => handleStatusChange("CANCELED", cancelReason)}
        okText="Confirmar Cancelamento"
        okButtonProps={{ danger: true, loading: updateStatus.isPending }}
        cancelText="Voltar"
      >
        <div className="space-y-4 py-4">
          <Text>
            Tem certeza que deseja cancelar este agendamento?
          </Text>
          <Input.TextArea
            placeholder="Motivo do cancelamento (opcional, mas recomendado)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={3}
          />
        </div>
      </Modal>
    </div>
  );
}
