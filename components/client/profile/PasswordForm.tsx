"use client";

import React from "react";
import { Card, Form, Input, Typography, Button, Space, Divider } from "antd";
import { LockOutlined, KeyOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface PasswordFormProps {
  onChangePassword?: (currentPassword: string, newPassword: string) => void;
  loading?: boolean;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({
  onChangePassword,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: { currentPassword: string; newPassword: string }) => {
    onChangePassword?.(values.currentPassword, values.newPassword);
    form.resetFields();
  };

  return (
    <Card className="border-base-200">
      <div className="flex items-center gap-2 mb-4">
        <LockOutlined className="text-warning" />
        <Title level={5} className="!mb-0">
          Alterar Senha
        </Title>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="currentPassword"
          label="Senha Atual"
          rules={[{ required: true, message: "Informe sua senha atual" }]}
        >
          <Input.Password
            prefix={<KeyOutlined className="text-base-content/40" />}
            placeholder="Sua senha atual"
          />
        </Form.Item>

        <Divider className="my-4" />

        <Form.Item
          name="newPassword"
          label="Nova Senha"
          rules={[
            { required: true, message: "Informe a nova senha" },
            { min: 6, message: "Mínimo de 6 caracteres" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-base-content/40" />}
            placeholder="Nova senha"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirmar Nova Senha"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Confirme a nova senha" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("As senhas não coincidem"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-base-content/40" />}
            placeholder="Confirme a nova senha"
          />
        </Form.Item>

        <div className="flex justify-end pt-2">
          <Button type="primary" htmlType="submit" loading={loading}>
            Alterar Senha
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default PasswordForm;
