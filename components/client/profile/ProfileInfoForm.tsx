"use client";

import React from "react";
import { Card, Form, Input, Typography, Upload, Avatar, Button } from "antd";
import { UserOutlined, CameraOutlined } from "@ant-design/icons";

const { Title } = Typography;

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  avatarUrl?: string;
}

interface ProfileInfoFormProps {
  initialValues?: UserProfile;
  onChange?: (values: UserProfile) => void;
}

export const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({
  initialValues,
  onChange,
}) => {
  const [form] = Form.useForm();

  const handleValuesChange = (_: unknown, allValues: UserProfile) => {
    onChange?.(allValues);
  };

  return (
    <Card className="border-base-200">
      <div className="flex items-center gap-2 mb-4">
        <UserOutlined className="text-info" />
        <Title level={5} className="!mb-0">
          Informações Pessoais
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onValuesChange={handleValuesChange}
      >
        {/* Avatar Upload */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Avatar
              size={100}
              icon={<UserOutlined />}
              src={initialValues?.avatarUrl}
              className="bg-info"
            />
            <Upload showUploadList={false} accept="image/*">
              <Button
                type="primary"
                shape="circle"
                icon={<CameraOutlined />}
                size="small"
                className="absolute bottom-0 right-0"
              />
            </Upload>
          </div>
        </div>

        <Form.Item
          name="name"
          label="Nome Completo"
          rules={[{ required: true, message: "Informe seu nome" }]}
        >
          <Input placeholder="Seu nome completo" />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              { required: true, message: "Informe seu e-mail" },
              { type: "email", message: "E-mail inválido" },
            ]}
          >
            <Input placeholder="seu@email.com" type="email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefone/WhatsApp"
            rules={[{ required: true, message: "Informe seu telefone" }]}
          >
            <Input placeholder="(11) 99999-9999" />
          </Form.Item>
        </div>

        <Form.Item name="cpf" label="CPF">
          <Input placeholder="000.000.000-00" />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProfileInfoForm;
