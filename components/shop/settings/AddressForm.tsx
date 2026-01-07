"use client";

import React from "react";
import { Card, Form, Input, Typography, Select } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;

export interface AddressInfo {
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface AddressFormProps {
  initialValues?: AddressInfo;
  onChange?: (values: AddressInfo) => void;
}

const states = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

export const AddressForm: React.FC<AddressFormProps> = ({
  initialValues,
  onChange,
}) => {
  const [form] = Form.useForm();

  const handleValuesChange = (_: unknown, allValues: AddressInfo) => {
    onChange?.(allValues);
  };

  return (
    <Card className="border-base-200">
      <div className="flex items-center gap-2 mb-4">
        <EnvironmentOutlined className="text-success" />
        <Title level={5} className="!mb-0">
          Endereço
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onValuesChange={handleValuesChange}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item
            name="zipCode"
            label="CEP"
            rules={[{ required: true, message: "Informe o CEP" }]}
          >
            <Input placeholder="00000-000" />
          </Form.Item>

          <Form.Item
            name="street"
            label="Rua/Avenida"
            className="md:col-span-2"
            rules={[{ required: true, message: "Informe a rua" }]}
          >
            <Input placeholder="Nome da rua" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item
            name="number"
            label="Número"
            rules={[{ required: true, message: "Informe o número" }]}
          >
            <Input placeholder="123" />
          </Form.Item>

          <Form.Item name="complement" label="Complemento" className="md:col-span-2">
            <Input placeholder="Sala, bloco, etc." />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item
            name="neighborhood"
            label="Bairro"
            rules={[{ required: true, message: "Informe o bairro" }]}
          >
            <Input placeholder="Bairro" />
          </Form.Item>

          <Form.Item
            name="city"
            label="Cidade"
            rules={[{ required: true, message: "Informe a cidade" }]}
          >
            <Input placeholder="Cidade" />
          </Form.Item>

          <Form.Item
            name="state"
            label="Estado"
            rules={[{ required: true, message: "Selecione o estado" }]}
          >
            <Select options={states} placeholder="Selecione" showSearch />
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
};

export default AddressForm;
