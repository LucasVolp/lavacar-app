"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, Descriptions, Tag, Button, Empty, Spin, Typography, Row, Col, Divider } from "antd";
import { LeftOutlined, CalendarOutlined, ClockCircleOutlined, DollarOutlined, UserOutlined, CarOutlined } from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useAppointment } from "@/hooks/useAppointments";
import dayjs from "dayjs";

const { Title, Text } = Typography;

/**
 * Detalhes do Agendamento
 * 
 * Rota: /shop/[shopId]/appointments/[id]
 * 
 * Exibe informações completas do agendamento:
 * - Cliente
 * - Veículo
 * - Serviços
 * - Horários
 * - Status
 * 
 * ⚠️ Somente visualização
 */
export default function AppointmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { shopId } = useShopAdmin();
  const appointmentId = params?.id as string;

  const { data: appointment, isLoading, error } = useAppointment(appointmentId);

  const statusColors: Record<string, string> = {
    PENDING: "orange",
    CONFIRMED: "blue",
    WAITING: "cyan",
    IN_PROGRESS: "purple",
    COMPLETED: "green",
    CANCELED: "red",
    NO_SHOW: "default",
  };

  const statusLabels: Record<string, string> = {
    PENDING: "Pendente",
    CONFIRMED: "Confirmado",
    WAITING: "Aguardando",
    IN_PROGRESS: "Em Andamento",
    COMPLETED: "Concluído",
    CANCELED: "Cancelado",
    NO_SHOW: "Não Compareceu",
  };

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

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Button
          type="link"
          icon={<LeftOutlined />}
          onClick={() => router.push(`/admin/shop/${shopId}/appointments`)}
          className="!pl-0 mb-2"
        >
          Voltar para Agendamentos
        </Button>
        
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <Title level={3} className="!mb-1">
              Detalhes do Agendamento
            </Title>
            <Text type="secondary" className="font-mono">
              ID: {appointment.id}
            </Text>
          </div>
          <Tag 
            color={statusColors[appointment.status]} 
            className="text-base px-4 py-1"
          >
            {statusLabels[appointment.status]}
          </Tag>
        </div>
      </div>

      {/* Cards de Resumo */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <div className="text-center">
              <CalendarOutlined className="text-3xl text-blue-500 mb-2" />
              <div className="text-gray-500 mb-1">Data</div>
              <Text strong className="text-lg">
                {dayjs(appointment.scheduledAt).format("DD/MM/YYYY")}
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div className="text-center">
              <ClockCircleOutlined className="text-3xl text-green-500 mb-2" />
              <div className="text-gray-500 mb-1">Horário</div>
              <Text strong className="text-lg">
                {dayjs(appointment.scheduledAt).format("HH:mm")} - {dayjs(appointment.endTime).format("HH:mm")}
              </Text>
              <div className="text-gray-500 text-sm">
                ({appointment.totalDuration} min)
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div className="text-center">
              <DollarOutlined className="text-3xl text-yellow-500 mb-2" />
              <div className="text-gray-500 mb-1">Valor Total</div>
              <Text strong className="text-lg">
                R$ {parseFloat(appointment.totalPrice).toFixed(2)}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Informações do Cliente e Veículo */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={12}>
          <Card 
            title={
              <div className="flex items-center gap-2">
                <UserOutlined />
                <span>Cliente</span>
              </div>
            }
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="ID do Usuário">
                <Text className="font-mono">{appointment.userId}</Text>
              </Descriptions.Item>
            </Descriptions>
            {/* 
              SUPOSIÇÃO: O endpoint de appointments não retorna dados expandidos do usuário.
              Para exibir nome/email, seria necessário um endpoint que faça join ou 
              uma chamada adicional para /users/{userId}
            */}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title={
              <div className="flex items-center gap-2">
                <CarOutlined />
                <span>Veículo</span>
              </div>
            }
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="ID do Veículo">
                <Text className="font-mono">{appointment.vehicleId}</Text>
              </Descriptions.Item>
            </Descriptions>
            {/* 
              SUPOSIÇÃO: O endpoint de appointments não retorna dados expandidos do veículo.
              Para exibir placa/modelo, seria necessário um endpoint que faça join ou 
              uma chamada adicional para /vehicles/{vehicleId}
            */}
          </Card>
        </Col>
      </Row>

      {/* Serviços */}
      <Card 
        title="Serviços Contratados" 
        className="mb-6"
      >
        {appointment.services && appointment.services.length > 0 ? (
          <div className="flex flex-col gap-3">
            {appointment.services.map((service, index) => (
              <div 
                key={service.id} 
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <Text strong>
                    {index + 1}. {service.serviceName}
                  </Text>
                  <div className="flex gap-2 mt-1">
                    <Tag color="blue">{service.duration} min</Tag>
                  </div>
                </div>
                <Text strong className="text-lg">
                  R$ {parseFloat(service.servicePrice).toFixed(2)}
                </Text>
              </div>
            ))}

            <Divider className="my-3" />

            <div className="flex justify-between items-center">
              <Text strong className="text-lg">Total</Text>
              <div className="text-right">
                <Text type="secondary">{appointment.totalDuration} min</Text>
                <Text strong className="text-xl ml-4">
                  R$ {parseFloat(appointment.totalPrice).toFixed(2)}
                </Text>
              </div>
            </div>
          </div>
        ) : (
          <Empty 
            description="Nenhum serviço encontrado" 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
          />
        )}
      </Card>

      {/* Observações e Cancelamento */}
      {(appointment.notes || appointment.cancellationReason) && (
        <Card title="Observações">
          {appointment.notes && (
            <div className="mb-4">
              <Text strong>Notas do Cliente:</Text>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <Text>{appointment.notes}</Text>
              </div>
            </div>
          )}

          {appointment.cancellationReason && (
            <div>
              <Text strong className="text-red-500">
                Motivo do Cancelamento:
              </Text>
              <div className="mt-2 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <Text>{appointment.cancellationReason}</Text>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Metadados */}
      <Card title="Informações do Sistema" className="mt-6">
        <Descriptions column={{ xs: 1, sm: 2 }} size="small">
          <Descriptions.Item label="Criado em">
            {dayjs(appointment.createdAt).format("DD/MM/YYYY [às] HH:mm")}
          </Descriptions.Item>
          <Descriptions.Item label="Atualizado em">
            {dayjs(appointment.updatedAt).format("DD/MM/YYYY [às] HH:mm")}
          </Descriptions.Item>
          <Descriptions.Item label="ID do Shop">
            <Text className="font-mono">{appointment.shopId}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={statusColors[appointment.status]}>
              {statusLabels[appointment.status]}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
