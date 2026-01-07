"use client";

import React, { useEffect, useState } from "react";
import { 
  Card, 
  Typography, 
  Button, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  message, 
  Row, 
  Col,
  Spin,
  Tabs,
  Divider,
  Alert,
  Tag,
  Space,
} from "antd";
import { 
  SettingOutlined, 
  SaveOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  FileTextOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useUpdateShop } from "@/hooks/useShops";
import { UpdateShopDto, SHOP_STATUS_MAP } from "@/types/shop";

const { Title, Text } = Typography;
const { TextArea } = Input;

/**
 * Configurações do Shop - Edição completa
 */
export default function SettingsPage() {
  const { shop, shopId, isLoading } = useShopAdmin();
  const updateShop = useUpdateShop();

  const [infoForm] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [configForm] = Form.useForm();
  const [saving, setSaving] = useState(false);

  // Carregar dados do shop nos formulários
  useEffect(() => {
    if (shop) {
      infoForm.setFieldsValue({
        name: shop.name,
        slug: shop.slug,
        description: shop.description,
        phone: shop.phone,
        email: shop.email,
        document: shop.document,
        status: shop.status,
      });

      addressForm.setFieldsValue({
        zipCode: shop.zipCode,
        street: shop.street,
        number: shop.number,
        complement: shop.complement,
        neighborhood: shop.neighborhood,
        city: shop.city,
        state: shop.state,
      });

      configForm.setFieldsValue({
        slotInterval: shop.slotInterval,
        bufferBetweenSlots: shop.bufferBetweenSlots,
        maxAdvanceDays: shop.maxAdvanceDays,
        minAdvanceMinutes: shop.minAdvanceMinutes,
      });
    }
  }, [shop, infoForm, addressForm, configForm]);

  const handleSaveInfo = async (values: {
    name: string;
    slug: string;
    description?: string;
    phone: string;
    email?: string;
    document?: string;
    status: string;
  }) => {
    setSaving(true);
    try {
      await updateShop.mutateAsync({
        id: shopId,
        payload: values as UpdateShopDto,
      });
      message.success("Informações atualizadas com sucesso!");
    } catch {
      message.error("Erro ao atualizar informações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async (values: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  }) => {
    setSaving(true);
    try {
      await updateShop.mutateAsync({
        id: shopId,
        payload: values as UpdateShopDto,
      });
      message.success("Endereço atualizado com sucesso!");
    } catch {
      message.error("Erro ao atualizar endereço. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveConfig = async (values: {
    slotInterval: number;
    bufferBetweenSlots: number;
    maxAdvanceDays: number;
    minAdvanceMinutes: number;
  }) => {
    setSaving(true);
    try {
      await updateShop.mutateAsync({
        id: shopId,
        payload: values as UpdateShopDto,
      });
      message.success("Configurações atualizadas com sucesso!");
    } catch {
      message.error("Erro ao atualizar configurações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando configurações..." />
      </div>
    );
  }

  const tabItems = [
    {
      key: "info",
      label: (
        <span className="flex items-center gap-2">
          <ShopOutlined />
          Informações
        </span>
      ),
      children: (
        <Form
          form={infoForm}
          layout="vertical"
          onFinish={handleSaveInfo}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Nome do Estabelecimento"
                rules={[{ required: true, message: "Informe o nome" }]}
              >
                <Input 
                  prefix={<ShopOutlined className="text-gray-400" />}
                  placeholder="Nome da loja" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="slug"
                label="Slug (URL amigável)"
                rules={[
                  { required: true, message: "Informe o slug" },
                  { pattern: /^[a-z0-9-]+$/, message: "Apenas letras minúsculas, números e hífens" },
                ]}
                extra="Ex: minha-loja (usado na URL pública)"
              >
                <Input 
                  prefix={<GlobalOutlined className="text-gray-400" />}
                  placeholder="minha-loja" 
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Descrição"
          >
            <TextArea 
              placeholder="Descreva seu estabelecimento..."
              rows={3}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col xs={24} md={8}>
              <Form.Item
                name="phone"
                label="Telefone"
                rules={[{ required: true, message: "Informe o telefone" }]}
              >
                <Input 
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="(99) 99999-9999" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="email"
                label="E-mail"
                rules={[{ type: "email", message: "E-mail inválido" }]}
              >
                <Input 
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="contato@loja.com" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="document"
                label="CNPJ/CPF"
              >
                <Input 
                  prefix={<FileTextOutlined className="text-gray-400" />}
                  placeholder="00.000.000/0000-00" 
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Status"
          >
            <Select>
              <Select.Option value="ACTIVE">
                <Space>
                  <Tag color={SHOP_STATUS_MAP.ACTIVE.color}>Ativo</Tag>
                  <Text type="secondary">Aceita novos agendamentos</Text>
                </Space>
              </Select.Option>
              <Select.Option value="INACTIVE">
                <Space>
                  <Tag color={SHOP_STATUS_MAP.INACTIVE.color}>Inativo</Tag>
                  <Text type="secondary">Não aparece para clientes</Text>
                </Space>
              </Select.Option>
              <Select.Option value="SUSPENDED">
                <Space>
                  <Tag color={SHOP_STATUS_MAP.SUSPENDED.color}>Suspenso</Tag>
                  <Text type="secondary">Temporariamente indisponível</Text>
                </Space>
              </Select.Option>
            </Select>
          </Form.Item>

          <Divider />

          <div className="flex justify-end">
            <Button 
              type="primary" 
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
            >
              Salvar Informações
            </Button>
          </div>
        </Form>
      ),
    },
    {
      key: "address",
      label: (
        <span className="flex items-center gap-2">
          <EnvironmentOutlined />
          Endereço
        </span>
      ),
      children: (
        <Form
          form={addressForm}
          layout="vertical"
          onFinish={handleSaveAddress}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} md={6}>
              <Form.Item
                name="zipCode"
                label="CEP"
                rules={[{ required: true, message: "Informe o CEP" }]}
              >
                <Input placeholder="00000-000" />
              </Form.Item>
            </Col>
            <Col xs={24} md={14}>
              <Form.Item
                name="street"
                label="Rua"
                rules={[{ required: true, message: "Informe a rua" }]}
              >
                <Input placeholder="Nome da rua" />
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item
                name="number"
                label="Número"
                rules={[{ required: true, message: "Nº" }]}
              >
                <Input placeholder="123" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col xs={24} md={8}>
              <Form.Item
                name="complement"
                label="Complemento"
              >
                <Input placeholder="Sala, Bloco, etc." />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="neighborhood"
                label="Bairro"
                rules={[{ required: true, message: "Informe o bairro" }]}
              >
                <Input placeholder="Bairro" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                name="city"
                label="Cidade"
                rules={[{ required: true, message: "Informe a cidade" }]}
              >
                <Input placeholder="Cidade" />
              </Form.Item>
            </Col>
            <Col xs={24} md={2}>
              <Form.Item
                name="state"
                label="UF"
                rules={[{ required: true, message: "UF" }]}
              >
                <Input placeholder="UF" maxLength={2} />
              </Form.Item>
            </Col>
          </Row>

          <Alert
            message="O endereço será exibido para os clientes na página de agendamento"
            type="info"
            showIcon
            className="mb-4"
          />

          <Divider />

          <div className="flex justify-end">
            <Button 
              type="primary" 
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
            >
              Salvar Endereço
            </Button>
          </div>
        </Form>
      ),
    },
    {
      key: "scheduling",
      label: (
        <span className="flex items-center gap-2">
          <ClockCircleOutlined />
          Agendamento
        </span>
      ),
      children: (
        <Form
          form={configForm}
          layout="vertical"
          onFinish={handleSaveConfig}
        >
          <Alert
            message="Configurações de Agendamento"
            description="Estas configurações definem como os slots de horário são gerados para os clientes."
            type="info"
            showIcon
            className="mb-6"
          />

          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="slotInterval"
                label="Intervalo entre Slots (minutos)"
                extra="Tempo entre o início de cada horário disponível"
                rules={[{ required: true, message: "Informe o intervalo" }]}
              >
                <InputNumber 
                  min={5} 
                  max={120} 
                  step={5}
                  className="w-full"
                  addonAfter="min"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="bufferBetweenSlots"
                label="Buffer entre Agendamentos (minutos)"
                extra="Tempo de folga entre um atendimento e outro"
                rules={[{ required: true, message: "Informe o buffer" }]}
              >
                <InputNumber 
                  min={0} 
                  max={60} 
                  step={5}
                  className="w-full"
                  addonAfter="min"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="maxAdvanceDays"
                label="Máximo de dias para agendar"
                extra="Quantos dias no futuro o cliente pode agendar"
                rules={[{ required: true, message: "Informe o máximo" }]}
              >
                <InputNumber 
                  min={1} 
                  max={365} 
                  className="w-full"
                  addonAfter="dias"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="minAdvanceMinutes"
                label="Antecedência mínima (minutos)"
                extra="Tempo mínimo de antecedência para agendar"
                rules={[{ required: true, message: "Informe a antecedência" }]}
              >
                <InputNumber 
                  min={0} 
                  max={1440} 
                  step={15}
                  className="w-full"
                  addonAfter="min"
                />
              </Form.Item>
            </Col>
          </Row>

          <Card className="bg-gray-50 mt-4">
            <Text strong>Exemplo de configuração:</Text>
            <ul className="mt-2 text-gray-600 text-sm list-disc list-inside">
              <li>Intervalo de 30 min = horários às 8:00, 8:30, 9:00...</li>
              <li>Buffer de 10 min = folga entre atendimentos</li>
              <li>Máximo 30 dias = cliente pode agendar até 1 mês</li>
              <li>Antecedência 60 min = precisa agendar com 1h de antecedência</li>
            </ul>
          </Card>

          <Divider />

          <div className="flex justify-end">
            <Button 
              type="primary" 
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
            >
              Salvar Configurações
            </Button>
          </div>
        </Form>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title level={3} className="!mb-1 flex items-center gap-2">
          <SettingOutlined className="text-blue-500" />
          Configurações
        </Title>
        <Text type="secondary">
          Gerencie as informações e preferências do estabelecimento
        </Text>
      </div>

      {/* Tabs de Configuração */}
      <Card>
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
}
