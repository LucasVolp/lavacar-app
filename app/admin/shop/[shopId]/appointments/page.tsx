"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, Table, Tag, Button, Empty, Typography, Row, Col, Statistic, DatePicker } from "antd";
import { EyeOutlined, CalendarOutlined } from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useAppointments } from "@/hooks/useAppointments";
import { Appointment, AppointmentService } from "@/types/appointment";
import dayjs from "dayjs";

const { Title, Text } = Typography;

/**
 * Lista de Agendamentos do Shop
 * 
 * Rota: /shop/[shopId]/appointments
 * 
 * Exibe todos os agendamentos do shop em formato de tabela:
 * - Cliente
 * - Serviços
 * - Data/Hora
 * - Status
 * - Ação: visualizar detalhes
 * 
 * ⚠️ Apenas visualização
 */
export default function AppointmentsListPage() {
  const router = useRouter();
  const { shopId } = useShopAdmin();

  const { data: appointments = [], isLoading } = useAppointments({ shopId }, !!shopId);
  const [selectedDate, setSelectedDate] = React.useState<dayjs.Dayjs | null>(null);

  // Filtrar por data selecionada
  const filteredAppointments = useMemo(() => {
    if (!selectedDate) return appointments;
    return appointments.filter((apt) =>
      dayjs(apt.scheduledAt).isSame(selectedDate, "day")
    );
  }, [appointments, selectedDate]);

  // Estatísticas
  const stats = useMemo(() => {
    const data = selectedDate ? filteredAppointments : appointments;
    return {
      total: data.length,
      pending: data.filter((a) => a.status === "PENDING" || a.status === "CONFIRMED").length,
      completed: data.filter((a) => a.status === "COMPLETED").length,
      canceled: data.filter((a) => a.status === "CANCELED" || a.status === "NO_SHOW").length,
    };
  }, [appointments, filteredAppointments, selectedDate]);

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

  const columns = [
    {
      title: "Data/Hora",
      dataIndex: "scheduledAt",
      key: "scheduledAt",
      render: (date: string) => (
        <div>
          <div className="font-medium">{dayjs(date).format("DD/MM/YYYY")}</div>
          <div className="text-gray-500 text-sm">{dayjs(date).format("HH:mm")}</div>
        </div>
      ),
      sorter: (a: Appointment, b: Appointment) => 
        dayjs(a.scheduledAt).unix() - dayjs(b.scheduledAt).unix(),
      defaultSortOrder: "descend" as const,
      width: 130,
    },
    {
      title: "Cliente",
      dataIndex: "userId",
      key: "userId",
      render: (userId: string) => (
        <Text className="font-mono text-sm">
          {userId.slice(0, 8)}...
        </Text>
      ),
      width: 120,
    },
    {
      title: "Serviços",
      dataIndex: "services",
      key: "services",
      render: (services: AppointmentService[]) => (
        <div className="flex flex-col gap-1">
          {services.map((service, idx) => (
            <Tag key={idx} className="mr-0">
              {service.serviceName}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Duração",
      dataIndex: "totalDuration",
      key: "totalDuration",
      render: (duration: number) => `${duration} min`,
      width: 90,
    },
    {
      title: "Valor",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: string) => (
        <Text strong>R$ {parseFloat(price).toFixed(2)}</Text>
      ),
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
      filters: Object.keys(statusLabels).map((key) => ({
        text: statusLabels[key],
        value: key,
      })),
      onFilter: (value: React.Key | boolean, record: Appointment) => record.status === value,
      width: 130,
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: unknown, record: Appointment) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => router.push(`/admin/shop/${shopId}/appointments/${record.id}`)}
        >
          Detalhes
        </Button>
      ),
      width: 110,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Title level={3} className="!mb-1">
          Agendamentos
        </Title>
        <Text type="secondary">
          Visualize todos os agendamentos do estabelecimento
        </Text>
      </div>

      {/* Filtros e Estatísticas */}
      <Card className="mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <div className="flex items-center gap-2">
              <CalendarOutlined />
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Filtrar por data"
                format="DD/MM/YYYY"
                allowClear
                className="w-full"
              />
            </div>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Statistic title="Total" value={stats.total} />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Statistic 
              title="Pendentes" 
              value={stats.pending} 
              valueStyle={{ color: "#faad14" }} 
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Statistic 
              title="Concluídos" 
              value={stats.completed} 
              valueStyle={{ color: "#52c41a" }} 
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Statistic 
              title="Cancelados" 
              value={stats.canceled} 
              valueStyle={{ color: "#ff4d4f" }} 
            />
          </Col>
        </Row>
      </Card>

      {/* Tabela */}
      <Card>
        <Table
          dataSource={filteredAppointments}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          locale={{
            emptyText: (
              <Empty
                description={
                  selectedDate
                    ? `Nenhum agendamento em ${selectedDate.format("DD/MM/YYYY")}`
                    : "Nenhum agendamento encontrado"
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showTotal: (total) => `${total} agendamentos`,
          }}
        />
      </Card>
    </div>
  );
}
