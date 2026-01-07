"use client";

import React, { useMemo } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Progress, 
  Spin,
  Tag,
  Empty,
  Table,
  Space,
  Tooltip,
} from "antd";
import {
  LineChartOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  FireOutlined,
  StarOutlined,
  ToolOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useAppointments } from "@/hooks/useAppointments";
import { useServicesByShop } from "@/hooks/useServices";
import dayjs from "dayjs";

const { Title, Text } = Typography;

/**
 * Página de Insights e Analytics
 * 
 * Métricas, gráficos e análises de desempenho do estabelecimento
 */
export default function InsightsPage() {
  const { shop, shopId, isLoading: isLoadingShop } = useShopAdmin();
  
  const { data: appointments = [], isLoading: isLoadingAppointments } = useAppointments(
    { shopId },
    !!shopId
  );
  
  const { data: services = [] } = useServicesByShop(shopId);

  const isLoading = isLoadingShop || isLoadingAppointments;

  // Métricas calculadas
  const metrics = useMemo(() => {
    const today = dayjs().startOf("day");
    const thisWeekStart = dayjs().startOf("week");
    const thisMonthStart = dayjs().startOf("month");
    const lastMonthStart = dayjs().subtract(1, "month").startOf("month");
    const lastMonthEnd = dayjs().subtract(1, "month").endOf("month");

    // Filtros por período
    const todayAppts = appointments.filter((a) => dayjs(a.scheduledAt).isSame(today, "day"));
    const thisWeekAppts = appointments.filter((a) => dayjs(a.scheduledAt).isAfter(thisWeekStart));
    const thisMonthAppts = appointments.filter((a) => dayjs(a.scheduledAt).isAfter(thisMonthStart));
    const lastMonthAppts = appointments.filter((a) => 
      dayjs(a.scheduledAt).isAfter(lastMonthStart) && dayjs(a.scheduledAt).isBefore(lastMonthEnd)
    );

    // Receita
    const calculateRevenue = (appts: typeof appointments) => 
      appts
        .filter((a) => a.status === "COMPLETED")
        .reduce((acc, a) => acc + parseFloat(a.totalPrice), 0);

    const todayRevenue = calculateRevenue(todayAppts);
    const weekRevenue = calculateRevenue(thisWeekAppts);
    const monthRevenue = calculateRevenue(thisMonthAppts);
    const lastMonthRevenue = calculateRevenue(lastMonthAppts);

    // Crescimento
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Taxa de conclusão
    const completedAppts = thisMonthAppts.filter((a) => a.status === "COMPLETED").length;
    const totalScheduled = thisMonthAppts.filter((a) => !["CANCELED", "NO_SHOW"].includes(a.status)).length;
    const completionRate = totalScheduled > 0 ? (completedAppts / totalScheduled) * 100 : 0;

    // Taxa de cancelamento
    const canceledAppts = thisMonthAppts.filter((a) => a.status === "CANCELED" || a.status === "NO_SHOW").length;
    const cancellationRate = thisMonthAppts.length > 0 ? (canceledAppts / thisMonthAppts.length) * 100 : 0;

    // Ticket médio
    const completedMonthAppts = thisMonthAppts.filter((a) => a.status === "COMPLETED");
    const avgTicket = completedMonthAppts.length > 0 
      ? monthRevenue / completedMonthAppts.length 
      : 0;

    // Duração média
    const avgDuration = completedMonthAppts.length > 0
      ? completedMonthAppts.reduce((acc, a) => acc + a.totalDuration, 0) / completedMonthAppts.length
      : 0;

    // Serviços mais populares
    const serviceCount: Record<string, { name: string; count: number; revenue: number }> = {};
    thisMonthAppts.forEach((apt) => {
      apt.services.forEach((s) => {
        if (!serviceCount[s.serviceId]) {
          serviceCount[s.serviceId] = { name: s.serviceName, count: 0, revenue: 0 };
        }
        serviceCount[s.serviceId].count++;
        serviceCount[s.serviceId].revenue += parseFloat(s.servicePrice);
      });
    });

    const topServices = Object.values(serviceCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Agendamentos por dia da semana
    const dayOfWeekCount: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    thisMonthAppts.forEach((apt) => {
      const dow = dayjs(apt.scheduledAt).day();
      dayOfWeekCount[dow]++;
    });

    const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const appointmentsByDayOfWeek = Object.entries(dayOfWeekCount).map(([day, count]) => ({
      day: dayNames[parseInt(day)],
      count,
    }));

    // Horários de pico
    const hourCount: Record<number, number> = {};
    thisMonthAppts.forEach((apt) => {
      const hour = dayjs(apt.scheduledAt).hour();
      hourCount[hour] = (hourCount[hour] || 0) + 1;
    });

    const peakHours = Object.entries(hourCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour, count]) => ({ hour: `${hour}:00`, count }));

    return {
      today: {
        appointments: todayAppts.length,
        revenue: todayRevenue,
        pending: todayAppts.filter((a) => a.status === "PENDING").length,
        completed: todayAppts.filter((a) => a.status === "COMPLETED").length,
      },
      week: {
        appointments: thisWeekAppts.length,
        revenue: weekRevenue,
      },
      month: {
        appointments: thisMonthAppts.length,
        revenue: monthRevenue,
        completionRate,
        cancellationRate,
        avgTicket,
        avgDuration,
        revenueGrowth,
      },
      topServices,
      appointmentsByDayOfWeek,
      peakHours,
      totalServices: services.length,
      activeServices: services.filter((s) => s.isActive !== false).length,
    };
  }, [appointments, services]);

  // Dados para tabela de serviços populares
  const topServicesColumns = [
    {
      title: "Posição",
      key: "position",
      width: 80,
      render: (_: unknown, __: unknown, index: number) => (
        <div className="flex items-center gap-2">
          {index === 0 ? (
            <TrophyOutlined className="text-yellow-500 text-lg" />
          ) : index === 1 ? (
            <TrophyOutlined className="text-gray-400 text-lg" />
          ) : index === 2 ? (
            <TrophyOutlined className="text-amber-700 text-lg" />
          ) : (
            <span className="text-gray-400 font-medium">{index + 1}º</span>
          )}
        </div>
      ),
    },
    {
      title: "Serviço",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: "Agendamentos",
      dataIndex: "count",
      key: "count",
      render: (count: number) => (
        <Tag color="blue" icon={<CalendarOutlined />}>
          {count}
        </Tag>
      ),
    },
    {
      title: "Receita",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue: number) => (
        <Text strong className="text-green-600">
          R$ {revenue.toFixed(2)}
        </Text>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando insights..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 rounded-2xl p-6 text-white">
        <Row justify="space-between" align="middle">
          <Col>
            <div className="flex items-center gap-3 mb-2">
              <LineChartOutlined className="text-3xl" />
              <Title level={3} className="!text-white !mb-0">
                Insights & Analytics
              </Title>
            </div>
            <Text className="text-pink-100">
              Análise de performance de {shop?.name}
            </Text>
          </Col>
          <Col>
            <Space size="large">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  R$ {metrics.month.revenue.toFixed(0)}
                </div>
                <div className="text-pink-100 text-sm">Receita do mês</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold flex items-center justify-center gap-1">
                  {metrics.month.revenueGrowth >= 0 ? (
                    <RiseOutlined className="text-green-300" />
                  ) : (
                    <FallOutlined className="text-red-300" />
                  )}
                  {Math.abs(metrics.month.revenueGrowth).toFixed(0)}%
                </div>
                <div className="text-pink-100 text-sm">vs mês anterior</div>
              </div>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Métricas Principais */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow h-full border-l-4 border-l-blue-500">
            <Statistic
              title={<span className="text-gray-600 font-medium">Agendamentos Hoje</span>}
              value={metrics.today.appointments}
              prefix={<CalendarOutlined className="text-blue-500" />}
              valueStyle={{ color: "#1890ff", fontWeight: 600 }}
            />
            <div className="mt-2 flex gap-2">
              <Tag color="orange">{metrics.today.pending} pendentes</Tag>
              <Tag color="green">{metrics.today.completed} concluídos</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow h-full border-l-4 border-l-green-500">
            <Statistic
              title={<span className="text-gray-600 font-medium">Receita Hoje</span>}
              value={metrics.today.revenue}
              precision={2}
              prefix={<DollarOutlined className="text-green-500" />}
              valueStyle={{ color: "#52c41a", fontWeight: 600 }}
            />
            <div className="mt-2 text-xs text-gray-400">
              Semana: R$ {metrics.week.revenue.toFixed(2)}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow h-full border-l-4 border-l-purple-500">
            <Statistic
              title={<span className="text-gray-600 font-medium">Ticket Médio</span>}
              value={metrics.month.avgTicket}
              precision={2}
              prefix={<ThunderboltOutlined className="text-purple-500" />}
              valueStyle={{ color: "#722ed1", fontWeight: 600 }}
            />
            <div className="mt-2 text-xs text-gray-400">
              Média do mês atual
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow h-full border-l-4 border-l-cyan-500">
            <Statistic
              title={<span className="text-gray-600 font-medium">Duração Média</span>}
              value={Math.round(metrics.month.avgDuration)}
              suffix="min"
              prefix={<ClockCircleOutlined className="text-cyan-500" />}
              valueStyle={{ color: "#06b6d4", fontWeight: 600 }}
            />
            <div className="mt-2 text-xs text-gray-400">
              Tempo médio de atendimento
            </div>
          </Card>
        </Col>
      </Row>

      {/* Taxa de Conclusão e Cancelamento */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card className="h-full">
            <div className="text-center">
              <TrophyOutlined className="text-4xl text-yellow-500 mb-2" />
              <Title level={5} className="!mb-1">Taxa de Conclusão</Title>
              <Text type="secondary" className="text-xs">Agendamentos finalizados com sucesso</Text>
            </div>
            <div className="flex items-center justify-center mt-4">
              <Progress
                type="circle"
                percent={Math.round(metrics.month.completionRate)}
                strokeColor={{
                  "0%": "#52c41a",
                  "100%": "#87d068",
                }}
                format={(percent) => (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{percent}%</div>
                  </div>
                )}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="h-full">
            <div className="text-center">
              <FireOutlined className="text-4xl text-red-500 mb-2" />
              <Title level={5} className="!mb-1">Taxa de Cancelamento</Title>
              <Text type="secondary" className="text-xs">Incluindo não comparecimentos</Text>
            </div>
            <div className="flex items-center justify-center mt-4">
              <Progress
                type="circle"
                percent={Math.round(metrics.month.cancellationRate)}
                strokeColor={{
                  "0%": "#ff4d4f",
                  "100%": "#ff7875",
                }}
                format={(percent) => (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{percent}%</div>
                  </div>
                )}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="h-full">
            <div className="text-center mb-4">
              <ToolOutlined className="text-4xl text-blue-500 mb-2" />
              <Title level={5} className="!mb-1">Serviços</Title>
              <Text type="secondary" className="text-xs">Status dos serviços cadastrados</Text>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{metrics.activeServices}</div>
                <div className="text-xs text-gray-500">Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">
                  {metrics.totalServices - metrics.activeServices}
                </div>
                <div className="text-xs text-gray-500">Inativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metrics.totalServices}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Serviços Populares e Horários de Pico */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <StarOutlined className="text-yellow-500" />
                <span>Serviços Mais Populares</span>
                <Tag color="blue">{metrics.topServices.length}</Tag>
              </div>
            }
          >
            {metrics.topServices.length === 0 ? (
              <Empty description="Nenhum dado disponível" />
            ) : (
              <Table
                dataSource={metrics.topServices}
                columns={topServicesColumns}
                rowKey="name"
                pagination={false}
                size="small"
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <ClockCircleOutlined className="text-purple-500" />
                <span>Horários de Pico</span>
              </div>
            }
            className="h-full"
          >
            {metrics.peakHours.length === 0 ? (
              <Empty description="Nenhum dado disponível" />
            ) : (
              <div className="space-y-4">
                {metrics.peakHours.map((peak, index) => (
                  <div
                    key={peak.hour}
                    className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        index === 0 
                          ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white" 
                          : "bg-gray-200 text-gray-600"
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <Text strong className="text-lg">{peak.hour}</Text>
                        <div className="text-xs text-gray-500">Horário popular</div>
                      </div>
                    </div>
                    <Tag color="purple" className="text-base">
                      {peak.count} agendamentos
                    </Tag>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Distribuição por Dia da Semana */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <BarChartOutlined className="text-blue-500" />
            <span>Agendamentos por Dia da Semana</span>
            <Tag color="cyan">Este Mês</Tag>
          </div>
        }
      >
        <Row gutter={[8, 8]}>
          {metrics.appointmentsByDayOfWeek.map((item) => {
            const maxCount = Math.max(...metrics.appointmentsByDayOfWeek.map((d) => d.count));
            const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            
            return (
              <Col xs={24} sm={12} md={8} lg={24/7} key={item.day}>
                <Tooltip title={`${item.count} agendamentos`}>
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-600 mb-2">
                      {item.day.slice(0, 3)}
                    </div>
                    <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-500"
                        style={{ height: `${percentage}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-white drop-shadow-lg">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  </div>
                </Tooltip>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* Dicas de Otimização */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <ThunderboltOutlined className="text-yellow-500" />
            <span>Insights Automáticos</span>
          </div>
        }
      >
        <Row gutter={[16, 16]}>
          {metrics.month.cancellationRate > 20 && (
            <Col xs={24} md={12}>
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-start gap-3">
                  <FallOutlined className="text-red-500 text-xl mt-1" />
                  <div>
                    <Text strong className="text-red-700">Alta taxa de cancelamento</Text>
                    <div className="text-sm text-red-600 mt-1">
                      Sua taxa de cancelamento está em {metrics.month.cancellationRate.toFixed(0)}%. 
                      Considere implementar lembretes automáticos ou política de confirmação.
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          )}
          {metrics.month.completionRate > 80 && (
            <Col xs={24} md={12}>
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-start gap-3">
                  <TrophyOutlined className="text-green-500 text-xl mt-1" />
                  <div>
                    <Text strong className="text-green-700">Excelente taxa de conclusão!</Text>
                    <div className="text-sm text-green-600 mt-1">
                      Parabéns! Sua taxa de conclusão de {metrics.month.completionRate.toFixed(0)}% 
                      está acima da média do setor.
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          )}
          {metrics.peakHours.length > 0 && (
            <Col xs={24} md={12}>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-3">
                  <ClockCircleOutlined className="text-blue-500 text-xl mt-1" />
                  <div>
                    <Text strong className="text-blue-700">Horário de pico identificado</Text>
                    <div className="text-sm text-blue-600 mt-1">
                      O horário das {metrics.peakHours[0]?.hour} é o mais movimentado. 
                      Considere ajustar a equipe ou bloquear menos horários neste período.
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          )}
          {metrics.month.avgTicket > 0 && (
            <Col xs={24} md={12}>
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                <div className="flex items-start gap-3">
                  <DollarOutlined className="text-purple-500 text-xl mt-1" />
                  <div>
                    <Text strong className="text-purple-700">Ticket médio</Text>
                    <div className="text-sm text-purple-600 mt-1">
                      Seu ticket médio é de R$ {metrics.month.avgTicket.toFixed(2)}. 
                      Ofereça combos ou serviços adicionais para aumentar esse valor.
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          )}
        </Row>
      </Card>
    </div>
  );
}
