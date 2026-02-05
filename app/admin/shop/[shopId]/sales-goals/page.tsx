"use client";

import React, { useState } from "react";
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  InputNumber, 
  DatePicker, 
  Select, 
  message, 
  Tag, 
  Typography,
  Space,
  Popconfirm
} from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  RiseOutlined
} from "@ant-design/icons";
import { useShopSalesGoals, useCreateSalesGoal, useUpdateSalesGoal, useDeleteSalesGoal } from "@/hooks/useSalesGoals";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import dayjs from "dayjs";
import { SalesGoal, GoalPeriod } from "@/types/salesGoal";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function SalesGoalsPage() {
  const { shopId } = useShopAdmin();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SalesGoal | null>(null);
  const [form] = Form.useForm();

  const { data: salesGoalsData, isLoading } = useShopSalesGoals(shopId);
  const salesGoals = Array.isArray(salesGoalsData) ? salesGoalsData : [];

  const createGoal = useCreateSalesGoal();
  const updateGoal = useUpdateSalesGoal();
  const deleteGoal = useDeleteSalesGoal();

  const handleEdit = (goal: SalesGoal) => {
    setEditingGoal(goal);
    form.setFieldsValue({
      amount: goal.amount,
      period: goal.period,
      dates: [dayjs(goal.startDate), dayjs(goal.endDate)],
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGoal.mutateAsync(id);
      message.success("Meta removida com sucesso");
    } catch {
      message.error("Erro ao remover meta");
    }
  };

  interface SalesGoalFormValues {
    amount: number;
    period: GoalPeriod;
    dates: [dayjs.Dayjs, dayjs.Dayjs];
  }

  const handleFinish = async (values: SalesGoalFormValues) => {
    try {
      const payload = {
        amount: values.amount,
        period: values.period,
        startDate: values.dates[0].toISOString(),
        endDate: values.dates[1].toISOString(),
        shopId,
      };

      if (editingGoal) {
        await updateGoal.mutateAsync({ id: editingGoal.id, payload });
        message.success("Meta atualizada com sucesso");
      } else {
        await createGoal.mutateAsync(payload);
        message.success("Meta criada com sucesso");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingGoal(null);
    } catch {
      message.error("Erro ao salvar meta");
    }
  };

  const columns = [
    {
      title: "Período",
      key: "period",
      render: (record: SalesGoal) => (
        <Space direction="vertical" size={0}>
          <Tag color="blue">{record.period === 'MONTHLY' ? 'Mensal' : 'Semanal'}</Tag>
          <Text className="text-xs text-zinc-500">
             {dayjs(record.startDate).format("DD/MM/YYYY")} - {dayjs(record.endDate).format("DD/MM/YYYY")}
          </Text>
        </Space>
      ),
    },
    {
      title: "Meta (R$)",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => (
        <Text strong className="text-lg">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}
        </Text>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (record: SalesGoal) => {
        const now = dayjs();
        const start = dayjs(record.startDate);
        const end = dayjs(record.endDate);
        const isActive = now.isAfter(start) && now.isBefore(end);
        const isPast = now.isAfter(end);

        if (isActive) return <Tag color="green">Ativa</Tag>;
        if (isPast) return <Tag color="gray">Passada</Tag>;
        return <Tag color="orange">Futura</Tag>;
      },
    },
    {
      title: "Ações",
      key: "actions",
      render: (record: SalesGoal) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Tem certeza?" onConfirm={() => handleDelete(record.id)}>
             <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Title level={2} className="!mb-1">Metas de Vendas</Title>
          <Text type="secondary">Defina e acompanhe seus objetivos financeiros</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => {
            setEditingGoal(null);
            form.resetFields();
            // Default current month
            form.setFieldsValue({
                period: 'MONTHLY',
                dates: [dayjs().startOf('month'), dayjs().endOf('month')]
            });
            setIsModalVisible(true);
          }}
          className="bg-indigo-600 hover:!bg-indigo-500 shadow-lg shadow-indigo-900/20 border-0"
        >
          Nova Meta
        </Button>
      </div>

      <Card 
        bordered={false} 
        className="shadow-sm rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
      >
        <Table 
          columns={columns} 
          dataSource={salesGoals} 
          rowKey="id" 
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                    <RiseOutlined />
                </div>
                <span>{editingGoal ? "Editar Meta" : "Nova Meta de Vendas"}</span>
            </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="amount"
            label="Valor da Meta (R$)"
            rules={[{ required: true, message: "Informe o valor" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              parser={(value) => value!.replace(/\R\$\s?|(\.*)/g, "").replace(",", ".")}
              size="large"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
             <Form.Item
                name="period"
                label="Tipo"
                rules={[{ required: true }]}
              >
                <Select size="large">
                  <Select.Option value="MONTHLY">Mensal</Select.Option>
                  <Select.Option value="WEEKLY">Semanal</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="dates"
                label="Período de Vigência"
                rules={[{ required: true, message: "Selecione o período" }]}
              >
                <RangePicker size="large" format="DD/MM/YYYY" style={{ width: '100%' }} />
              </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
             <Button onClick={() => setIsModalVisible(false)}>Cancelar</Button>
             <Button type="primary" htmlType="submit" className="bg-indigo-600 hover:!bg-indigo-500">
               Salvar Meta
             </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
