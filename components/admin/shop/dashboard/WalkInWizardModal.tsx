"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  Steps,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Checkbox,
  Space,
  Spin,
  App,
} from "antd";
import {
  CarOutlined,
  UserOutlined,
  ToolOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useServicesByShop } from "@/hooks/useServices";
import { useCreateVehicle } from "@/hooks/useVehicles";
import { useCreateUser } from "@/hooks/useUsers";
import { useCreateShopClient } from "@/hooks/useShopClients";
import {
  useCreateAppointment,
  useUpdateAppointmentStatus,
} from "@/hooks/useAppointments";
import {
  sanitizePlate,
  sanitizePhone,
  sanitizeText,
  formatCurrency,
} from "@/lib/security";
import { maskPhone, unmask } from "@/lib/masks";
import { addMinutes } from "date-fns";

import type { Vehicle } from "@/types/vehicle";
import type { User } from "@/types/user";
import type { Services } from "@/types/services";

const { Text, Title } = Typography;
const { TextArea } = Input;

const PLATE_REGEX = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

const VEHICLE_TYPE_OPTIONS = [
  { value: "CAR", label: "Carro" },
  { value: "MOTORCYCLE", label: "Moto" },
  { value: "TRUCK", label: "Caminhão" },
  { value: "SUV", label: "SUV" },
  { value: "VAN", label: "Van" },
  { value: "OTHER", label: "Outro" },
];

interface VehicleFormValues {
  plate: string;
  brand: string;
  model: string;
  color: string;
  type: string;
}

interface ClientFormValues {
  firstName: string;
  phone: string;
  email: string;
}

interface WalkInWizardModalProps {
  open: boolean;
  onClose: () => void;
  shopId: string;
  initialPlate: string;
  existingVehicle: Vehicle | null;
  existingUser: User | null;
}

