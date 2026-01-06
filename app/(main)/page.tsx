"use client";

import React from "react";
import { Typography, Card, Row, Col, Statistic, Button, Space, List, Avatar, Tag, Progress } from "antd";
import {
  ShopOutlined,
  CalendarOutlined,
  CarOutlined,
  StarOutlined,
  ArrowRightOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Title, Text, Paragraph } = Typography;

// Mock data para o dashboard
const stats = [
  {
    title: "Lojas Ativas",
    value: 4,
    icon: <ShopOutlined className="text-primary" />,
    change: "+2",
    changeType: "up" as const,
    suffix: "",
  },
  {
    title: "Agendamentos Hoje",
    value: 12,
    icon: <CalendarOutlined className="text-success" />,
    change: "+5",
    changeType: "up" as const,
    suffix: "",
  },
  {
    title: "Veículos Cadastrados",
    value: 156,
    icon: <CarOutlined className="text-info" />,
    change: "+18",
    changeType: "up" as const,
    suffix: "",
  },
  {
    title: "Avaliação Média",
    value: 4.8,
    icon: <StarOutlined className="text-warning" />,
    change: "+0.2",
    changeType: "up" as const,
    suffix: "★",
    precision: 1,
  },
];

const recentAppointments = [
  {
    id: "1",
    customer: "João Silva",
    service: "Lavagem Completa",
    shop: "Auto Lavagem Central",
    time: "14:30",
    status: "CONFIRMED",
  },
  {
    id: "2",
    customer: "Maria Santos",
    service: "Polimento",
    shop: "Premium Car Wash",
    time: "15:00",
    status: "PENDING",
  },
  {
    id: "3",
    customer: "Pedro Oliveira",
    service: "Lavagem Simples",
    shop: "Brilho Rápido",
    time: "15:30",
    status: "IN_PROGRESS",
  },
  {
    id: "4",
    customer: "Ana Costa",
    service: "Higienização",
    shop: "Auto Lavagem Central",
    time: "16:00",
    status: "PENDING",
  },
];

const statusColors: Record<string, string> = {
  PENDING: "gold",
  CONFIRMED: "blue",
  IN_PROGRESS: "processing",
  COMPLETED: "green",
  CANCELED: "red",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluído",
  CANCELED: "Cancelado",
};

