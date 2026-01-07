"use client";

import React from "react";
import { Modal, Form, Input, InputNumber, Switch, Button, Select } from "antd";
import { ToolOutlined, FolderOutlined } from "@ant-design/icons";
import { Services } from "@/types/services";
import { ServiceGroup } from "@/types/serviceGroup";

const { TextArea } = Input;

interface ServiceFormValues {
  name: string;
  description?: string;
  price: number;
  duration: number;
  isActive: boolean;
  groupId?: string;
}

interface ServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
  editingService: Services | null;
  serviceGroups: ServiceGroup[];
  isLoadingGroups: boolean;
  isSubmitting: boolean;
  form: ReturnType<typeof Form.useForm<ServiceFormValues>>[0];
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  open,
  onClose,
  onSubmit,
  editingService,
  serviceGroups,
  isLoadingGroups,
  isSubmitting,
  form,
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <ToolOutlined className="text-blue-500" />
          {editingService ? "Editar Serviço" : "Novo Serviço"}
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        className="mt-4"
      >
        <Form.Item
          name="name"
          label="Nome do Serviço"
          rules={[{ required: true, message: "Informe o nome do serviço" }]}
        >
          <Input placeholder="Ex: Lavagem Completa" size="large" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descrição"
        >
          <TextArea 
            placeholder="Descreva o serviço..." 
            rows={3}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          name="groupId"
          label="Grupo de Serviço (opcional)"
        >
          <Select
            placeholder="Selecione um grupo..."
            allowClear
            size="large"
            options={serviceGroups.map(group => ({
              value: group.id,
              label: group.name,
            }))}
            loading={isLoadingGroups}
            notFoundContent={serviceGroups.length === 0 ? "Nenhum grupo cadastrado" : null}
          />
        </Form.Item>

        <Form.Item
          name="price"
          label="Preço (R$)"
          rules={[{ required: true, message: "Informe o preço" }]}
        >
          <InputNumber
            min={0}
            step={0.01}
            precision={2}
            placeholder="0,00"
            className="!w-full"
            prefix="R$"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="duration"
          label="Duração (minutos)"
          rules={[{ required: true, message: "Informe a duração" }]}
        >
          <InputNumber
            min={1}
            max={480}
            placeholder="30"
            className="!w-full"
            suffix="min"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Status"
          valuePropName="checked"
        >
          <Switch 
            checkedChildren="Ativo" 
            unCheckedChildren="Inativo"
          />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={isSubmitting}
          >
            {editingService ? "Salvar Alterações" : "Criar Serviço"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

// ============ GROUP MODAL ============

interface GroupFormValues {
  name: string;
  description?: string;
  isActive: boolean;
}

interface GroupModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: GroupFormValues) => Promise<void>;
  editingGroup: ServiceGroup | null;
  isSubmitting: boolean;
  form: ReturnType<typeof Form.useForm<GroupFormValues>>[0];
}

export const GroupModal: React.FC<GroupModalProps> = ({
  open,
  onClose,
  onSubmit,
  editingGroup,
  isSubmitting,
  form,
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FolderOutlined className="text-blue-500" />
          {editingGroup ? "Editar Grupo" : "Novo Grupo"}
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        className="mt-4"
      >
        <Form.Item
          name="name"
          label="Nome do Grupo"
          rules={[{ required: true, message: "Informe o nome do grupo" }]}
        >
          <Input placeholder="Ex: Lavagens, Polimentos, Extras..." size="large" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descrição (opcional)"
        >
          <TextArea 
            placeholder="Descreva o grupo..." 
            rows={2}
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Status"
          valuePropName="checked"
        >
          <Switch 
            checkedChildren="Ativo" 
            unCheckedChildren="Inativo"
          />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={isSubmitting}
          >
            {editingGroup ? "Salvar Alterações" : "Criar Grupo"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ServiceModal;
