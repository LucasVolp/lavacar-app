"use client";

import React from "react";
import { Button, Card, Form, Input } from "antd";
import { IdcardOutlined, MailOutlined, SaveOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface ClientProfileInfoCardProps {
  form: FormInstance;
  loading: boolean;
  onFinish: (values: ProfileFormValues) => void;
}

export const ClientProfileInfoCard: React.FC<ClientProfileInfoCardProps> = ({
  form,
  loading,
  onFinish,
}) => {
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
            <Form.Item name="email" label="E-mail">
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
                placeholder="(00) 00000-0000"
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
    </div>

  );
};
