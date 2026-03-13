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
  Radio,
  Tag,
} from "antd";
import {
  CarOutlined,
  UserOutlined,
  ToolOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  CheckCircleOutlined,
  FileAddOutlined,
  PlusOutlined,
  CalendarOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useServicesByShop } from "@/hooks/useServices";
import { useFipeBrandsByVehicleCategory, useFipeModelsByVehicleCategory } from "@/hooks/useFipe";
import { useCreateWalkIn, useUpcomingAppointmentsByPlate, useUpdateAppointmentStatus, useCancelAppointment } from "@/hooks/useAppointments";
import { useUserVehicles } from "@/hooks/useVehicles";
import {
  sanitizePlate,
  sanitizePhone,
  sanitizeText,
  formatCurrency,
} from "@/lib/security";
import { maskPhone, unmask } from "@/lib/masks";
import { validateUUID } from "@/utils/validators";
import { formatVehiclePlate } from "@/utils/vehiclePlate";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import type { Vehicle } from "@/types/vehicle";
import type { User } from "@/types/user";
import type { Appointment } from "@/types/appointment";
import type { Services } from "@/types/services";
import { ChecklistModal } from "@/components/modals/ChecklistModal";

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

const VEHICLE_SIZE_OPTIONS = [
  { value: "SMALL", label: "Pequeno" },
  { value: "MEDIUM", label: "Médio" },
  { value: "LARGE", label: "Grande" },
];

interface VehicleFormValues {
  plate: string;
  brand: string;
  model: string;
  color: string;
  type: string;
  size: string;
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
  const [createdAppointmentId, setCreatedAppointmentId] = useState<string | null>(null);
  const [checklistModalOpen, setChecklistModalOpen] = useState(false);

  const [pickedVehicleId, setPickedVehicleId] = useState<string | null>(null);
  const [isNewVehicle, setIsNewVehicle] = useState(false);

  const [vehicleForm] = Form.useForm<VehicleFormValues>();
  const [clientForm] = Form.useForm<ClientFormValues>();

  const [selectedBrandCode, setSelectedBrandCode] = useState<string | null>(null);

  const watchedType = Form.useWatch("type", vehicleForm);
  const watchedBrand = Form.useWatch("brand", vehicleForm);

  const isKnownUser = !!existingUser?.id;

  const { data: userVehicles = [], isLoading: vehiclesLoading } = useUserVehicles(
    isKnownUser ? existingUser.id : null,
    isKnownUser && !existingVehicle,
  );

  const { data: brands = [], isLoading: brandsLoading } = useFipeBrandsByVehicleCategory(watchedType as Vehicle["type"] | undefined);
  const { data: models = [], isLoading: modelsLoading } = useFipeModelsByVehicleCategory(
    watchedType as Vehicle["type"] | undefined,
    selectedBrandCode,
    open,
  );

  const { data: servicesData, isLoading: isServicesLoading } =
    useServicesByShop(shopId);
  const activeServices: Services[] = useMemo(() => {
    const data = servicesData?.data ?? [];
    return data.filter((s) => s.isActive !== false);
  }, [servicesData]);

  const createWalkIn = useCreateWalkIn();
  const cancelAppointment = useCancelAppointment();
  const updateAppointmentStatus = useUpdateAppointmentStatus();

  const resolvedVehicle = useMemo(() => {
    if (existingVehicle) return existingVehicle;
    if (pickedVehicleId) return userVehicles.find((v) => v.id === pickedVehicleId) ?? null;
    return null;
  }, [existingVehicle, pickedVehicleId, userVehicles]);

  const resolvedPlate = resolvedVehicle?.plate || null;

  const {
    data: upcomingAppointments = [],
    isLoading: upcomingLoading,
  } = useUpcomingAppointmentsByPlate(resolvedPlate, shopId, !!resolvedPlate);

  const showVehiclePicker = isKnownUser && !existingVehicle && userVehicles.length > 0;

  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      setSelectedServiceIds([]);
      setNotes("");
      setSubmitting(false);
      setCreatedAppointmentId(null);
      setChecklistModalOpen(false);
      setPickedVehicleId(null);
      setIsNewVehicle(false);

      vehicleForm.setFieldsValue({
        plate: initialPlate,
        brand: existingVehicle?.brand || undefined,
        model: existingVehicle?.model || undefined,
        color: existingVehicle?.color ?? "",
        type: existingVehicle?.type ?? "CAR",
        size: existingVehicle?.size ?? "MEDIUM",
      });

