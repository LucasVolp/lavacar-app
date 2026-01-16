"use client";

import { Modal, Form, Input, Select, InputNumber, Button, message } from "antd";
import { useCreateVehicle } from "@/hooks/useVehicles";
import { useAuth } from "@/contexts/AuthContext";

const { Option } = Select;

interface AddVehicleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface VehicleFormValues {
  plate: string;
  brand: string;
  model: string;
  year?: number;
  color?: string;
  type: "CAR" | "MOTORCYCLE" | "TRUCK" | "SUV" | "VAN" | "OTHER";
}

export function AddVehicleModal({ open, onClose, onSuccess }: AddVehicleModalProps) {
  const [form] = Form.useForm<VehicleFormValues>();
  const { user } = useAuth();
  const createVehicle = useCreateVehicle();

  const handleSubmit = async (values: VehicleFormValues) => {
    if (!user?.id) {
      message.error("Você precisa estar logado para adicionar um veículo");
      return;
    }

    try {
      await createVehicle.mutateAsync({
        ...values,
        plate: values.plate.toUpperCase(),
        userId: user.id,
      });

      message.success("Veículo adicionado com sucesso!");
      form.resetFields();
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      const errorMessage =
        err.response?.data?.message || "Erro ao adicionar veículo";
      message.error(errorMessage);
    }
  };

  return (
    <Modal
      title="Adicionar Novo Veículo"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ type: "CAR" }}
      >
        <Form.Item
          name="plate"
          label="Placa"
          rules={[
            { required: true, message: "Informe a placa do veículo" },
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
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="brand"
            label="Marca"
            rules={[{ required: true, message: "Informe a marca" }]}
          >
            <Input placeholder="Ex: Fiat, Volkswagen" />
          </Form.Item>

          <Form.Item
            name="model"
            label="Modelo"
            rules={[{ required: true, message: "Informe o modelo" }]}
          >
            <Input placeholder="Ex: Uno, Gol" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Form.Item name="year" label="Ano">
            <InputNumber
              placeholder="2024"
              min={1900}
              max={new Date().getFullYear() + 1}
              style={{ width: "100%" }}
              keyboard={false}
              controls={false}
              parser={(value) => {
                // Remove any non-numeric characters
                const parsed = value?.replace(/\D/g, "");
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return (parsed ? parseInt(parsed, 10) : undefined) as any;
              }}
              formatter={(value) => (value ? String(value) : "")}
              onKeyDown={(e) => {
                // Only allow numbers, backspace, delete, tab, arrows
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

          <Form.Item
            name="type"
            label="Tipo"
            rules={[{ required: true, message: "Selecione o tipo" }]}
          >
            <Select>
              <Option value="CAR">Carro</Option>
              <Option value="MOTORCYCLE">Moto</Option>
              <Option value="SUV">SUV</Option>
              <Option value="TRUCK">Caminhão</Option>
              <Option value="VAN">Van</Option>
              <Option value="OTHER">Outro</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={createVehicle.isPending}
          >
            Adicionar Veículo
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddVehicleModal;
