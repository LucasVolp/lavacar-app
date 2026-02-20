"use client";

import React from "react";
import {
  Alert,
  Button,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Switch,
  Typography,
  Upload,
  message,
} from "antd";
import {
  FolderOutlined,
  InfoCircleOutlined,
  ShopOutlined,
  ToolOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Services } from "@/types/services";
import { ServiceGroup } from "@/types/serviceGroup";
import { serviceService } from "@/services/service";
import { ServiceVariantFormValue, ServiceVariantsEditor } from "./ServiceVariantsEditor";

const { Text, Title } = Typography;
const { TextArea } = Input;

export interface ServiceFormValues {
  name: string;
  description?: string;
  photoUrl?: string;
  price: number;
  duration: number;
  isActive: boolean;
  isBudgetOnly: boolean;
  hasVariants: boolean;
  groupId?: string;
  variants?: ServiceVariantFormValue[];
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
  const hasVariants = Form.useWatch("hasVariants", form);
  const isBudgetOnly = Form.useWatch("isBudgetOnly", form);

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
          <ToolOutlined className="text-indigo-500" />
          {editingService ? "Editar Serviço" : "Novo Serviço"}
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={760}
      styles={{ body: { paddingTop: 16 } }}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit} className="space-y-5">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <Title level={5} className="!mb-4 dark:!text-zinc-100">
            Informações do Serviço
          </Title>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Nome do Serviço"
              rules={[{ required: true, message: "Informe o nome do serviço" }]}
              className="md:col-span-2 !mb-0"
            >
              <Input placeholder="Ex: Lavagem Completa" size="large" />
            </Form.Item>

            <Form.Item name="description" label="Descrição" className="md:col-span-2 !mb-0">
              <TextArea placeholder="Descreva o serviço..." rows={3} showCount maxLength={500} />
            </Form.Item>

            <Form.Item name="groupId" label="Grupo (opcional)" className="!mb-0">
              <Select
                placeholder="Selecione um grupo"
                allowClear
                size="large"
                options={serviceGroups.map((group) => ({
                  value: group.id,
                  label: group.name,
                }))}
                loading={isLoadingGroups}
                notFoundContent={serviceGroups.length === 0 ? "Nenhum grupo cadastrado" : null}
              />
            </Form.Item>

            <Form.Item name="isActive" label="Status" valuePropName="checked" className="!mb-0">
              <Switch checkedChildren="Ativo" unCheckedChildren="Inativo" />
            </Form.Item>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <Title level={5} className="!mb-0 dark:!text-zinc-100">
                Precificação e Duração
              </Title>
              <Text className="text-zinc-500 dark:text-zinc-400 text-sm">
                Defina preço fixo, orçamento apenas ou variações por porte.
              </Text>
            </div>
            <ShopOutlined className="text-zinc-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <Form.Item name="isBudgetOnly" label="Somente orçamento" valuePropName="checked" className="!mb-0">
              <Switch checkedChildren="Sim" unCheckedChildren="Não" />
            </Form.Item>

            <Form.Item name="hasVariants" label="Usar variações por porte" valuePropName="checked" className="!mb-0">
              <Switch checkedChildren="Ativo" unCheckedChildren="Desativado" />
            </Form.Item>
          </div>

          {isBudgetOnly && (
            <Alert
              showIcon
              type="warning"
              icon={<InfoCircleOutlined className="dark:!text-amber-400" />}
              className="mb-4 dark:!bg-amber-900/20 dark:!border-amber-800"
              message={<span className="text-zinc-900 dark:text-zinc-100">Este serviço será marcado como orçamento</span>}
              description={
                <span className="text-zinc-700 dark:text-zinc-300">
                  Sem valor fechado no catálogo. O preço final será definido após avaliação.
                </span>
              }
            />
          )}

          {!hasVariants && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="price"
                label="Preço base"
                rules={[{ required: true, message: "Informe o preço" }]}
                className="!mb-0"
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  precision={2}
                  placeholder="0,00"
                  className="!w-full"
                  prefix="R$"
                  size="large"
                  disabled={isBudgetOnly}
                />
              </Form.Item>

              <Form.Item
                name="duration"
                label="Duração base"
                rules={[{ required: true, message: "Informe a duração" }]}
                className="!mb-0"
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
            </div>
          )}

          {hasVariants && (
            <div className="space-y-4">
              <Divider className="!my-3" />
              <ServiceVariantsEditor disabled={isBudgetOnly} form={form} />
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <Title level={5} className="!mb-4 dark:!text-zinc-100">
            Capa do Serviço
          </Title>

          <Form.Item name="photoUrl" hidden>
            <Input />
          </Form.Item>

          <Space direction="vertical" size={8} className="w-full">
            <Upload accept="image/*" showUploadList={false} beforeUpload={handlePhotoUpload}>
              <Button icon={<UploadOutlined />}>Selecionar imagem</Button>
            </Upload>
            <Text className="text-xs text-zinc-500 dark:text-zinc-400">
              Para novos serviços, salve primeiro e depois envie a capa.
            </Text>
          </Space>

          {photoPreview && (
            <div className="mt-4 flex justify-center">
              <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <Image
                  src={photoPreview}
                  alt="Preview"
                  width={240}
                  height={140}
                  className="object-cover"
                  fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjE0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI2Y0ZjRmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYTVhNWIxIiBmb250LXNpemU9IjEyIj5JbWFnZW0gaW52w6FsaWRhPC90ZXh0Pjwvc3ZnPg=="
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {editingService ? "Salvar Alterações" : "Criar Serviço"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

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
          <FolderOutlined className="text-indigo-500" />
          {editingGroup ? "Editar Grupo" : "Novo Grupo"}
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={560}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit} className="mt-4 space-y-2">
        <Form.Item
          name="name"
          label="Nome do Grupo"
          rules={[{ required: true, message: "Informe o nome do grupo" }]}
        >
          <Input placeholder="Ex: Lavagens, Polimentos, Extras" size="large" />
        </Form.Item>

        <Form.Item name="description" label="Descrição (opcional)">
          <TextArea placeholder="Descreva o grupo" rows={2} showCount maxLength={200} />
        </Form.Item>

        <Form.Item name="isActive" label="Status" valuePropName="checked">
          <Switch checkedChildren="Ativo" unCheckedChildren="Inativo" />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {editingGroup ? "Salvar Alterações" : "Criar Grupo"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