export const WalkInWizardModal: React.FC<WalkInWizardModalProps> = ({
  open,
  onClose,
  shopId,
  initialPlate,
  existingVehicle,
  existingUser,
}) => {
  const { message } = App.useApp();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [vehicleForm] = Form.useForm<VehicleFormValues>();
  const [clientForm] = Form.useForm<ClientFormValues>();

  const { data: servicesData, isLoading: isServicesLoading } =
    useServicesByShop(shopId);
  const activeServices: Services[] = useMemo(() => {
    const data = servicesData?.data ?? [];
    return data.filter((s) => s.isActive !== false);
  }, [servicesData]);

  const createVehicle = useCreateVehicle();
  const createUser = useCreateUser();
  const createShopClient = useCreateShopClient();
  const createAppointment = useCreateAppointment();
  const updateStatus = useUpdateAppointmentStatus();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      setSelectedServiceIds([]);
      setNotes("");
      setSubmitting(false);

      vehicleForm.setFieldsValue({
        plate: initialPlate,
        brand: existingVehicle?.brand ?? "",
        model: existingVehicle?.model ?? "",
        color: existingVehicle?.color ?? "",
        type: existingVehicle?.type ?? "CAR",
      });

      clientForm.setFieldsValue({
        firstName: existingUser?.firstName ?? "",
        phone: existingUser?.phone ? maskPhone(existingUser.phone) : "",
        email: existingUser?.email ?? "",
      });
    } else {
      vehicleForm.resetFields();
      clientForm.resetFields();
    }
  }, [open, initialPlate, existingVehicle, existingUser, vehicleForm, clientForm]);

  const selectedServicesInfo = useMemo(() => {
    const selected = activeServices.filter((s) =>
      selectedServiceIds.includes(s.id)
    );
    const totalPrice = selected.reduce(
      (acc, s) => acc + parseFloat(s.price),
      0
    );
    const totalDuration = selected.reduce((acc, s) => acc + s.duration, 0);
    return { selected, totalPrice, totalDuration };
  }, [activeServices, selectedServiceIds]);

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        await vehicleForm.validateFields();
        setCurrentStep(1);
      } catch {
        // validation errors shown automatically
      }
    } else if (currentStep === 1) {
      try {
        await clientForm.validateFields();
        setCurrentStep(2);
      } catch {
        // validation errors shown automatically
      }
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    if (selectedServiceIds.length === 0) {
      message.warning("Selecione ao menos um serviço.");
      return;
    }

    setSubmitting(true);

    try {
      const vehicleValues = vehicleForm.getFieldsValue();
      const clientValues = clientForm.getFieldsValue();

      const sanitizedPlate = sanitizePlate(vehicleValues.plate);
      const sanitizedName = sanitizeText(clientValues.firstName);
      const sanitizedPhone = sanitizePhone(unmask(clientValues.phone));
      const sanitizedEmail = sanitizeText(clientValues.email);
      const sanitizedNotes = sanitizeText(notes);
      const sanitizedBrand = sanitizeText(vehicleValues.brand);
      const sanitizedModel = sanitizeText(vehicleValues.model);
      const sanitizedColor = sanitizeText(vehicleValues.color);

      // Step 1: Ensure user exists
      let userId = existingUser?.id;
      if (!userId) {
        const newUser = await createUser.mutateAsync({
          firstName: sanitizedName,
          // phone: sanitizedPhone, // Backend API does not accept phone on create user DTO currently
          email: sanitizedEmail || undefined,
          password: crypto.randomUUID(),
          role: "USER",
        });
        userId = newUser.id;
      }

      // Step 2: Ensure vehicle exists
      let vehicleId = existingVehicle?.id;
      if (!vehicleId) {
        const newVehicle = await createVehicle.mutateAsync({
          plate: sanitizedPlate,
          brand: sanitizedBrand,
          model: sanitizedModel,
          color: sanitizedColor || undefined,
          type: vehicleValues.type as Vehicle["type"],
          userId,
        });
        vehicleId = newVehicle.id;
      }

      // Step 3: Create ShopClient (ignore errors if already exists)
      try {
        await createShopClient.mutateAsync({
          shopId,
          userId,
          customName: sanitizedName,
          customPhone: sanitizedPhone || undefined,
        });
      } catch {
        // ShopClient may already exist - that's fine
      }

      // Step 4: Create Appointment
      const now = new Date();
      const endTime = addMinutes(now, selectedServicesInfo.totalDuration);

      const servicePayload = selectedServicesInfo.selected.map((s) => ({
        serviceId: s.id,
        serviceName: s.name,
        servicePrice: parseFloat(s.price),
        duration: s.duration,
      }));

      const appointment = await createAppointment.mutateAsync({
        scheduledAt: now.toISOString(),
        endTime: endTime.toISOString(),
        totalPrice: selectedServicesInfo.totalPrice,
        totalDuration: selectedServicesInfo.totalDuration,
        notes: sanitizedNotes || undefined,
        userId,
        shopId,
        vehicleId,
        serviceIds: servicePayload,
      });

      // Step 5: Update status to IN_PROGRESS
      await updateStatus.mutateAsync({
        id: appointment.id,
        status: "IN_PROGRESS",
      });

      message.success("Atendimento registrado com sucesso!");
      onClose();
    } catch {
      message.error("Erro ao registrar atendimento. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const stepItems = [
    { title: "Veículo", icon: <CarOutlined /> },
    { title: "Cliente", icon: <UserOutlined /> },
    { title: "Serviços", icon: <ToolOutlined /> },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CarOutlined />
          </div>
          <div className="flex flex-col">
            <span>Nova Entrada</span>
            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400 mt-0.5">
              Registre um novo atendimento rapidamente
            </span>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={640}
      className="[&_.ant-modal-content]:!bg-white dark:[&_.ant-modal-content]:!bg-zinc-900 [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-close]:!text-zinc-400 [&_.ant-modal-close:hover]:!text-zinc-600 dark:[&_.ant-modal-close:hover]:!text-zinc-200"
      styles={{ body: { padding: "24px" } }}
    >
      <Steps
        current={currentStep}
        items={stepItems}
        className="mb-6"
        size="small"
      />

      {/* Step 0: Vehicle Data */}
      <div style={{ display: currentStep === 0 ? "block" : "none" }}>
        <Form
          form={vehicleForm}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="plate"
            label="Placa"
            rules={[
              { required: true, message: "Placa é obrigatória" },
              {
                pattern: PLATE_REGEX,
                message: "Formato inválido (ex: ABC1D23)",
              },
            ]}
          >
            <Input
              readOnly={!!existingVehicle}
              maxLength={7}
              placeholder="ABC1D23"
              style={{
                fontFamily: "monospace",
                fontSize: 16,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
              onChange={(e) => {
                const cleaned = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, "");
                vehicleForm.setFieldValue("plate", cleaned);
              }}
            />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item
              name="brand"
              label="Marca"
              rules={[{ required: true, message: "Marca é obrigatória" }]}
            >
              <Input placeholder="Ex: Toyota, Honda..." />
            </Form.Item>

            <Form.Item
              name="model"
              label="Modelo"
              rules={[{ required: true, message: "Modelo é obrigatório" }]}
            >
              <Input placeholder="Ex: Corolla, Civic..." />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="color" label="Cor">
              <Input placeholder="Ex: Branco, Preto..." />
            </Form.Item>

            <Form.Item name="type" label="Tipo de Veículo">
              <Select options={VEHICLE_TYPE_OPTIONS} />
            </Form.Item>
          </div>
        </Form>
      </div>

      {/* Step 1: Client Data */}
      <div style={{ display: currentStep === 1 ? "block" : "none" }}>
        <Form
          form={clientForm}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="firstName"
            label="Nome do Cliente"
            rules={[{ required: true, message: "Nome é obrigatório" }]}
          >
            <Input
              prefix={<UserOutlined className="text-zinc-400" />}
              placeholder="Nome completo"
              readOnly={!!existingUser}
            />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item
              name="phone"
              label="Telefone (Opcional)"
              rules={[{ required: false }]}
            >
              <Input
                placeholder="(00) 00000-0000"
                maxLength={15}
                // Allow editing even if user exists (override)
                onChange={(e) => {
                  const masked = maskPhone(e.target.value);
                  clientForm.setFieldValue("phone", masked);
                }}
              />
            </Form.Item>

            <Form.Item name="email" label="Email">
              <Input
                placeholder="email@exemplo.com"
                type="email"
                readOnly={!!existingUser}
              />
            </Form.Item>
          </div>

          {existingUser && (
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-300">
              Cliente já cadastrado no sistema. Você pode alterar o telefone para este atendimento específico.
            </div>
          )}
        </Form>
      </div>

      {/* Step 2: Services */}
      <div style={{ display: currentStep === 2 ? "block" : "none" }}>
        {isServicesLoading ? (
          <div className="flex justify-center py-8">
            <Spin tip="Carregando serviços..." />
          </div>
        ) : (
          <>
            <Title level={5} className="!text-zinc-700 dark:!text-zinc-200 !mb-4">
              Selecione os serviços
            </Title>

            <Checkbox.Group
              value={selectedServiceIds}
              onChange={(values) => setSelectedServiceIds(values as string[])}
              className="w-full"
            >
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {activeServices.map((service) => (
                  <label
                    key={service.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedServiceIds.includes(service.id)
                        ? "border-emerald-400 dark:border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/10"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox value={service.id} />
                      <div>
                        <Text
                          strong
                          className="text-zinc-800 dark:text-zinc-100"
                        >
                          {service.name}
                        </Text>
                        {service.description && (
                          <Text className="block text-xs text-zinc-500 dark:text-zinc-400">
                            {service.description}
                          </Text>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <Text
                        strong
                        className="text-emerald-600 dark:text-emerald-400 block"
                      >
                        {formatCurrency(service.price)}
                      </Text>
                      <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                        {service.duration} min
                      </Text>
                    </div>
                  </label>
                ))}
              </div>
            </Checkbox.Group>

            <div className="mt-4">
              <TextArea
                placeholder="Observações (opcional)"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
              />
            </div>

            {/* Totals */}
            {selectedServiceIds.length > 0 && (
              <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
                <div className="flex justify-between mb-2">
                  <Text className="text-zinc-600 dark:text-zinc-300">
                    Serviços selecionados
                  </Text>
                  <Text strong className="text-zinc-800 dark:text-zinc-100">
                    {selectedServicesInfo.selected.length}
                  </Text>
                </div>
                <div className="flex justify-between mb-2">
                  <Text className="text-zinc-600 dark:text-zinc-300">
                    Tempo estimado
                  </Text>
                  <Text strong className="text-zinc-800 dark:text-zinc-100">
                    {selectedServicesInfo.totalDuration} min
                  </Text>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <Text
                    strong
                    className="text-zinc-800 dark:text-zinc-100 text-base"
                  >
                    Total
                  </Text>
                  <Text
                    strong
                    className="text-emerald-600 dark:text-emerald-400 text-lg"
                  >
                    {formatCurrency(selectedServicesInfo.totalPrice)}
                  </Text>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Button
          disabled={currentStep === 0 || submitting}
          onClick={handlePrev}
          icon={<ArrowLeftOutlined />}
          className="!rounded-lg"
        >
          Voltar
        </Button>

        <Space>
          <Button onClick={onClose} disabled={submitting} className="!rounded-lg">
            Cancelar
          </Button>

          {currentStep < 2 ? (
            <Button
              type="primary"
              onClick={handleNext}
              className="!bg-emerald-600 hover:!bg-emerald-500 !border-0 !rounded-lg"
            >
              Próximo
              <ArrowRightOutlined />
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={submitting}
              disabled={selectedServiceIds.length === 0}
              icon={<CheckOutlined />}
              className="!bg-emerald-600 hover:!bg-emerald-500 !border-0 !rounded-lg"
            >
              Confirmar Entrada
            </Button>
          )}
        </Space>
      </div>
    </Modal>
  );
};
