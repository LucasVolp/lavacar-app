"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Empty, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  DatePicker,
  Select,
  Space,
  Tooltip,
  Dropdown,
  message,
  Modal,
  Input,
  Spin,
  Badge,
  Segmented,
  Calendar,
  type CalendarProps,
} from "antd";
import { 
  EyeOutlined, 
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  SearchOutlined,
  ReloadOutlined,
  DollarOutlined,
  CarOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useAppointments, useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import { Appointment, AppointmentService } from "@/types/appointment";
import dayjs, { Dayjs } from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

type ViewType = "table" | "calendar";
type DateRange = [dayjs.Dayjs | null, dayjs.Dayjs | null] | null;

/**
 * Lista de Agendamentos do Shop - Interface profissional
 */
export default function AppointmentsListPage() {
  const router = useRouter();
  const { shopId } = useShopAdmin();

  const { data: appointments = [], isLoading, refetch } = useAppointments({ shopId }, !!shopId);
  const updateStatus = useUpdateAppointmentStatus();
  
  const [dateRange, setDateRange] = useState<DateRange>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "today" | "upcoming">("all");
  const [viewType, setViewType] = useState<ViewType>("calendar");
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [calendarDate, setCalendarDate] = useState<Dayjs>(dayjs());

  const today = dayjs().startOf("day");

  // Aplicar filtros
  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];

    // Filtro por modo de visualização
    if (viewMode === "today") {
      filtered = filtered.filter((apt) => dayjs(apt.scheduledAt).isSame(today, "day"));
    } else if (viewMode === "upcoming") {
      filtered = filtered.filter((apt) => dayjs(apt.scheduledAt).isAfter(today));
    }

    // Filtro por data range
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((apt) => {
        const date = dayjs(apt.scheduledAt);
        return date.isAfter(dateRange[0]!.startOf("day")) && 
               date.isBefore(dateRange[1]!.endOf("day"));
      });
    }

    // Filtro por status
    if (statusFilter) {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    // Filtro por busca (serviços)
    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter((apt) =>
        apt.services.some((s) => s.serviceName.toLowerCase().includes(search)) ||
        apt.id.toLowerCase().includes(search)
      );
    }

    return filtered.sort((a, b) => dayjs(b.scheduledAt).unix() - dayjs(a.scheduledAt).unix());
  }, [appointments, dateRange, statusFilter, searchText, viewMode, today]);

  // Estatísticas
  const stats = useMemo(() => {
    const data = filteredAppointments;
    const todayData = appointments.filter((a) => dayjs(a.scheduledAt).isSame(today, "day"));
    
    return {
      total: data.length,
      todayTotal: todayData.length,
      pending: data.filter((a) => a.status === "PENDING").length,
      confirmed: data.filter((a) => a.status === "CONFIRMED" || a.status === "WAITING").length,
      inProgress: data.filter((a) => a.status === "IN_PROGRESS").length,
      completed: data.filter((a) => a.status === "COMPLETED").length,
      canceled: data.filter((a) => a.status === "CANCELED" || a.status === "NO_SHOW").length,
      revenue: data
        .filter((a) => a.status === "COMPLETED")
        .reduce((acc, a) => acc + parseFloat(a.totalPrice), 0),
    };
  }, [appointments, filteredAppointments, today]);

  const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode; bgColor: string }> = {
    PENDING: { color: "orange", label: "Pendente", icon: <ClockCircleOutlined />, bgColor: "#fff7e6" },
    CONFIRMED: { color: "blue", label: "Confirmado", icon: <CheckCircleOutlined />, bgColor: "#e6f7ff" },
    WAITING: { color: "cyan", label: "Aguardando", icon: <ClockCircleOutlined />, bgColor: "#e6fffb" },
    IN_PROGRESS: { color: "purple", label: "Em Andamento", icon: <CarOutlined />, bgColor: "#f9f0ff" },
    COMPLETED: { color: "green", label: "Concluído", icon: <CheckCircleOutlined />, bgColor: "#f6ffed" },
    CANCELED: { color: "red", label: "Cancelado", icon: <CloseCircleOutlined />, bgColor: "#fff1f0" },
    NO_SHOW: { color: "default", label: "Não Compareceu", icon: <ExclamationCircleOutlined />, bgColor: "#fafafa" },
  };

  // Agendamentos por data para o calendário
  const appointmentsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    appointments.forEach((apt) => {
      const dateKey = dayjs(apt.scheduledAt).format("YYYY-MM-DD");
      if (!map[dateKey]) {
        map[dateKey] = [];
      }
      map[dateKey].push(apt);
    });
    return map;
  }, [appointments]);

  const handleStatusChange = async (appointmentId: string, newStatus: string, reason?: string) => {
    try {
      await updateStatus.mutateAsync({
        id: appointmentId,
        status: newStatus,
        cancellationReason: reason,
      });
      message.success("Status atualizado com sucesso!");
      setCancelModalVisible(false);
      setCancelReason("");
      setSelectedAppointment(null);
    } catch {
      message.error("Erro ao atualizar status. Tente novamente.");
    }
  };

  const openCancelModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelModalVisible(true);
  };

  const getStatusActions = (record: Appointment) => {
    const items = [];
    
    if (record.status === "PENDING") {
      items.push({ key: "CONFIRMED", label: "✓ Confirmar" });
    }
    if (["PENDING", "CONFIRMED"].includes(record.status)) {
      items.push({ key: "WAITING", label: "⏳ Marcar Aguardando" });
    }
    if (["CONFIRMED", "WAITING"].includes(record.status)) {
      items.push({ key: "IN_PROGRESS", label: "🚗 Iniciar Atendimento" });
    }
    if (record.status === "IN_PROGRESS") {
      items.push({ key: "COMPLETED", label: "✅ Concluir" });
    }
    if (!["COMPLETED", "CANCELED", "NO_SHOW"].includes(record.status)) {
      items.push({ key: "CANCEL", label: "❌ Cancelar", danger: true });
      items.push({ key: "NO_SHOW", label: "⚠️ Não Compareceu" });
    }

    return items;
  };

  // Renderizar célula do calendário
  const dateCellRender = (value: Dayjs) => {
    const dateKey = value.format("YYYY-MM-DD");
    const dayAppointments = appointmentsByDate[dateKey] || [];
    
    if (dayAppointments.length === 0) return null;

    return (
      <div className="space-y-1">
        {dayAppointments.slice(0, 3).map((apt) => (
          <div
            key={apt.id}
            className="text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
            style={{ backgroundColor: statusConfig[apt.status].bgColor }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/shop/${shopId}/appointments/${apt.id}`);
            }}
          >
            <span className="font-medium">{dayjs(apt.scheduledAt).format("HH:mm")}</span>
            <span className="ml-1 text-gray-600">
              {apt.services[0]?.serviceName.slice(0, 8)}...
            </span>
          </div>
        ))}
        {dayAppointments.length > 3 && (
          <div className="text-xs text-gray-500 text-center">
            +{dayAppointments.length - 3} mais
          </div>
        )}
      </div>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  const columns = [
    {
      title: "Data/Hora",
      dataIndex: "scheduledAt",
      key: "scheduledAt",
      render: (date: string, record: Appointment) => {
        const d = dayjs(date);
        const isToday = d.isSame(today, "day");
        const isPast = d.isBefore(today);
        
        return (
          <div className={isPast && !["COMPLETED", "CANCELED"].includes(record.status) ? "text-red-500" : ""}>
            <div className="flex items-center gap-2">
              <Text strong className={isToday ? "text-blue-600" : ""}>
                {d.format("DD/MM/YYYY")}
              </Text>
              {isToday && <Tag color="blue" className="text-xs">Hoje</Tag>}
            </div>
            <div className="text-gray-500 text-sm flex items-center gap-1">
              <ClockCircleOutlined />
              {d.format("HH:mm")} - {dayjs(record.endTime).format("HH:mm")}
            </div>
          </div>
        );
      },
      sorter: (a: Appointment, b: Appointment) => 
        dayjs(a.scheduledAt).unix() - dayjs(b.scheduledAt).unix(),
      width: 160,
    },
    {
      title: "Serviços",
      dataIndex: "services",
      key: "services",
      render: (services: AppointmentService[]) => (
        <div className="flex flex-wrap gap-1">
          {services.map((service, idx) => (
            <Tag key={idx} color="blue" className="mr-0">
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
      render: (duration: number) => (
        <Space>
          <ClockCircleOutlined className="text-gray-400" />
          <span>{duration} min</span>
        </Space>
      ),
      width: 100,
    },
    {
      title: "Valor",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: string) => (
        <Text strong className="text-green-600 text-base">
          R$ {parseFloat(price).toFixed(2)}
        </Text>
      ),
      sorter: (a: Appointment, b: Appointment) => 
        parseFloat(a.totalPrice) - parseFloat(b.totalPrice),
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const config = statusConfig[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
      width: 140,
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: unknown, record: Appointment) => {
        const actions = getStatusActions(record);
        
        return (
          <Space>
            <Tooltip title="Ver Detalhes">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => router.push(`/admin/shop/${shopId}/appointments/${record.id}`)}
                className="text-blue-500"
              />
            </Tooltip>
            {actions.length > 0 && (
              <Dropdown
                menu={{
                  items: actions.map((action) => ({
                    key: action.key,
                    label: action.label,
                    danger: action.key === "CANCEL" || action.key === "NO_SHOW",
                    onClick: () => {
                      if (action.key === "CANCEL") {
                        openCancelModal(record);
                      } else {
                        handleStatusChange(record.id, action.key);
                      }
                    },
                  })),
                }}
                trigger={["click"]}
              >
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            )}
          </Space>
        );
      },
      width: 100,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando agendamentos..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={3} className="!mb-1 flex items-center gap-2">
            <CalendarOutlined className="text-blue-500" />
            Agendamentos
            <Badge count={stats.todayTotal} className="ml-2" title="Hoje" />
          </Title>
          <Text type="secondary">
            Gerencie todos os agendamentos do estabelecimento
          </Text>
        </div>
        <Space>
          <Segmented
            value={viewType}
            onChange={(v) => setViewType(v as ViewType)}
            options={[
              { value: "table", icon: <UnorderedListOutlined />, label: "Lista" },
              { value: "calendar", icon: <AppstoreOutlined />, label: "Agenda" },
            ]}
          />
          <Button 
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
          >
            Atualizar
          </Button>
        </Space>
      </div>

      {/* Estatísticas */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} lg={4}>
          <Card className="text-center hover:shadow-md transition-shadow">
            <Statistic 
              title="Total" 
              value={stats.total}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card className="text-center hover:shadow-md transition-shadow">
            <Statistic 
              title="Pendentes" 
              value={stats.pending}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card className="text-center hover:shadow-md transition-shadow">
            <Statistic 
              title="Confirmados" 
              value={stats.confirmed}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card className="text-center hover:shadow-md transition-shadow">
            <Statistic 
              title="Em Andamento" 
              value={stats.inProgress}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card className="text-center hover:shadow-md transition-shadow">
            <Statistic 
              title="Concluídos" 
              value={stats.completed}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card className="text-center hover:shadow-md transition-shadow">
            <Statistic 
              title="Receita" 
              value={stats.revenue}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filtros - apenas para visualização em tabela */}
      {viewType === "table" && (
        <Card>
          <div className="flex flex-col lg:flex-row gap-4">
            <Segmented
              value={viewMode}
              onChange={(value) => setViewMode(value as typeof viewMode)}
              options={[
                { label: "Todos", value: "all" },
                { label: "Hoje", value: "today" },
                { label: "Próximos", value: "upcoming" },
              ]}
            />
            
            <div className="flex flex-wrap gap-3 flex-1">
              <RangePicker
                value={dateRange as [dayjs.Dayjs, dayjs.Dayjs]}
                onChange={(dates) => setDateRange(dates)}
                format="DD/MM/YYYY"
                placeholder={["Data início", "Data fim"]}
                allowClear
                className="min-w-[250px]"
              />
              
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filtrar por status"
                allowClear
                className="min-w-[180px]"
                options={Object.entries(statusConfig).map(([key, value]) => ({
                  value: key,
                  label: (
                    <Space>
                      {value.icon}
                      {value.label}
                    </Space>
                  ),
                }))}
              />
              
              <Input
                placeholder="Buscar por serviço..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="max-w-[200px]"
              />
            </div>

            {(dateRange || statusFilter || searchText) && (
              <Button 
                type="link"
                onClick={() => {
                  setDateRange(null);
                  setStatusFilter(null);
                  setSearchText("");
                  setViewMode("all");
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Conteúdo - Tabela ou Calendário */}
      {viewType === "table" ? (
        <Card>
          <Table
            dataSource={filteredAppointments}
            columns={columns}
            rowKey="id"
            locale={{
              emptyText: (
                <Empty
                  description="Nenhum agendamento encontrado"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            pagination={{
              pageSize: 15,
              showSizeChanger: true,
              showTotal: (total) => `${total} agendamento(s)`,
            }}
            rowClassName={(record) => {
              if (record.status === "CANCELED" || record.status === "NO_SHOW") {
                return "opacity-50";
              }
              if (dayjs(record.scheduledAt).isSame(today, "day")) {
                return "bg-blue-50";
              }
              return "";
            }}
          />
        </Card>
      ) : (
        <Card className="calendar-appointments">
          <Calendar
            value={calendarDate}
            onChange={setCalendarDate}
            cellRender={cellRender}
            onSelect={(date, { source }) => {
              if (source === "date") {
                setCalendarDate(date);
              }
            }}
          />
          
          {/* Lista do dia selecionado */}
          <div className="mt-6 pt-6 border-t">
            <Title level={5} className="mb-4">
              <CalendarOutlined className="mr-2" />
              Agendamentos em {calendarDate.format("DD/MM/YYYY")}
            </Title>
            
            {(() => {
              const dayAppts = appointmentsByDate[calendarDate.format("YYYY-MM-DD")] || [];
              if (dayAppts.length === 0) {
                return (
                  <Empty 
                    description="Nenhum agendamento nesta data"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                );
              }
              
              return (
                <div className="space-y-3">
                  {dayAppts
                    .sort((a, b) => dayjs(a.scheduledAt).unix() - dayjs(b.scheduledAt).unix())
                    .map((apt) => (
                      <Card
                        key={apt.id}
                        size="small"
                        hoverable
                        className="cursor-pointer"
                        style={{ borderLeft: `4px solid ${statusConfig[apt.status].color === "default" ? "#d9d9d9" : statusConfig[apt.status].color}` }}
                        onClick={() => router.push(`/admin/shop/${shopId}/appointments/${apt.id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center min-w-[60px]">
                              <Text strong className="text-lg block">
                                {dayjs(apt.scheduledAt).format("HH:mm")}
                              </Text>
                              <Text type="secondary" className="text-xs">
                                {apt.totalDuration} min
                              </Text>
                            </div>
                            <div>
                              <Text strong>
                                {apt.services.map((s) => s.serviceName).join(", ")}
                              </Text>
                              <div className="text-green-600 font-medium">
                                R$ {parseFloat(apt.totalPrice).toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <Tag color={statusConfig[apt.status].color} icon={statusConfig[apt.status].icon}>
                            {statusConfig[apt.status].label}
                          </Tag>
                        </div>
                      </Card>
                    ))}
                </div>
              );
            })()}
          </div>
        </Card>
      )}

      {/* Modal de Cancelamento */}
      <Modal
        title="Cancelar Agendamento"
        open={cancelModalVisible}
        onCancel={() => {
          setCancelModalVisible(false);
          setCancelReason("");
          setSelectedAppointment(null);
        }}
        onOk={() => {
          if (selectedAppointment) {
            handleStatusChange(selectedAppointment.id, "CANCELED", cancelReason);
          }
        }}
        okText="Confirmar Cancelamento"
        okButtonProps={{ danger: true, loading: updateStatus.isPending }}
        cancelText="Voltar"
      >
        <div className="space-y-4">
          <Text>
            Tem certeza que deseja cancelar este agendamento?
          </Text>
          <Input.TextArea
            placeholder="Motivo do cancelamento (opcional)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={3}
          />
        </div>
      </Modal>
    </div>
  );
}
