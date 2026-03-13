"use client";

import React from "react";
import { Button, Form, FormInstance, InputNumber, Select, Space, Typography } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { VEHICLE_SIZE_OPTIONS, VehicleSizeValue } from "./serviceUi";

const { Text } = Typography;

export interface ServiceVariantFormValue {
  size: "SMALL" | "MEDIUM" | "LARGE";
  price: number;
  duration: number;
}

interface ServiceVariantsEditorProps {
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: FormInstance<any>;
}

export const ServiceVariantsEditor: React.FC<ServiceVariantsEditorProps> = ({ disabled, form }) => {
  const variants = Form.useWatch("variants", form) as Array<{ size?: VehicleSizeValue }> | undefined;

  return (
    <Form.List name="variants">
      {(fields, { add, remove }) => (
        <div className="space-y-3">
          {fields.map((field, index) => {
            const selectedSizes = (variants || [])
              .map((variant, i) => (i === index ? undefined : variant?.size))
              .filter((size): size is VehicleSizeValue => Boolean(size));

            return (
            <div
              key={`${field.key}-${field.name}`}
              className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/70 dark:bg-zinc-800/40 p-3"
            >
              <Space className="w-full" size={12} align="start" wrap>
                <Form.Item
                  name={[field.name, "size"]}
                  label="Porte"
                  rules={[{ required: true, message: "Selecione o porte" }]}
                  className="!mb-0 min-w-[150px]"
                >
                  <Select
                    options={VEHICLE_SIZE_OPTIONS.map((option) => ({
                      ...option,
                      disabled: selectedSizes.includes(option.value),
                    }))}
                    placeholder="Porte"
                    disabled={disabled}
                    style={{ minWidth: 150 }}
                  />
                </Form.Item>

                <Form.Item
                  name={[field.name, "price"]}
                  label="Preço"
                  rules={[{ required: true, message: "Informe o preço" }]}
                  className="!mb-0 min-w-[150px]"
                >
                  <InputNumber
                    min={0}
                    step={0.01}
                    precision={2}
                    prefix="R$"
                    className="!w-full"
                    disabled={disabled}
                  />
                </Form.Item>

                <Form.Item
                  name={[field.name, "duration"]}
                  label="Duração"
                  rules={[{ required: true, message: "Informe a duração" }]}
                  className="!mb-0 min-w-[150px]"
                >
                  <InputNumber
                    min={1}
                    max={480}
                    suffix="min"
                    className="!w-full"
                    disabled={disabled}
                  />
                </Form.Item>

                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => remove(field.name)}
                  disabled={disabled}
                  className="mt-8"
                >
                  Remover
                </Button>
              </Space>
            </div>
          )})}

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => add({ size: undefined, price: undefined, duration: undefined })}
            disabled={disabled}
            className="w-full"
          >
            Adicionar variação
          </Button>

          <Text className="text-xs text-zinc-500 dark:text-zinc-400">
            Configure preço e duração por porte de veículo. Não repita o mesmo porte.
          </Text>
        </div>
      )}
    </Form.List>
  );
};