      clientForm.setFieldsValue({
        firstName: existingUser?.firstName ?? "",
        phone: existingUser?.phone ? maskPhone(existingUser.phone) : "",
        email: existingUser?.email ?? "",
      });

      setSelectedBrandCode(null);
    } else {
      vehicleForm.resetFields();
      clientForm.resetFields();
      setSelectedBrandCode(null);
      setPickedVehicleId(null);
      setIsNewVehicle(false);
    }
  }, [open, initialPlate, existingVehicle, existingUser, vehicleForm, clientForm]);

  useEffect(() => {
    if (!open || !watchedBrand || brands.length === 0) return;
    const matched = brands.find((b) => b.name.toLowerCase() === String(watchedBrand).toLowerCase());
    if (matched) setSelectedBrandCode(matched.code);
  }, [open, watchedBrand, brands]);

  const brandOptions = useMemo(() => {
    const options = brands.map((b) => ({ value: b.name, label: b.name, code: b.code }));
    if (watchedBrand && !options.some((o) => o.value.toLowerCase() === watchedBrand.toLowerCase())) {
      options.unshift({ value: watchedBrand, label: watchedBrand, code: "" });
    }
    return options;
  }, [brands, watchedBrand]);

  const modelOptions = useMemo(() => {
    const options = models.map((m) => ({ value: m.name, label: m.name, code: m.code }));
    const currentModel = vehicleForm.getFieldValue("model");
    if (currentModel && !options.some((o) => o.value.toLowerCase() === currentModel.toLowerCase())) {
      options.unshift({ value: currentModel, label: `${currentModel} (atual)`, code: "" });
    }
    return options;
  }, [models, vehicleForm]);

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
      if (resolvedVehicle && !isNewVehicle) {
        setCurrentStep(1);
        return;
      }
      if (showVehiclePicker && !isNewVehicle && !pickedVehicleId) {
        message.warning("Selecione um veículo ou clique em 'Novo veículo'.");
        return;
      }
      try {
        await vehicleForm.validateFields();
        setCurrentStep(1);
      } catch {
      }
    } else if (currentStep === 1) {
      try {
        await clientForm.validateFields();
        setCurrentStep(2);
      } catch {
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
      const clientValues = clientForm.getFieldsValue();

      const sanitizedName = sanitizeText(clientValues.firstName);
      const sanitizedPhone = sanitizePhone(unmask(clientValues.phone));
      const sanitizedEmail = sanitizeText(clientValues.email);
      const sanitizedNotes = sanitizeText(notes);

      let vehiclePayload: {
        id?: string;
        plate?: string;
        brand: string;
        model: string;
        color?: string;
        type: string;
        size: string;
      };

      if (resolvedVehicle && !isNewVehicle) {
        vehiclePayload = {
          id: resolvedVehicle.id,
          plate: resolvedVehicle.plate || undefined,
          brand: resolvedVehicle.brand,
          model: resolvedVehicle.model,
          color: resolvedVehicle.color || undefined,
          type: resolvedVehicle.type,
          size: resolvedVehicle.size,
        };
      } else {
        const vehicleValues = vehicleForm.getFieldsValue();
        vehiclePayload = {
          plate: sanitizePlate(vehicleValues.plate) || undefined,
          brand: sanitizeText(vehicleValues.brand),
          model: sanitizeText(vehicleValues.model),
          color: sanitizeText(vehicleValues.color) || undefined,
          type: vehicleValues.type,
          size: vehicleValues.size,
        };
      }

      const appointment = await createWalkIn.mutateAsync({
        shopId,
        user: {
          id: isKnownUser ? existingUser.id : undefined,
          firstName: sanitizedName,
          phone: sanitizedPhone,
          email: sanitizedEmail || undefined,
        },
        vehicle: vehiclePayload,
        serviceIds: selectedServiceIds,
        notes: sanitizedNotes || undefined,
      });

      const createdId = appointment?.id;

      if (!createdId || !validateUUID(createdId)) {
        throw new Error("ID do agendamento nao retornado pelo backend.");
      }

      message.success("Sucesso! Agendamento criado.");
      setCreatedAppointmentId(createdId);
      setCurrentStep(3);
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

  const stepsCurrent = Math.min(currentStep, stepItems.length - 1);

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
      <div className="space-y-5">
        <Steps
          current={stepsCurrent}
          items={stepItems}
          size="small"
        />
      </div>

      <div className="space-y-4 mt-5">
      <div style={{ display: currentStep === 0 ? "block" : "none" }}>

        <div className="space-y-4">
          {isKnownUser && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <UserOutlined />
                <Text strong className="!text-emerald-700 dark:!text-emerald-300">
                  {existingUser.firstName}
                </Text>
                {existingUser.phone && (
                  <span className="ml-auto px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                    {maskPhone(existingUser.phone)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {showVehiclePicker && !isNewVehicle && (
          <>
            {vehiclesLoading ? (
              <div className="flex justify-center py-6">
                <Spin tip="Carregando veículos..." />
              </div>
            ) : (
              <>
                <Title level={5} className="!text-zinc-700 dark:!text-zinc-200 !mb-3">
                  Selecione o veículo
                </Title>
                <Radio.Group
                  value={pickedVehicleId}
                  onChange={(e) => setPickedVehicleId(e.target.value)}
                  className="w-full"
                >
                  <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                    {userVehicles.map((v) => (
                      <label
                        key={v.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          pickedVehicleId === v.id
                            ? "border-emerald-400 dark:border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/10"
                            : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                        }`}
                      >
                        <Radio value={v.id} />
                        <CarOutlined className="text-lg text-zinc-400" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Text strong className="text-zinc-800 dark:text-zinc-100">
                              {v.brand} {v.model}
                            </Text>
                            {v.color && (
                              <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                                {v.color}
                              </Text>
                            )}
                          </div>
                          {v.plate && (
                            <Text className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                              {formatVehiclePlate(v.plate)}
                            </Text>
                          )}
                        </div>
                        <Tag className="!text-xs">{v.type}</Tag>
                      </label>
                    ))}
                  </div>
                </Radio.Group>

                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setIsNewVehicle(true);
                    setPickedVehicleId(null);
                    vehicleForm.setFieldsValue({
                      plate: "",
                      brand: undefined,
                      model: undefined,
                      color: "",
                      type: "CAR",
                      size: "MEDIUM",
                    });
                  }}
                  className="w-full !mt-3 !rounded-lg"
                >
                  Novo veículo
                </Button>
              </>
            )}
          </>
        )}

        {(!showVehiclePicker || isNewVehicle) && (
          <>
            {isNewVehicle && (
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => {
                  setIsNewVehicle(false);
                }}
                className="!px-0 !mb-2"
              >
                Voltar à lista de veículos
              </Button>
            )}
        <Form
          form={vehicleForm}
          layout="vertical"
          requiredMark="optional"
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
            <Form.Item name="type" label="Tipo de Veículo" rules={[{ required: true, message: "Tipo é obrigatório" }]}>
              <Select
                options={VEHICLE_TYPE_OPTIONS}
                disabled={!!existingVehicle}
                onChange={() => {
                  setSelectedBrandCode(null);
                  vehicleForm.setFieldValue("brand", undefined);
                  vehicleForm.setFieldValue("model", undefined);
                }}
              />
            </Form.Item>

            <Form.Item name="size" label="Porte" rules={[{ required: true, message: "Porte é obrigatório" }]}>
              <Select
                options={VEHICLE_SIZE_OPTIONS}
                disabled={!!existingVehicle}
              />
            </Form.Item>

            <Form.Item name="color" label="Cor">
              <Input placeholder="Ex: Branco, Preto..." readOnly={!!existingVehicle} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item
              name="brand"
              label="Marca"
              rules={[{ required: true, message: "Marca é obrigatória" }]}
            >
              <Select
                showSearch
                placeholder={brandsLoading ? "Carregando marcas..." : "Selecione a marca"}
                options={brandOptions}
                loading={brandsLoading}
                disabled={!!existingVehicle}
                filterOption={(input, option) =>
                  String(option?.label || "").toLowerCase().includes(input.toLowerCase())
                }
                onChange={(_value, option) => {
                  const opt = option as { code?: string };
                  setSelectedBrandCode(opt?.code || null);
                  vehicleForm.setFieldValue("model", undefined);
                }}
                notFoundContent={brandsLoading ? <Spin size="small" /> : "Nenhuma marca encontrada"}
              />
            </Form.Item>

            <Form.Item
              name="model"
              label="Modelo"
              rules={[{ required: true, message: "Modelo é obrigatório" }]}
            >
              <Select
                showSearch
                placeholder={!selectedBrandCode ? "Selecione a marca primeiro" : "Selecione o modelo"}
                options={modelOptions}
                loading={modelsLoading}
                disabled={!!existingVehicle || !selectedBrandCode}
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
        </Form>
          </>
        )}

        {resolvedVehicle && !isNewVehicle && upcomingAppointments.length > 0 && (
          <div className="mt-4 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CalendarOutlined className="text-amber-600 dark:text-amber-400" />
              <Text strong className="!text-amber-700 dark:!text-amber-300">
                Agendamentos futuros ({upcomingAppointments.length})
              </Text>
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {upcomingAppointments.map((appt: Appointment) => (
                <div
                  key={appt.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <ClockCircleOutlined className="text-zinc-400 text-xs" />
                      <Text strong className="text-sm text-zinc-800 dark:text-zinc-100">
                        {format(parseISO(appt.scheduledAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </Text>
                      <Tag
                        color={
                          appt.status === "PENDING" ? "gold" :
                          appt.status === "CONFIRMED" ? "blue" :
                          "cyan"
                        }
                        className="!text-xs"
                      >
                        {appt.status === "PENDING" ? "Pendente" :
                         appt.status === "CONFIRMED" ? "Confirmado" :
                         "Aguardando"}
                      </Tag>
                    </div>
                    {appt.services?.length > 0 && (
                      <Text className="text-xs text-zinc-500 dark:text-zinc-400 block mt-1">
                        {appt.services.map((s) => s.serviceName).join(", ")}
                      </Text>
                    )}
                  </div>
                  <Space size={4} className="flex-shrink-0 ml-3">
                    <Button
                      size="small"
                      danger
                      icon={<CloseCircleOutlined />}
                      onClick={async () => {
                        try {
                          await cancelAppointment.mutateAsync({ id: appt.id });
                          message.success("Agendamento cancelado.");
                        } catch {
                          message.error("Erro ao cancelar.");
                        }
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      icon={<CalendarOutlined />}
                      className="!bg-amber-500 hover:!bg-amber-400 !border-0"
                      onClick={async () => {
                        try {
                          await updateAppointmentStatus.mutateAsync({
                            id: appt.id,
                            status: "WAITING",
                          });
                          message.success("Agendamento movido para hoje.");
                        } catch {
                          message.error("Erro ao atualizar.");
                        }
                      }}
                    >
                      Trazer para Hoje
                    </Button>
                  </Space>
                </div>
              ))}
            </div>
          </div>
        )}

        {resolvedVehicle && !isNewVehicle && upcomingLoading && (
          <div className="flex justify-center py-4 mt-3">
            <Spin size="small" tip="Verificando agendamentos..." />
          </div>
        )}

      </div>

      <div style={{ display: currentStep === 1 ? "block" : "none" }}>
        <Form
          form={clientForm}
          layout="vertical"
          requiredMark="optional"
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
              label="Telefone"
              rules={[{ required: true, message: "Telefone é obrigatório" }]}
            >
              <Input
                placeholder="(00) 00000-0000"
                maxLength={15}
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

      <div style={{ display: currentStep === 3 ? "block" : "none" }}>
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10 p-5">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircleOutlined className="text-xl text-emerald-600 dark:text-emerald-400" />
            <Title level={4} className="!m-0 !text-emerald-700 dark:!text-emerald-300">
              Sucesso! Agendamento Criado
            </Title>
          </div>
          <Text className="text-zinc-700 dark:text-zinc-300">
            O atendimento foi iniciado e você pode registrar a vistoria agora.
          </Text>
        </div>
      </div>
      </div>

      <div className="flex justify-between mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Button
          disabled={currentStep === 0 || currentStep === 3 || submitting}
          onClick={handlePrev}
          icon={<ArrowLeftOutlined />}
          className="!rounded-lg"
        >
          Voltar
        </Button>

        <Space>
          {currentStep < 3 && (
            <Button onClick={onClose} disabled={submitting} className="!rounded-lg">
              Cancelar
            </Button>
          )}

          {currentStep < 2 ? (
            <Button
              type="primary"
              onClick={handleNext}
              className="!bg-emerald-600 hover:!bg-emerald-500 !border-0 !rounded-lg"
            >
              Próximo
              <ArrowRightOutlined />
            </Button>
          ) : currentStep === 2 ? (
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
          ) : currentStep === 3 ? (
            <>
              <Button
                type="primary"
                icon={<FileAddOutlined />}
                onClick={() => setChecklistModalOpen(true)}
                disabled={!createdAppointmentId}
                className="!rounded-lg"
              >
                Realizar Vistoria Agora
              </Button>
              <Button onClick={onClose} className="!rounded-lg">
                Finalizar
              </Button>
            </>
          ) : null}
        </Space>
      </div>

      {createdAppointmentId && (
        <ChecklistModal
          appointmentId={createdAppointmentId}
          open={checklistModalOpen}
          onClose={() => setChecklistModalOpen(false)}
        />
      )}
    </Modal>
  );
};
