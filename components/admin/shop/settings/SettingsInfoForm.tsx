"use client";

import React from "react";
import { Form, Input, Button, Row, Col, Select, Divider, type FormInstance } from "antd";
import {
  SaveOutlined,
  ShopOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  FileTextOutlined,
  PictureOutlined,
  CameraOutlined
} from "@ant-design/icons";
import { SHOP_STATUS_MAP, UpdateShopDto } from "@/types/shop";
import { maskCpfCnpj, maskPhone, isValidCpfCnpj } from "@/lib/masks";

const { TextArea } = Input;

interface SettingsInfoFormProps {
  form: FormInstance;
  onFinish: (values: UpdateShopDto) => void;
  saving: boolean;
}

export const SettingsInfoForm: React.FC<SettingsInfoFormProps> = ({
  form,
  onFinish,
  saving,
}) => {
  // Handler for CPF/CNPJ mask
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCpfCnpj(e.target.value);
    form.setFieldValue("document", masked);
  };

  // Handler for phone mask
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value);
    form.setFieldValue("phone", masked);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="max-w-4xl"
    >
      <div className="mb-6">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Informações Básicas
        </h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label={<span className="text-zinc-600 dark:text-zinc-400">Nome do Estabelecimento</span>}
              rules={[{ required: true, message: "Informe o nome" }]}
            >
              <Input
                prefix={<ShopOutlined className="text-zinc-400" />}
                placeholder="Nome da loja"
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="slug"
              label={<span className="text-zinc-600 dark:text-zinc-400">Slug (URL amigável)</span>}
              rules={[
                { required: true, message: "Informe o slug" },
                { pattern: /^[a-z0-9-]+$/, message: "Apenas letras minúsculas, números e hífens" },
              ]}
              extra={<span className="text-xs text-zinc-500">Ex: minha-loja (usado na URL pública)</span>}
            >
              <Input
                prefix={<GlobalOutlined className="text-zinc-400" />}
                placeholder="minha-loja"
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label={<span className="text-zinc-600 dark:text-zinc-400">Descrição</span>}
        >
          <TextArea
            placeholder="Descreva seu estabelecimento..."
            rows={3}
            showCount
            maxLength={500}
            className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
        </Form.Item>
      </div>

      <div className="mb-6">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Identidade Visual
        </h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="logoUrl"
              label={<span className="text-zinc-600 dark:text-zinc-400">URL do Logo</span>}
              rules={[
                { type: "url", message: "Informe uma URL válida" }
              ]}
              extra={<span className="text-xs text-zinc-500">URL da imagem do logo (formato quadrado recomendado)</span>}
            >
              <Input
                prefix={<PictureOutlined className="text-zinc-400" />}
                placeholder="https://exemplo.com/logo.png"
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="bannerUrl"
              label={<span className="text-zinc-600 dark:text-zinc-400">URL do Banner</span>}
              rules={[
                { type: "url", message: "Informe uma URL válida" }
              ]}
              extra={<span className="text-xs text-zinc-500">URL da imagem do banner (1200x400px recomendado)</span>}
            >
              <Input
                prefix={<CameraOutlined className="text-zinc-400" />}
                placeholder="https://exemplo.com/banner.png"
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="mb-6">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Contato
        </h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item
              name="phone"
              label={<span className="text-zinc-600 dark:text-zinc-400">Telefone</span>}
              rules={[
                { required: true, message: "Informe o telefone" },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const digits = value.replace(/\D/g, "");
                    if (digits.length >= 10 && digits.length <= 11) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Telefone inválido");
                  }
                }
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="text-zinc-400" />}
                placeholder="(99) 99999-9999"
                onChange={handlePhoneChange}
                maxLength={15}
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="email"
              label={<span className="text-zinc-600 dark:text-zinc-400">E-mail</span>}
              rules={[{ type: "email", message: "E-mail inválido" }]}
            >
              <Input
                prefix={<MailOutlined className="text-zinc-400" />}
                placeholder="contato@loja.com"
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="document"
              label={<span className="text-zinc-600 dark:text-zinc-400">CPF/CNPJ</span>}
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    if (isValidCpfCnpj(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject("CPF/CNPJ inválido");
                  }
                }
              ]}
            >
              <Input
                prefix={<FileTextOutlined className="text-zinc-400" />}
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                onChange={handleDocumentChange}
                maxLength={18}
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="mb-6">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Status da Loja
        </h3>
        <Form.Item
          name="status"
          label={<span className="text-zinc-600 dark:text-zinc-400">Status Atual</span>}
        >
          <Select
            className="w-full"
            popupClassName="dark:bg-zinc-800"
          >
            {Object.entries(SHOP_STATUS_MAP).map(([key, value]) => {
              let dotColor = '#9ca3af';
              if (key === 'ACTIVE') dotColor = '#22c55e';
              if (key === 'INACTIVE') dotColor = '#ef4444';
              if (key === 'SUSPENDED') dotColor = '#f97316';

              return (
                <Select.Option key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: dotColor }} />
                    <span className="dark:text-zinc-200">{value.label}</span>
                  </div>
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </div>

      <Divider className="dark:border-zinc-800" />

      <div className="flex justify-end">
        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          loading={saving}
          className="bg-blue-600 hover:bg-blue-500 border-none h-10 px-6 font-medium shadow-md shadow-blue-500/20"
        >
          Salvar Informações
        </Button>
      </div>
    </Form>
  );
};
