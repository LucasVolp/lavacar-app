"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, Row, Col, Statistic, Tag, Empty, Spin, Typography, Button } from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useAppointments } from "@/hooks/useAppointments";
import dayjs from "dayjs";

const { Title, Text } = Typography;

/**
 * Dashboard do Shop (Admin)
 * 
 * Rota: /shop/[shopId]
 * 
 * Exibe visão geral do shop:
 * - Cards de resumo (agendamentos do dia, pendentes, confirmados)
 * - Agenda simples do dia (lista)
 * 
 * ⚠️ Apenas leitura
 */
export default function ShopDashboardPage() {
  const router = useRouter();
  const { shopId } = useShopAdmin();
  
  const { data: appointments = [], isLoading } = useAppointments(
    { shopId },
    !!shopId
  );

  // Filtrar agendamentos de hoje
  const today = dayjs().startOf("day");
  const todayAppointments = appointments.filter((apt) =>
    dayjs(apt.scheduledAt).isSame(today, "day")
  );

  // Calcular estatísticas
  const stats = {
    total: todayAppointments.length,
    pending: todayAppointments.filter((a) => a.status === "PENDING").length,
    confirmed: todayAppointments.filter((a) => a.status === "CONFIRMED" || a.status === "WAITING").length,
    completed: todayAppointments.filter((a) => a.status === "COMPLETED").length,
    revenue: todayAppointments
      .filter((a) => a.status === "COMPLETED")
      .reduce((acc, a) => acc + parseFloat(a.totalPrice), 0),
  };

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

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Title level={3} className="!mb-1">
          Dashboard
        </Title>
        <Text type="secondary">
          Visão geral do dia - {dayjs().format("DD [de] MMMM [de] YYYY")}
        </Text>
      </div>

      {/* Cards de Estatísticas */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Agendamentos Hoje"
              value={stats.total}
              prefix={<CalendarOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pendentes"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Confirmados"
              value={stats.confirmed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Receita do Dia"
              value={stats.revenue}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: "#52c41a" }}
              loading={isLoading}
            />
          </Card>
        </Col>
      </Row>

      {/* Agenda do Dia */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <CalendarOutlined />
            <span>Agenda do Dia ({todayAppointments.length})</span>
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<RightOutlined />}
            onClick={() => router.push(`/admin/shop/${shopId}/appointments`)}
          >
            Ver Todos
          </Button>
        }
      >
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" tip="Carregando agendamentos..." />
          </div>
        ) : todayAppointments.length === 0 ? (
          <Empty
            description="Nenhum agendamento para hoje"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {todayAppointments
              .sort((a, b) => dayjs(a.scheduledAt).unix() - dayjs(b.scheduledAt).unix())
              .slice(0, 10)
              .map((appointment) => (
                <Card
                  key={appointment.id}
                  size="small"
                  hoverable
                  onClick={() => router.push(`/admin/shop/${shopId}/appointments/${appointment.id}`)}
                  className="cursor-pointer"
                >
                  <Row justify="space-between" align="middle">
                    <Col>
                      <div className="flex items-center gap-4">
                        <div className="text-center bg-gray-100 rounded-lg px-3 py-1">
                          <Text strong className="text-lg">
                            {dayjs(appointment.scheduledAt).format("HH:mm")}
                          </Text>
                        </div>
                        <div>
                          <Text strong>
                            {appointment.services.map((s) => s.serviceName).join(", ")}
                          </Text>
                          <div className="text-gray-500 text-sm">
                            {appointment.totalDuration} min • R$ {parseFloat(appointment.totalPrice).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <Tag color={statusColors[appointment.status]}>
                        {statusLabels[appointment.status]}
                      </Tag>
                    </Col>
                  </Row>
                </Card>
              ))}

            {todayAppointments.length > 10 && (
              <Button
                type="link"
                onClick={() => router.push(`/admin/shop/${shopId}/appointments`)}
                className="self-center"
              >
                Ver mais {todayAppointments.length - 10} agendamentos
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
