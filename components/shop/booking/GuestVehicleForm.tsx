"use client";

import React from "react";
import { Form, Input, Select, Card } from "antd";
import { CarOutlined } from "@ant-design/icons";

const { Option } = Select;

export interface GuestVehicleData {
  brand: string;
  model: string;
  type: "CAR" | "MOTORCYCLE" | "SUV" | "TRUCK" | "VAN" | "OTHER";
}

interface GuestVehicleFormProps {
  value?: GuestVehicleData | null;
  onChange: (data: GuestVehicleData) => void;
}

export function GuestVehicleForm({ value, onChange }: GuestVehicleFormProps) {
  const [form] = Form.useForm();

  // Trigger onChange whenever form values change
  const handleValuesChange = (_: unknown, allValues: GuestVehicleData) => {
    // Only verify if we have the minimum required fields to be "valid" or just pass incomplete data?
    // The parent likely validates. We just pass up the state.
    if (allValues.brand && allValues.model && allValues.type) {
        onChange(allValues);
    }
  };

  return (
    <Card 
      className="border-slate-200 dark:border-[#27272a] bg-slate-50 dark:bg-[#09090b]"
      styles={{ body: { padding: '1.5rem' } }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-[#27272a] flex items-center justify-center text-slate-500">
          <CarOutlined />
        </div>
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white">Dados do Veículo</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">Informe os dados do seu veículo</p>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={value || { type: "CAR" }}
        onValuesChange={handleValuesChange}
        requiredMark={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="brand"
            label={<span className="text-slate-700 dark:text-slate-300">Marca</span>}
            rules={[{ required: true, message: "Marca é obrigatória" }]}
          >
            <Input 
                placeholder="Ex: Toyota" 
                className="bg-white dark:bg-[#18181b] border-slate-200 dark:border-[#27272a] text-slate-900 dark:text-white"
            />
          </Form.Item>

          <Form.Item
            name="model"
            label={<span className="text-slate-700 dark:text-slate-300">Modelo</span>}
            rules={[{ required: true, message: "Modelo é obrigatório" }]}
          >
            <Input 
                placeholder="Ex: Corolla" 
                className="bg-white dark:bg-[#18181b] border-slate-200 dark:border-[#27272a] text-slate-900 dark:text-white"
            />
          </Form.Item>

          <Form.Item
            name="type"
            label={<span className="text-slate-700 dark:text-slate-300">Tipo</span>}
            className="md:col-span-2"
          >
            <Select 
                className="custom-select"
                popupClassName="dark:bg-[#18181b] dark:text-white"
            >
              <Option value="CAR">Carro de Passeio</Option>
              <Option value="SUV">SUV / Caminhonete</Option>
              <Option value="MOTORCYCLE">Moto</Option>
              <Option value="VAN">Van / Utilitário</Option>
              <Option value="TRUCK">Caminhão</Option>
              <Option value="OTHER">Outro</Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
}
