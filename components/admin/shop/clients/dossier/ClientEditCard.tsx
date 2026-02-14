"use client";

import React, { useEffect } from "react";
import { Button, Card, Form, Input, Spin, Typography, message } from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useUpdateShopClient } from "@/hooks/useShopClients";
import { formatPhone } from "@/utils/formatters";
import type { ShopClient, UpdateShopClientPayload } from "@/types/shopClient";

const { Text } = Typography;
const { TextArea } = Input;

interface ClientEditCardProps {
  client: ShopClient;
  open: boolean;
  onClose: () => void;
}

interface EditFormValues {
  customName: string;
  customPhone: string;
  customEmail: string;
  notes: string;
}

export const ClientEditCard: React.FC<ClientEditCardProps> = ({
  client,
  open,
  onClose,
}) => {
  const [form] = Form.useForm<EditFormValues>();
  const updateClient = useUpdateShopClient();
  const user = client.user;

  useEffect(() => {
    if (open && client) {
      form.setFieldsValue({
        customName: client.customName || "",
        customPhone: formatPhone(client.customPhone || ""),
        customEmail: client.customEmail || "",
        notes: client.notes || "",
      });
    }
  }, [client, open, form]);

  if (!open || !user) return null;

  const originalName = `${user.firstName} ${user.lastName || ""}`.trim();
  const originalPhone = formatPhone(user.phone || "");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    form.setFieldValue("customPhone", formatted);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload: UpdateShopClientPayload = {};

      if (values.customName.trim()) {
        payload.customName = values.customName.trim();
      } else if (client.customName) {
        payload.customName = "";
      }

      if (values.customPhone.trim()) {
        payload.customPhone = values.customPhone.replace(/\D/g, "").trim();
      } else if (client.customPhone) {
        payload.customPhone = "";
      }

      if (values.customEmail.trim()) {
        payload.customEmail = values.customEmail.trim();
      } else if (client.customEmail) {
        payload.customEmail = "";
      }

      if (values.notes.trim()) {
        payload.notes = values.notes.trim();
      } else if (client.notes) {
        payload.notes = "";
      }

      await updateClient.mutateAsync({ id: client.id, payload });
      message.success("Dados do cliente atualizados com sucesso");
      onClose();
    } catch {
      message.error("Erro ao atualizar dados do cliente");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Card
      className="!rounded-2xl !shadow-md !border-indigo-200 dark:!border-indigo-800 !bg-indigo-50/30 dark:!bg-indigo-900/10"
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <EditOutlined className="text-indigo-500" />
          </div>
          <span className="font-semibold dark:text-white">Editar Informações do Cliente</span>
        </div>
      }
      extra={
        <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400">
          <InfoCircleOutlined />
          <span className="hidden sm:inline">Dados personalizados para este estabelecimento</span>
        </div>
      }
    >
      <Spin spinning={updateClient.isPending}>
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item
              name="customName"
              label={
                <span className="text-zinc-700 dark:text-zinc-300">
                  Nome personalizado
                  {user.firstName && (
                    <Text type="secondary" className="ml-2 text-xs dark:text-zinc-500">
                      Original: {originalName}
                    </Text>
                  )}
                </span>
              }
            >
              <Input
                prefix={<UserOutlined className="text-zinc-400" />}
                placeholder="Deixe vazio para usar o nome original"
                allowClear
                className="!rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="customPhone"
              label={
                <span className="text-zinc-700 dark:text-zinc-300">
                  Telefone personalizado
                  {user.phone && (
                    <Text type="secondary" className="ml-2 text-xs dark:text-zinc-500">
                      Original: {originalPhone}
                    </Text>
                  )}
                </span>
              }
            >
              <Input
                prefix={<PhoneOutlined className="text-zinc-400" />}
                placeholder="(00) 00000-0000"
                allowClear
                onChange={handlePhoneChange}
                maxLength={15}
                className="!rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="customEmail"
              label={
                <span className="text-zinc-700 dark:text-zinc-300">
                  Email personalizado
                  {user.email && (
                    <Text type="secondary" className="ml-2 text-xs dark:text-zinc-500">
                      Original: {user.email}
                    </Text>
                  )}
                </span>
              }
              rules={[{ type: "email", message: "Email inválido" }]}
            >
              <Input
                prefix={<MailOutlined className="text-zinc-400" />}
                placeholder="email@exemplo.com"
                allowClear
                className="!rounded-lg"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="notes"
            label={<span className="text-zinc-700 dark:text-zinc-300">Observações internas</span>}
          >
            <TextArea
              placeholder="Anotações sobre o cliente (visível apenas para a equipe)"
              rows={3}
              showCount
              maxLength={500}
              className="!rounded-lg"
            />
          </Form.Item>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              icon={<CloseOutlined />}
              onClick={handleCancel}
              disabled={updateClient.isPending}
              className="!rounded-lg dark:border-zinc-700 dark:text-zinc-300"
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={updateClient.isPending}
              className="!rounded-lg !px-6"
            >
              Salvar Alterações
            </Button>
          </div>
        </Form>
      </Spin>
    </Card>
  );
};