const quickActions = [
  {
    title: "Ver Lojas",
    description: "Gerencie seus estabelecimentos",
    icon: <ShopOutlined />,
    href: "/shop",
    color: "primary",
  },
  {
    title: "Agendamentos",
    description: "Visualize a agenda do dia",
    icon: <CalendarOutlined />,
    href: "/appointments",
    color: "success",
  },
  {
    title: "Serviços",
    description: "Configure preços e duração",
    icon: <ClockCircleOutlined />,
    href: "/services",
    color: "info",
  },
  {
    title: "Avaliações",
    description: "Feedback dos clientes",
    icon: <StarOutlined />,
    href: "/evaluations",
    color: "warning",
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-primary to-secondary shadow-lg mb-6">
        <div className="card-body py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Title level={2} className="!text-white !mb-2">
                Bem-vindo ao Lavacar! 👋
              </Title>
              <Paragraph className="text-white/80 !mb-0 max-w-xl">
                Gerencie seus estabelecimentos, agendamentos e clientes em um só lugar.
                Veja o resumo das atividades de hoje.
              </Paragraph>
            </div>
            <Link href="/shop">
              <Button
                size="large"
                className="bg-white text-primary hover:bg-white/90 border-0 shadow-lg"
                icon={<ArrowRightOutlined />}
              >
                Ver Lojas
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <Row gutter={[24, 24]} className="mb-6">
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="border-base-200 hover:shadow-lg transition-shadow h-full">
              <div className="flex items-start justify-between">
                <div>
                  <Text type="secondary" className="text-sm">
                    {stat.title}
                  </Text>
                  <div className="flex items-baseline gap-2 mt-2">
                    <Statistic
                      value={stat.value}
                      suffix={stat.suffix}
                      precision={stat.precision}
                      valueStyle={{ fontWeight: 700, fontSize: "1.75rem" }}
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <RiseOutlined className="text-success text-xs" />
                    <Text type="success" className="text-xs">
                      {stat.change} este mês
                    </Text>
                  </div>
                </div>
                <div className="w-12 h-12 bg-base-200 rounded-xl flex items-center justify-center text-xl">
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Quick Actions */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <RiseOutlined className="text-primary" />
                <span>Ações Rápidas</span>
              </div>
            }
            className="border-base-200 h-full"
          >
            <Space direction="vertical" className="w-full" size="middle">
              {quickActions.map((action, index) => (
                <Link href={action.href} key={index} className="block">
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-base-200 transition-colors cursor-pointer group">
                    <div className={`w-10 h-10 bg-${action.color}/10 rounded-lg flex items-center justify-center text-${action.color}`}>
                      {action.icon}
                    </div>
                    <div className="flex-grow">
                      <Text strong className="block">
                        {action.title}
                      </Text>
                      <Text type="secondary" className="text-xs">
                        {action.description}
                      </Text>
                    </div>
                    <ArrowRightOutlined className="text-base-content/30 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </Space>
          </Card>
        </Col>

        {/* Recent Appointments */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarOutlined className="text-success" />
                  <span>Agendamentos de Hoje</span>
                </div>
                <Link href="/appointments">
                  <Button type="link" size="small">
                    Ver todos
                  </Button>
                </Link>
              </div>
            }
            className="border-base-200 h-full"
          >
            <List
              itemLayout="horizontal"
              dataSource={recentAppointments}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<UserOutlined />}
                        className="bg-gradient-to-br from-primary to-secondary"
                      />
                    }
                    title={
                      <div className="flex items-center gap-2">
                        <Text strong>{item.customer}</Text>
                        <Tag color={statusColors[item.status]}>
                          {statusLabels[item.status]}
                        </Tag>
                      </div>
                    }
                    description={
                      <div className="flex items-center gap-4">
                        <Text type="secondary" className="text-xs">
                          <ClockCircleOutlined className="mr-1" />
                          {item.time}
                        </Text>
                        <Text type="secondary" className="text-xs">
                          {item.service}
                        </Text>
                        <Text type="secondary" className="text-xs">
                          <ShopOutlined className="mr-1" />
                          {item.shop}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Performance Overview */}
      <Row gutter={[24, 24]} className="mt-6">
        <Col xs={24} md={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <CheckCircleOutlined className="text-success" />
                <span>Taxa de Conclusão</span>
              </div>
            }
            className="border-base-200"
          >
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <Text type="secondary">Agendamentos concluídos</Text>
                  <Text strong>87%</Text>
                </div>
                <Progress percent={87} showInfo={false} strokeColor="#22c55e" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <Text type="secondary">Taxa de satisfação</Text>
                  <Text strong>92%</Text>
                </div>
                <Progress percent={92} showInfo={false} strokeColor="#6366f1" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <Text type="secondary">Clientes recorrentes</Text>
                  <Text strong>65%</Text>
                </div>
                <Progress percent={65} showInfo={false} strokeColor="#f59e0b" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <SyncOutlined className="text-info" />
                <span>Status das Lojas</span>
              </div>
            }
            className="border-base-200"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-success rounded-full" />
                  <Text>Lojas Ativas</Text>
                </div>
                <Text strong className="text-success">3</Text>
              </div>
              <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-warning rounded-full" />
                  <Text>Lojas Inativas</Text>
                </div>
                <Text strong className="text-warning">1</Text>
              </div>
              <div className="flex items-center justify-between p-3 bg-error/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-error rounded-full" />
                  <Text>Lojas Suspensas</Text>
                </div>
                <Text strong className="text-error">0</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
