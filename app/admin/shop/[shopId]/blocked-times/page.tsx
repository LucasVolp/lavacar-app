"use client";

import React, { useState } from "react";
import { 
  Card, 
  Typography, 
  Empty, 
  Button, 
  Table, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  TimePicker, 
  Radio, 
  message, 
  Popconfirm,
  Row,
  Col,
  Statistic,
  Tooltip,
  Spin,
  Alert,
} from "antd";
import { 
  StopOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { 
  useBlockedTimesByShop, 
  useCreateBlockedTime, 
  useUpdateBlockedTime, 
  useDeleteBlockedTime 
} from "@/hooks/useBlockedTimes";
import { BlockedTime, CreateBlockedTimePayload } from "@/types/blockedTime";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

/**
 * Bloqueios de Horário do Shop - CRUD Completo
 */
export default function BlockedTimesPage() {
  const { shopId } = useShopAdmin();
  const { data: blockedTimes = [], isLoading } = useBlockedTimesByShop(shopId);
  const createBlockedTime = useCreateBlockedTime();
  const updateBlockedTime = useUpdateBlockedTime();
  const deleteBlockedTime = useDeleteBlockedTime();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlockedTime, setEditingBlockedTime] = useState<BlockedTime | null>(null);
  const [form] = Form.useForm();

  const blockType = Form.useWatch("type", form);

  // Estatísticas
  const today = dayjs().startOf("day");
  const stats = {
    total: blockedTimes.length,
    future: blockedTimes.filter(b => dayjs(b.date).isAfter(today) || dayjs(b.date).isSame(today)).length,
    past: blockedTimes.filter(b => dayjs(b.date).isBefore(today)).length,
    fullDay: blockedTimes.filter(b => b.type === "FULL_DAY").length,
  };

  // Ordenar por data (futuros primeiro)
  const sortedBlockedTimes = [...blockedTimes].sort((a, b) => 
    dayjs(b.date).unix() - dayjs(a.date).unix()
  );

  const handleOpenModal = (blockedTime?: BlockedTime) => {
    if (blockedTime) {
      setEditingBlockedTime(blockedTime);
      form.setFieldsValue({
        type: blockedTime.type,
        date: dayjs(blockedTime.date),
        startTime: blockedTime.startTime ? dayjs(blockedTime.startTime, "HH:mm") : null,
        endTime: blockedTime.endTime ? dayjs(blockedTime.endTime, "HH:mm") : null,
        reason: blockedTime.reason,
      });
    } else {
      setEditingBlockedTime(null);
      form.resetFields();
      form.setFieldsValue({ type: "FULL_DAY" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlockedTime(null);
    form.resetFields();
  };

  const handleSubmit = async (values: {
    type: "FULL_DAY" | "PARTIAL";
    date: dayjs.Dayjs;
    startTime?: dayjs.Dayjs;
    endTime?: dayjs.Dayjs;
    reason?: string;
  }) => {
    try {
      const payload = {
        type: values.type,
        date: values.date.format("YYYY-MM-DD"),
        startTime: values.type === "PARTIAL" && values.startTime 
          ? values.startTime.format("HH:mm") 
          : undefined,
        endTime: values.type === "PARTIAL" && values.endTime 
          ? values.endTime.format("HH:mm") 
          : undefined,
        reason: values.reason,
      };

      if (editingBlockedTime) {
        await updateBlockedTime.mutateAsync({
          id: editingBlockedTime.id,
          payload,
        });
        message.success("Bloqueio atualizado com sucesso!");
      } else {
        const createPayload: CreateBlockedTimePayload = {
          ...payload,
          shopId,
        };
        await createBlockedTime.mutateAsync(createPayload);
        message.success("Bloqueio criado com sucesso!");
      }
      handleCloseModal();
    } catch {
      message.error("Erro ao salvar bloqueio. Tente novamente.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBlockedTime.mutateAsync(id);
      message.success("Bloqueio excluído com sucesso!");
    } catch {
      message.error("Erro ao excluir bloqueio. Tente novamente.");
    }
  };

  const columns = [
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
      width: 140,
      render: (date: string) => {
        const d = dayjs(date);
        const isPast = d.isBefore(today);
        return (
          <div className={isPast ? "text-gray-400" : ""}>
            <Text strong className={isPast ? "text-gray-400" : ""}>
              {d.format("DD/MM/YYYY")}
            </Text>
            <div className="text-xs text-gray-500">
              {d.format("dddd")}
            </div>
          </div>
        );
      },
      sorter: (a: BlockedTime, b: BlockedTime) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      width: 130,
      render: (type: string) => (
        <Tag 
          color={type === "FULL_DAY" ? "red" : "orange"}
          icon={type === "FULL_DAY" ? <StopOutlined /> : <ClockCircleOutlined />}
        >
          {type === "FULL_DAY" ? "Dia Inteiro" : "Parcial"}
        </Tag>
      ),
      filters: [
        { text: "Dia Inteiro", value: "FULL_DAY" },
        { text: "Parcial", value: "PARTIAL" },
      ],
      onFilter: (value: React.Key | boolean, record: BlockedTime) => record.type === value,
    },
    {
      title: "Horário",
      key: "time",
      width: 150,
      render: (_: unknown, record: BlockedTime) => {
        if (record.type === "FULL_DAY") {
          return <Text type="secondary">Todo o dia</Text>;
        }
        return (
          <Space>
            <ClockCircleOutlined className="text-orange-500" />
            <span>{record.startTime} - {record.endTime}</span>
          </Space>
        );
      },
    },
    {
      title: "Motivo",
      dataIndex: "reason",
      key: "reason",
      render: (reason: string) => (
        reason ? (
          <Tooltip title={reason}>
            <Text className="line-clamp-1 max-w-[200px]">{reason}</Text>
          </Tooltip>
        ) : (
          <Text type="secondary" italic>Não informado</Text>
        )
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 100,
      render: (_: unknown, record: BlockedTime) => {
        const d = dayjs(record.date);
        if (d.isBefore(today)) {
          return <Tag color="default">Passado</Tag>;
        }
        if (d.isSame(today, "day")) {
          return <Tag color="blue">Hoje</Tag>;
        }
        return <Tag color="green">Futuro</Tag>;
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: 100,
      render: (_: unknown, record: BlockedTime) => (
        <Space>
          <Tooltip title="Editar">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleOpenModal(record)}
              className="text-blue-500 hover:text-blue-600"
            />
          </Tooltip>
          <Popconfirm
            title="Excluir bloqueio"
            description="Tem certeza que deseja excluir este bloqueio?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Excluir">
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando bloqueios..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={3} className="!mb-1 flex items-center gap-2">
            <StopOutlined className="text-red-500" />
            Bloqueios de Horário
          </Title>
          <Text type="secondary">
            Gerencie os dias e horários em que o estabelecimento não atenderá
          </Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          size="large"
          onClick={() => handleOpenModal()}
          danger
        >
          Novo Bloqueio
        </Button>
      </div>

      {/* Estatísticas */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <Statistic 
              title="Total" 
              value={stats.total} 
              prefix={<StopOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <Statistic 
              title="Futuros" 
              value={stats.future} 
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <Statistic 
              title="Passados" 
              value={stats.past} 
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#8c8c8c" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <Statistic 
              title="Dia Inteiro" 
              value={stats.fullDay} 
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabela */}
      <Card>
        {sortedBlockedTimes.length === 0 ? (
          <Empty
            description="Nenhum bloqueio cadastrado"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" danger onClick={() => handleOpenModal()}>
              Criar primeiro bloqueio
            </Button>
          </Empty>
        ) : (
          <Table
            dataSource={sortedBlockedTimes}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `${total} bloqueio(s)`,
            }}
            rowClassName={(record) => 
              dayjs(record.date).isBefore(today) ? "opacity-50" : ""
            }
          />
        )}
      </Card>

      {/* Modal de Criação/Edição */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <StopOutlined className="text-red-500" />
            {editingBlockedTime ? "Editar Bloqueio" : "Novo Bloqueio"}
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnHidden
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
          initialValues={{ type: "FULL_DAY" }}
        >
          <Form.Item
            name="type"
            label="Tipo de Bloqueio"
            rules={[{ required: true, message: "Selecione o tipo" }]}
          >
            <Radio.Group>
              <Radio.Button value="FULL_DAY">
                <Space>
                  <StopOutlined />
                  Dia Inteiro
                </Space>
              </Radio.Button>
              <Radio.Button value="PARTIAL">
                <Space>
                  <ClockCircleOutlined />
                  Parcial
                </Space>
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="date"
            label="Data"
            rules={[{ required: true, message: "Selecione a data" }]}
          >
            <DatePicker 
              className="w-full"
              format="DD/MM/YYYY"
              placeholder="Selecione a data"
            />
          </Form.Item>

          {blockType === "PARTIAL" && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startTime"
                  label="Início"
                  rules={[{ required: blockType === "PARTIAL", message: "Informe o horário" }]}
                >
                  <TimePicker 
                    format="HH:mm"
                    className="w-full"
                    placeholder="00:00"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="endTime"
                  label="Fim"
                  rules={[{ required: blockType === "PARTIAL", message: "Informe o horário" }]}
                >
                  <TimePicker 
                    format="HH:mm"
                    className="w-full"
                    placeholder="00:00"
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Form.Item
            name="reason"
            label="Motivo (opcional)"
          >
            <TextArea 
              placeholder="Ex: Feriado, Manutenção, Evento..." 
              rows={2}
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Alert
            message="Os clientes não poderão agendar no período bloqueado"
            type="warning"
            showIcon
            className="mb-4"
          />

          <div className="flex justify-end gap-2">
            <Button onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              danger
              loading={createBlockedTime.isPending || updateBlockedTime.isPending}
            >
              {editingBlockedTime ? "Salvar Alterações" : "Criar Bloqueio"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
