"use client";

import React from "react";
import { Modal, Form, Input, InputNumber, Switch, Button, Select, Image, Upload, message } from "antd";
import { ToolOutlined, FolderOutlined, UploadOutlined } from "@ant-design/icons";
import { Services } from "@/types/services";
import { ServiceGroup } from "@/types/serviceGroup";
import { serviceService } from "@/services/service";

const { TextArea } = Input;

interface ServiceFormValues {
  name: string;
  description?: string;
  photoUrl?: string;
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

export const ServiceFormModal: React.FC<ServiceModalProps> = ({
  open,
  onClose,
  onSubmit,
  editingService,
  serviceGroups,
  isLoadingGroups,
  isSubmitting,
  form,
}) => {
  const watchedPhotoUrl = Form.useWatch("photoUrl", form);
  const photoPreview = React.useMemo(() => {
    const candidate = (watchedPhotoUrl ?? editingService?.photoUrl ?? "").trim();
    if (!candidate) return null;
    try {
      new URL(candidate);
      return candidate;
    } catch {
      return null;
    }
  }, [watchedPhotoUrl, editingService?.photoUrl]);

  const handlePhotoUpload = async (file: File) => {
    if (!editingService?.id) {
      message.info("Salve o serviço primeiro para habilitar upload de capa.");
      return false;
    }

    try {
      const { url } = await serviceService.uploadPhoto(editingService.id, file);
      form.setFieldValue("photoUrl", url);
      message.success("Capa enviada com sucesso");
    } catch {
      message.error("Erro ao enviar capa do serviço");
    }
    return false;
  };

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

        <Form.Item name="photoUrl" hidden>
          <Input />
        </Form.Item>

        <div className="mb-4">
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={handlePhotoUpload}
          >
            <Button icon={<UploadOutlined />}>
              Selecionar Capa do Serviço
            </Button>
          </Upload>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Envie uma imagem para a capa. Formatos aceitos: JPG, PNG, WEBP.
          </p>
        </div>

        {photoPreview && (
          <div className="mb-4 flex justify-center">
            <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm">
              <Image
                src={photoPreview}
                alt="Preview"
                width={200}
                height={120}
                className="object-cover"
                fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjY2NjIiBmb250LXNpemU9IjEyIj5JbWFnZW0gaW52w6FsaWRhPC90ZXh0Pjwvc3ZnPg=="
              />
            </div>
          </div>
        )}

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

export const GroupFormModal: React.FC<GroupModalProps> = ({
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
