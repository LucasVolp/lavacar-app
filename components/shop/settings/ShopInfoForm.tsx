"use client";

import React from "react";
import { Card, Form, Input, Typography, Upload, Avatar, Button } from "antd";
import { ShopOutlined, CameraOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;

export interface ShopInfo {
  name: string;
  description?: string;
  phone: string;
  email?: string;
  logoUrl?: string;
}

interface ShopInfoFormProps {
  initialValues?: ShopInfo;
  onChange?: (values: ShopInfo) => void;
}

export const ShopInfoForm: React.FC<ShopInfoFormProps> = ({
  initialValues,
  onChange,
}) => {
  const [form] = Form.useForm();

  const handleValuesChange = (_: unknown, allValues: ShopInfo) => {
    onChange?.(allValues);
  };

  return (
    <Card className="border-base-200">
      <div className="flex items-center gap-2 mb-4">
        <ShopOutlined className="text-primary" />
        <Title level={5} className="!mb-0">
          Informações do Estabelecimento
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onValuesChange={handleValuesChange}
      >
        {/* Logo Upload */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Avatar
              size={100}
              icon={<ShopOutlined />}
              src={initialValues?.logoUrl}
              className="bg-primary"
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
          label="Nome do Estabelecimento"
          rules={[{ required: true, message: "Informe o nome" }]}
        >
          <Input placeholder="Ex: Auto Lavagem Central" />
        </Form.Item>

        <Form.Item name="description" label="Descrição">
          <TextArea
            rows={3}
            placeholder="Descreva seu estabelecimento..."
            showCount
            maxLength={500}
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="phone"
            label="Telefone/WhatsApp"
            rules={[{ required: true, message: "Informe o telefone" }]}
          >
            <Input placeholder="(11) 99999-9999" />
          </Form.Item>

          <Form.Item name="email" label="E-mail">
            <Input placeholder="contato@exemplo.com" type="email" />
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
};

export default ShopInfoForm;
