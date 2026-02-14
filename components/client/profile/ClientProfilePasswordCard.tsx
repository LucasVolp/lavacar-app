"use client";

import React from "react";
import { Alert, Button, Card, Form, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";

interface PasswordFormValues {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface ClientProfilePasswordCardProps {
  form: FormInstance;
  isChangingPassword: boolean;
  requiresCurrentPassword: boolean;
  onFinish: (values: PasswordFormValues) => void;
}

export const ClientProfilePasswordCard: React.FC<ClientProfilePasswordCardProps> = ({
  form,
  isChangingPassword,
  requiresCurrentPassword,
  onFinish,
}) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2 font-semibold">
          <LockOutlined className="text-amber-500" />
          <span>Alteração de Senha</span>
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
        {!requiresCurrentPassword && (
          <Alert
            message="Atenção"
            description="Você fez login com uma conta social. Recomendamos definir uma senha para garantir acesso direto por e-mail."
            type="warning"
            showIcon
            className="mb-6 rounded-xl border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800 text-amber-800 dark:text-amber-200"
          />
        )}

        {requiresCurrentPassword && (
          <Form.Item
            name="currentPassword"
            label="Senha Atual"
            rules={[{ required: true, message: "Informe sua senha atual para continuar" }]}
          >
            <Input.Password size="large" className="rounded-xl" placeholder="••••••••" />
          </Form.Item>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="newPassword"
            label="Nova Senha"
            rules={[
              { required: true, message: "Informe a nova senha" },
              { min: 6, message: "Mínimo de 6 caracteres" },
            ]}
          >
            <Input.Password size="large" className="rounded-xl" placeholder="••••••••" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirmar Nova Senha"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Confirme a senha" },
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
            <Input.Password size="large" className="rounded-xl" placeholder="••••••••" />
          </Form.Item>
        </div>

        <div className="flex justify-end pt-2">
          <Form.Item shouldUpdate className="m-0">
            {() => (
              <Button
                htmlType="submit"
                loading={isChangingPassword}
                size="large"
                className="rounded-xl"
                disabled={
                  !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length).length
                }
              >
                {requiresCurrentPassword ? "Atualizar Senha" : "Definir Senha"}
              </Button>
            )}
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
};
