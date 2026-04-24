"use client";

import React, { useState } from "react";
import { Alert, Button, Card, Form, Input, Modal, Tooltip } from "antd";
import {
  EditOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  SaveOutlined,
  SendOutlined,
} from "@ant-design/icons";
import type { FormInstance } from "antd";
import { maskPhone } from "@/lib/masks";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface EmailChangeFormValues {
  newEmail: string;
}

interface ClientProfileInfoCardProps {
  form: FormInstance;
  loading: boolean;
  currentEmail?: string;
  isRequestingEmailChange: boolean;
  pendingEmailChange: string | null;
  onFinish: (values: ProfileFormValues) => void;
  onRequestEmailChange: (newEmail: string) => Promise<boolean>;
  onDismissPendingEmailChange?: () => void;
}

export const ClientProfileInfoCard: React.FC<ClientProfileInfoCardProps> = ({
  form,
  loading,
  currentEmail,
  isRequestingEmailChange,
  pendingEmailChange,
  onFinish,
  onRequestEmailChange,
  onDismissPendingEmailChange,
}) => {
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailForm] = Form.useForm<EmailChangeFormValues>();
  const [emailChangeError, setEmailChangeError] = useState<string | null>(null);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue("phone", maskPhone(event.target.value));
  };

  const openEmailModal = () => {
    setEmailChangeError(null);
    emailForm.resetFields();
    setEmailModalOpen(true);
  };

  const closeEmailModal = () => {
    setEmailModalOpen(false);
    setEmailChangeError(null);
    emailForm.resetFields();
  };

  const handleEmailSubmit = async (values: EmailChangeFormValues) => {
    const normalized = values.newEmail.trim().toLowerCase();
    if (currentEmail && normalized === currentEmail.toLowerCase()) {
      setEmailChangeError("O novo e-mail deve ser diferente do atual.");
      return;
    }
    setEmailChangeError(null);
    const ok = await onRequestEmailChange(normalized);
    if (ok) {
      closeEmailModal();
    }
  };

  return (
    <div className="space-y-4">
      <Card
        title={
          <div className="flex items-center gap-2 font-semibold">
            <IdcardOutlined className="text-indigo-500" />
            <span>Dados de Identificação</span>
          </div>
        }
        className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900"
      >
        {pendingEmailChange && (
          <Alert
            type="info"
            showIcon
            closable
            onClose={onDismissPendingEmailChange}
            className="mb-4 rounded-xl"
            message="Confirmação pendente"
            description={
              <span>
                Enviamos um link de confirmação para{" "}
                <strong className="break-all">{pendingEmailChange}</strong>. A troca só será concluída após você abrir o e-mail e confirmar. O link expira em 60 minutos.
              </span>
            }
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="firstName"
              label="Nome"
              rules={[{ required: true, message: "Obrigatório" }]}
            >
              <Input size="large" className="rounded-xl" />
            </Form.Item>
            <Form.Item name="lastName" label="Sobrenome">
              <Input size="large" className="rounded-xl" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="email"
              label={
                <div className="flex items-center gap-1.5">
                  <span>E-mail</span>
                  <Tooltip title="Alterar e-mail (requer confirmação)">
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={openEmailModal}
                      className="!h-6 !w-6 !p-0 text-zinc-500 hover:!text-indigo-600"
                      aria-label="Solicitar alteração de e-mail"
                    />
                  </Tooltip>
                </div>
              }
            >
              <Input
                size="large"
                className="rounded-xl"
                prefix={<MailOutlined className="text-zinc-400" />}
                disabled
              />
            </Form.Item>
            <Form.Item name="phone" label="Celular / WhatsApp">
              <Input
                size="large"
                className="rounded-xl"
                prefix={<PhoneOutlined className="text-zinc-400" />}
                placeholder="(00) 00000-0000"
                maxLength={15}
                onChange={handlePhoneChange}
              />
            </Form.Item>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              size="large"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
            >
              Salvar Alterações
            </Button>
          </div>
        </Form>
      </Card>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <MailOutlined className="text-indigo-500" />
            <span>Alterar e-mail da conta</span>
          </div>
        }
        open={emailModalOpen}
        onCancel={closeEmailModal}
        footer={null}
        destroyOnHidden
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-[1.7]">
            Enviaremos um link de confirmação para o <strong>novo e-mail</strong>. A troca só será aplicada depois que você confirmar pelo link (expira em 60 minutos).
          </p>

          {currentEmail && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-3 text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">E-mail atual:</span>{" "}
              <span className="font-medium text-zinc-800 dark:text-zinc-100 break-all">{currentEmail}</span>
            </div>
          )}

          {emailChangeError && (
            <Alert
              type="error"
              message={emailChangeError}
              showIcon
              closable
              onClose={() => setEmailChangeError(null)}
              className="rounded-xl"
            />
          )}

          <Form
            form={emailForm}
            layout="vertical"
            onFinish={handleEmailSubmit}
            requiredMark={false}
          >
            <Form.Item
              name="newEmail"
              label="Novo e-mail"
              rules={[
                { required: true, message: "Informe o novo e-mail" },
                { type: "email", message: "E-mail inválido" },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined className="text-zinc-400" />}
                placeholder="novo@email.com"
                autoComplete="email"
                className="rounded-xl"
              />
            </Form.Item>

            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={closeEmailModal} size="large" className="rounded-xl">
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                loading={isRequestingEmailChange}
                size="large"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
              >
                Enviar link de confirmação
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};
