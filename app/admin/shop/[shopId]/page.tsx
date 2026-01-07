"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Tag, 
  Empty, 
  Spin, 
  Typography, 
  Button,
  Progress,
  List,
  Space,
  Badge,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  RightOutlined,
  ToolOutlined,
  StopOutlined,
  ScheduleOutlined,
  CarOutlined,
  TrophyOutlined,
  RiseOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useAppointments } from "@/hooks/useAppointments";
import { useServicesByShop } from "@/hooks/useServices";
import { useShopSchedules } from "@/hooks/useSchedules";
import { useBlockedTimesByShop } from "@/hooks/useBlockedTimes";
import dayjs from "dayjs";

const { Title, Text } = Typography;

/**
 * Dashboard do Shop (Admin)
 * 
 * UI profissional com:
 * - Cards de estatísticas animados
 * - Agenda do dia com timeline
 * - Ações rápidas
 * - Indicadores de performance
 */
export default function ShopDashboardPage() {
  const router = useRouter();
  const { shop, shopId, isLoading: isLoadingShop } = useShopAdmin();
  
  const { data: appointments = [], isLoading: isLoadingAppointments } = useAppointments(
    { shopId },
    !!shopId
  );
  
  const { data: services = [] } = useServicesByShop(shopId);
  const { data: schedules = [] } = useShopSchedules(shopId);
  const { data: blockedTimes = [] } = useBlockedTimesByShop(shopId);

  const isLoading = isLoadingShop || isLoadingAppointments;

  // Filtrar agendamentos de hoje
  const today = dayjs().startOf("day");
  const todayAppointments = appointments.filter((apt) =>
    dayjs(apt.scheduledAt).isSame(today, "day")
  );

  // Agendamentos da semana
  const weekStart = dayjs().startOf("week");
  const weekEnd = dayjs().endOf("week");
  const weekAppointments = appointments.filter((apt) =>
    dayjs(apt.scheduledAt).isAfter(weekStart) && dayjs(apt.scheduledAt).isBefore(weekEnd)
  );

  // Calcular estatísticas
  const stats = {
    total: todayAppointments.length,
    pending: todayAppointments.filter((a) => a.status === "PENDING").length,
    confirmed: todayAppointments.filter((a) => a.status === "CONFIRMED" || a.status === "WAITING").length,
    inProgress: todayAppointments.filter((a) => a.status === "IN_PROGRESS").length,
    completed: todayAppointments.filter((a) => a.status === "COMPLETED").length,
    revenue: todayAppointments
      .filter((a) => a.status === "COMPLETED")
      .reduce((acc, a) => acc + parseFloat(a.totalPrice), 0),
    weekRevenue: weekAppointments
      .filter((a) => a.status === "COMPLETED")
      .reduce((acc, a) => acc + parseFloat(a.totalPrice), 0),
    weekCompleted: weekAppointments.filter((a) => a.status === "COMPLETED").length,
    activeServices: services.filter((s) => s.isActive !== false).length,
  };

  // Taxa de conclusão do dia
  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

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

  // Próximos agendamentos (não concluídos/cancelados)
  const upcomingAppointments = todayAppointments
    .filter((a) => !["COMPLETED", "CANCELED", "NO_SHOW"].includes(a.status))
    .sort((a, b) => dayjs(a.scheduledAt).unix() - dayjs(b.scheduledAt).unix())
    .slice(0, 5);

  // Ações rápidas
  const quickActions = [
    {
      title: "Serviços",
      icon: <ToolOutlined className="text-2xl" />,
      color: "#1890ff",
      value: stats.activeServices,
      label: "ativos",
      path: `/admin/shop/${shopId}/services`,
    },
    {
      title: "Horários",
      icon: <ScheduleOutlined className="text-2xl" />,
      color: "#52c41a",
      value: schedules.filter(s => s.isOpen === "ACTIVE").length,
      label: "dias abertos",
      path: `/admin/shop/${shopId}/schedules`,
    },
    {
      title: "Bloqueios",
      icon: <StopOutlined className="text-2xl" />,
      color: "#faad14",
      value: blockedTimes.filter(b => dayjs(b.date).isAfter(today)).length,
      label: "futuros",
      path: `/admin/shop/${shopId}/blocked-times`,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com boas-vindas */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-6 text-white">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} className="!text-white !mb-1">
              Olá! Bem-vindo ao {shop?.name}
            </Title>
            <Text className="text-blue-100">
              {dayjs().format("dddd, DD [de] MMMM [de] YYYY")}
            </Text>
          </Col>
          <Col>
            <Space size="large">
              <div className="text-center">
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-blue-100 text-sm">Agendamentos hoje</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  R$ {stats.revenue.toFixed(0)}
                </div>
                <div className="text-blue-100 text-sm">Receita do dia</div>
              </div>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Cards de Estatísticas */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <Statistic
              title={<span className="text-gray-600 font-medium">Agendamentos Hoje</span>}
              value={stats.total}
              prefix={<CalendarOutlined className="text-blue-500" />}
              valueStyle={{ color: "#1890ff", fontWeight: 600 }}
            />
            <div className="mt-2 text-xs text-gray-400">
              <ArrowUpOutlined className="text-green-500" /> {weekAppointments.length} esta semana
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
            <Statistic
              title={<span className="text-gray-600 font-medium">Pendentes</span>}
              value={stats.pending}
              prefix={<ClockCircleOutlined className="text-orange-500" />}
              valueStyle={{ color: "#fa8c16", fontWeight: 600 }}
            />
            <div className="mt-2 text-xs text-gray-400">
              Aguardando confirmação
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <Statistic
              title={<span className="text-gray-600 font-medium">Em Andamento</span>}
              value={stats.inProgress}
              prefix={<RiseOutlined className="text-purple-500" />}
              valueStyle={{ color: "#722ed1", fontWeight: 600 }}
            />
            <div className="mt-2 text-xs text-gray-400">
              Sendo atendidos agora
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <Statistic
              title={<span className="text-gray-600 font-medium">Receita do Dia</span>}
              value={stats.revenue}
              prefix={<DollarOutlined className="text-green-500" />}
              precision={2}
              valueStyle={{ color: "#52c41a", fontWeight: 600 }}
            />
            <div className="mt-2 text-xs text-gray-400">
              <ArrowUpOutlined className="text-green-500" /> R$ {stats.weekRevenue.toFixed(2)} esta semana
            </div>
          </Card>
        </Col>
      </Row>

      {/* Conteúdo Principal */}
      <Row gutter={[16, 16]}>
        {/* Próximos Agendamentos */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <CalendarOutlined className="text-blue-500" />
                <span>Próximos Agendamentos</span>
                <Badge count={upcomingAppointments.length} className="ml-2" />
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
            className="h-full"
          >
            {upcomingAppointments.length === 0 ? (
              <Empty
                description="Nenhum agendamento pendente para hoje"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={upcomingAppointments}
                renderItem={(appointment) => (
                  <List.Item
                    className="hover:bg-gray-50 rounded-lg cursor-pointer transition-colors px-3"
                    onClick={() => router.push(`/admin/shop/${shopId}/appointments/${appointment.id}`)}
                    extra={
                      <Tag color={statusColors[appointment.status]} className="m-0">
                        {statusLabels[appointment.status]}
                      </Tag>
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        <div className="flex flex-col items-center bg-blue-50 rounded-lg px-3 py-2 min-w-[60px]">
                          <Text strong className="text-blue-600 text-lg leading-none">
                            {dayjs(appointment.scheduledAt).format("HH:mm")}
                          </Text>
                          <Text type="secondary" className="text-xs">
                            {dayjs(appointment.endTime).format("HH:mm")}
                          </Text>
                        </div>
                      }
                      title={
                        <Space>
                          <Text strong>
                            {appointment.services.map((s) => s.serviceName).join(", ")}
                          </Text>
                        </Space>
                      }
                      description={
                        <Space split="•" className="text-gray-500">
                          <span><CarOutlined /> Veículo</span>
                          <span>{appointment.totalDuration} min</span>
                          <span className="text-green-600 font-medium">
                            R$ {parseFloat(appointment.totalPrice).toFixed(2)}
                          </span>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Painel Lateral */}
        <Col xs={24} lg={8}>
          <div className="space-y-4">
            {/* Performance do Dia */}
            <Card className="h-full">
              <div className="text-center mb-4">
                <TrophyOutlined className="text-4xl text-yellow-500 mb-2" />
                <Title level={5} className="!mb-1">Performance do Dia</Title>
                <Text type="secondary">Taxa de conclusão</Text>
              </div>
              <div className="flex items-center justify-center mt-4">
              <Progress
                type="circle"
                percent={completionRate}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
                format={(percent) => (
                  <div className="text-center">
                    <div className="text-2xl font-bold">{percent}%</div>
                    <div className="text-xs text-gray-400">concluído</div>
                  </div>
                )}
                className="flex justify-center"
              />
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t">
                <div className="text-center">
                  <Text strong className="text-green-500">{stats.completed}</Text>
                  <div className="text-xs text-gray-400">Concluídos</div>
                </div>
                <div className="text-center">
                  <Text strong className="text-purple-500">{stats.inProgress}</Text>
                  <div className="text-xs text-gray-400">Em andamento</div>
                </div>
                <div className="text-center">
                  <Text strong className="text-orange-500">{stats.pending + stats.confirmed}</Text>
                  <div className="text-xs text-gray-400">Aguardando</div>
                </div>
              </div>
            </Card>

            {/* Ações Rápidas */}
            <Card title="Gerenciamento Rápido">
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <div
                    key={action.title}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border"
                    onClick={() => router.push(action.path)}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${action.color}15`, color: action.color }}
                      >
                        {action.icon}
                      </div>
                      <div>
                        <Text strong>{action.title}</Text>
                        <div className="text-xs text-gray-400">{action.value} {action.label}</div>
                      </div>
                    </div>
                    <RightOutlined className="text-gray-400" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
