"use client";

import React from "react";
import { Form, Input, Button, Row, Col, Divider, type FormInstance } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { UpdateShopDto } from "@/types/shop";
import { InfoBox } from "@/components/ui";

interface SettingsAddressFormProps {
  form: FormInstance;
  onFinish: (values: UpdateShopDto) => void;
  saving: boolean;
}

export const SettingsAddressForm: React.FC<SettingsAddressFormProps> = ({
  form,
  onFinish,
  saving,
}) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="max-w-4xl"
    >
      <div className="mb-6">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Endereço do Estabelecimento
        </h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Form.Item
              name="zipCode"
              label={<span className="text-zinc-600 dark:text-zinc-400">CEP</span>}
              rules={[{ required: true, message: "Informe o CEP" }]}
            >
              <Input 
                placeholder="00000-000"
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={14}>
            <Form.Item
              name="street"
              label={<span className="text-zinc-600 dark:text-zinc-400">Rua</span>}
              rules={[{ required: true, message: "Informe a rua" }]}
            >
              <Input 
                placeholder="Nome da rua"
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              name="number"
              label={<span className="text-zinc-600 dark:text-zinc-400">Número</span>}
              rules={[{ required: true, message: "Nº" }]}
            >
              <Input 
                placeholder="123"
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item
              name="complement"
              label={<span className="text-zinc-600 dark:text-zinc-400">Complemento</span>}
            >
              <Input 
                placeholder="Sala, Bloco, etc."
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="neighborhood"
              label={<span className="text-zinc-600 dark:text-zinc-400">Bairro</span>}
              rules={[{ required: true, message: "Informe o bairro" }]}
            >
              <Input 
                placeholder="Bairro"
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              name="city"
              label={<span className="text-zinc-600 dark:text-zinc-400">Cidade</span>}
              rules={[{ required: true, message: "Informe a cidade" }]}
            >
              <Input 
                placeholder="Cidade"
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={2}>
            <Form.Item
              name="state"
              label={<span className="text-zinc-600 dark:text-zinc-400">UF</span>}
              rules={[{ required: true, message: "UF" }]}
            >
              <Input 
                placeholder="UF" 
                maxLength={2}
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <InfoBox
        title="Visibilidade do Endereço"
        description="O endereço será exibido para os clientes na página de agendamento e na confirmação."
        variant="info"
        className="mb-6"
      />

      <Divider className="dark:border-zinc-800" />

      <div className="flex justify-end">
        <Button 
          type="primary" 
          htmlType="submit"
          icon={<SaveOutlined />}
          loading={saving}
          className="bg-blue-600 hover:bg-blue-500 border-none h-10 px-6 font-medium shadow-md shadow-blue-500/20"
        >
          Salvar Endereço
        </Button>
      </div>
    </Form>
  );
};
