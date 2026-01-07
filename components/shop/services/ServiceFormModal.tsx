"use client";

import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Space,
} from "antd";
import type { Service } from "./ServiceCard";

const { TextArea } = Input;

interface ServiceFormModalProps {
  open: boolean;
  service?: Service | null;
  onSubmit: (values: Omit<Service, "id">) => void;
  onCancel: () => void;
  loading?: boolean;
}

const categories = [
  { value: "lavagem", label: "Lavagem" },
  { value: "polimento", label: "Polimento" },
  { value: "higienizacao", label: "Higienização" },
  { value: "protecao", label: "Proteção" },
  { value: "outros", label: "Outros" },
];

export const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  open,
  service,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const isEditing = !!service;

  useEffect(() => {
    if (open && service) {
      form.setFieldsValue(service);
    } else if (open) {
      form.resetFields();
      form.setFieldsValue({ isActive: true });
    }
  }, [open, service, form]);

  const handleFinish = (values: Omit<Service, "id">) => {
    onSubmit(values);
  };

  return (
    <Modal
      title={isEditing ? "Editar Serviço" : "Novo Serviço"}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="pt-4"
      >
        <Form.Item
          name="name"
          label="Nome do Serviço"
          rules={[{ required: true, message: "Informe o nome do serviço" }]}
        >
          <Input placeholder="Ex: Lavagem Completa" />
        </Form.Item>

        <Form.Item name="description" label="Descrição">
          <TextArea
            rows={3}
            placeholder="Descreva o que inclui este serviço..."
          />
        </Form.Item>

        <Form.Item name="category" label="Categoria">
          <Select
            placeholder="Selecione uma categoria"
            options={categories}
            allowClear
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="price"
            label="Preço (R$)"
            rules={[{ required: true, message: "Informe o preço" }]}
          >
            <InputNumber
              min={0}
              precision={2}
              placeholder="0,00"
              className="w-full"
              formatter={(value) => `${value}`.replace(".", ",")}
              parser={(value) => Number(value?.replace(",", ".") || 0) as unknown as 0}
            />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duração (minutos)"
            rules={[{ required: true, message: "Informe a duração" }]}
          >
            <InputNumber
              min={5}
              step={5}
              placeholder="30"
              className="w-full"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="isActive"
          label="Serviço Ativo"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <div className="flex justify-end gap-2 pt-4 border-t border-base-200">
          <Space>
            <Button onClick={onCancel}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? "Salvar Alterações" : "Criar Serviço"}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default ServiceFormModal;
