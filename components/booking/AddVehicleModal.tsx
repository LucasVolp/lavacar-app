"use client";

import React from "react";
import { Modal, Form, Input, Select, InputNumber, Button, message, Spin } from "antd";
import { useCreateVehicle, useUpdateVehicle } from "@/hooks/useVehicles";
import { useFipeBrandsByVehicleCategory, useFipeModelsByVehicleCategory } from "@/hooks/useFipe";
import { useAuth } from "@/contexts/AuthContext";
import { Vehicle } from "@/types/vehicle";

const { Option } = Select;

type VehicleFormValues = {
  plate?: string;
  brand: string;
  model: string;
  year?: number;
  color?: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  type: "CAR" | "MOTORCYCLE" | "TRUCK" | "SUV" | "VAN" | "OTHER";
};

interface AddVehicleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  vehicle?: Vehicle | null;
}

const normalizePlate = (plate?: string) => (plate || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

export function AddVehicleModal({ open, onClose, onSuccess, vehicle }: AddVehicleModalProps) {
  const [form] = Form.useForm<VehicleFormValues>();
  const { user } = useAuth();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();

  const isEditMode = Boolean(vehicle?.id);

  const watchedType = Form.useWatch("type", form);
  const watchedBrand = Form.useWatch("brand", form);

  const [selectedBrandCode, setSelectedBrandCode] = React.useState<string | null>(null);

  const { data: brands = [], isLoading: brandsLoading } = useFipeBrandsByVehicleCategory(watchedType);
  const { data: models = [], isLoading: modelsLoading } = useFipeModelsByVehicleCategory(
    watchedType,
    selectedBrandCode,
    open,
  );

  React.useEffect(() => {
    if (!open) return;

    if (vehicle) {
      form.setFieldsValue({
        plate: vehicle.plate || "",
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        size: vehicle.size,
        type: vehicle.type,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ type: "CAR", size: "MEDIUM" });
    }

    setSelectedBrandCode(null);
  }, [open, vehicle, form]);

  React.useEffect(() => {
    if (!open) return;
    if (!watchedBrand || brands.length === 0) return;

    const matchedBrand = brands.find((item) => item.name.toLowerCase() === String(watchedBrand).toLowerCase());
    if (matchedBrand) {
      setSelectedBrandCode(matchedBrand.code);
    }
  }, [open, watchedBrand, brands]);

  const brandOptions = React.useMemo(() => {
    const options = brands.map((item) => ({
      value: item.name,
      label: item.name,
      code: item.code,
    }));

    if (watchedBrand && !options.some((item) => item.value.toLowerCase() === watchedBrand.toLowerCase())) {
      options.unshift({ value: watchedBrand, label: watchedBrand, code: "" });
    }

    return options;
  }, [brands, watchedBrand]);

  const modelOptions = React.useMemo(() => {
    const options = models.map((item) => ({
      value: item.name,
      label: item.name,
      code: item.code,
    }));

    const currentModel = form.getFieldValue("model");
    if (currentModel && !options.some((item) => item.value.toLowerCase() === currentModel.toLowerCase())) {
      options.unshift({ value: currentModel, label: `${currentModel} (atual)`, code: "" });
    }

    return options;
  }, [models, form]);

  const handleSubmit = async (values: VehicleFormValues) => {
    if (!user?.id) {
      message.error("Você precisa estar logado para gerenciar um veículo");
      return;
    }

    const normalizedPlate = normalizePlate(values.plate);
    const payload = {
      ...values,
      plate: normalizedPlate || undefined,
      color: values.color?.trim() || undefined,
    };

    try {
      if (isEditMode && vehicle?.id) {
        await updateVehicle.mutateAsync({ id: vehicle.id, payload });
        message.success("Veículo atualizado com sucesso!");
      } else {
        await createVehicle.mutateAsync({
          ...payload,
          userId: user.id,
        });
        message.success("Veículo adicionado com sucesso!");
      }

      form.resetFields();
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string | string[] } } };
      const backendMessage = err.response?.data?.message;
      const messageText = Array.isArray(backendMessage)
        ? backendMessage[0]
        : backendMessage || (isEditMode ? "Erro ao atualizar veículo" : "Erro ao adicionar veículo");
      message.error(messageText);
    }
  };

  return (
    <Modal
      title={isEditMode ? "Editar Veículo" : "Adicionar Novo Veículo"}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ type: "CAR", size: "MEDIUM" }}
      >
        <Form.Item
          name="plate"
          label="Placa (Opcional)"
          rules={[
            {
              pattern: /^[A-Za-z]{3}[0-9][A-Za-z0-9][0-9]{2}$/,
              message: "Placa inválida (ex: ABC1D23 ou ABC1234)",
            },
          ]}
        >
          <Input
            placeholder="ABC1D23"
            maxLength={7}
            style={{ textTransform: "uppercase" }}
            onChange={(event) => {
              form.setFieldValue("plate", normalizePlate(event.target.value));
            }}
          />
        </Form.Item>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Form.Item
            name="type"
            label="Tipo"
            rules={[{ required: true, message: "Selecione o tipo" }]}
          >
            <Select
              onChange={() => {
                setSelectedBrandCode(null);
                form.setFieldValue("brand", undefined);
                form.setFieldValue("model", undefined);
              }}
            >
              <Option value="CAR">Carro</Option>
              <Option value="MOTORCYCLE">Moto</Option>
              <Option value="SUV">SUV</Option>
              <Option value="TRUCK">Caminhão</Option>
              <Option value="VAN">Van</Option>
              <Option value="OTHER">Outro</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="size"
            label="Porte"
            rules={[{ required: true, message: "Selecione o porte" }]}
          >
            <Select>
              <Option value="SMALL">Pequeno</Option>
              <Option value="MEDIUM">Médio</Option>
              <Option value="LARGE">Grande</Option>
            </Select>
          </Form.Item>

          <Form.Item name="year" label="Ano">
            <InputNumber
              placeholder="2024"
              min={1900}
              max={new Date().getFullYear() + 1}
              style={{ width: "100%" }}
              keyboard={false}
              controls={false}
              parser={(value) => {
                const parsed = value?.replace(/\D/g, "");
                return parsed ? Number(parsed) : "";
              }}
              formatter={(value) => (value ? String(value) : "")}
              onKeyDown={(e) => {
                const allowedKeys = [
                  "Backspace",
                  "Delete",
                  "Tab",
                  "ArrowLeft",
                  "ArrowRight",
                  "Home",
                  "End",
                ];
                if (allowedKeys.includes(e.key)) return;
                if (!/^\d$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          <Form.Item name="color" label="Cor">
            <Input placeholder="Ex: Prata" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="brand"
            label="Marca"
            rules={[{ required: true, message: "Selecione a marca" }]}
          >
            <Select
              showSearch
              placeholder={brandsLoading ? "Carregando marcas..." : "Selecione a marca"}
              options={brandOptions}
              loading={brandsLoading}
              filterOption={(input, option) =>
                String(option?.label || "").toLowerCase().includes(input.toLowerCase())
              }
              onChange={(_value, option) => {
                const opt = option as { code?: string };
                setSelectedBrandCode(opt?.code || null);
                form.setFieldValue("model", undefined);
              }}
              notFoundContent={brandsLoading ? <Spin size="small" /> : "Nenhuma marca encontrada"}
            />
          </Form.Item>

          <Form.Item
            name="model"
            label="Modelo"
            rules={[{ required: true, message: "Selecione o modelo" }]}
          >
            <Select
              showSearch
              placeholder={!selectedBrandCode ? "Selecione a marca primeiro" : "Selecione o modelo"}
              options={modelOptions}
              loading={modelsLoading}
              disabled={!selectedBrandCode}
              filterOption={(input, option) =>
                String(option?.label || "").toLowerCase().includes(input.toLowerCase())
              }
              notFoundContent={
                selectedBrandCode
                  ? modelsLoading
                    ? <Spin size="small" />
                    : "Nenhum modelo encontrado"
                  : "Selecione uma marca"
              }
            />
          </Form.Item>
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={createVehicle.isPending || updateVehicle.isPending}
          >
            {isEditMode ? "Salvar alterações" : "Adicionar veículo"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddVehicleModal;
