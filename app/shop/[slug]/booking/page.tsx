"use client";

import { use, useState, useEffect, useMemo } from "react";
import {
  Typography,
  Steps,
  Card,
  Spin,
  Alert,
  Button,
  Row,
  Col,
  message,
  Result,
} from "antd";
import {
  CarOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";

import { useAuth } from "@/contexts/AuthContext";
import { useShop } from "@/contexts/ShopContext";
import { useShopBySlug } from "@/hooks/useShops";
import { useServicesByShop } from "@/hooks/useServices";
import { useUserVehicles } from "@/hooks/useVehicles";
import { useShopSchedules } from "@/hooks/useSchedules";
import { useShopAppointmentsByDate, useCreateAppointment } from "@/hooks/useAppointments";
import {
  ServiceCard,
  VehicleSelector,
  DateTimePicker,
  BookingSummary,
  AddVehicleModal,
} from "@/components/booking";
import { Services } from "@/types/services";

dayjs.locale("pt-br");

const { Title, Text } = Typography;

interface BookingPageProps {
  params: Promise<{ slug: string }>;
}

export default function BookingPage({ params }: BookingPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { setShopBySlug } = useShop();

  // Estados do fluxo de agendamento
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<Services[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Queries
  const { data: shop, isLoading: shopLoading, error: shopError } = useShopBySlug(slug);
  const { data: services = [], isLoading: servicesLoading } = useServicesByShop(
    shop?.id || null,
    !!shop
  );
  const { data: vehicles = [], isLoading: vehiclesLoading, refetch: refetchVehicles } =
    useUserVehicles(user?.id || null, !!user);
  const { data: schedules = [], isLoading: schedulesLoading } = useShopSchedules(
    shop?.id || null,
    !!shop
  );
  const { data: existingAppointments = [], isLoading: appointmentsLoading } =
    useShopAppointmentsByDate(
      shop?.id || null,
      selectedDate?.format("YYYY-MM-DD") || null,
      !!shop && !!selectedDate
    );

  const createAppointment = useCreateAppointment();

  // Define o shop no contexto quando carregado
  useEffect(() => {
    if (slug) {
      setShopBySlug(slug);
    }
  }, [slug, setShopBySlug]);

  // Redirecionar para login se não autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(`/shop/${slug}/booking`)}`);
    }
  }, [authLoading, isAuthenticated, router, slug]);

  // Cálculos
  const selectedVehicle = useMemo(() => {
    return vehicles.find((v) => v.id === selectedVehicleId) || null;
  }, [vehicles, selectedVehicleId]);

  const totalDuration = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.duration, 0);
  }, [selectedServices]);

  const totalPrice = useMemo(() => {
    return selectedServices.reduce(
      (sum, s) => sum + parseFloat(s.price),
      0
    );
  }, [selectedServices]);

  // Handlers
  const handleServiceToggle = (service: Services) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      if (exists) {
        return prev.filter((s) => s.id !== service.id);
      }
      return [...prev, service];
    });
  };

  const handleDateChange = (date: Dayjs) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleConfirmBooking = async () => {
    if (
      !user ||
      !shop ||
      !selectedVehicle ||
      !selectedDate ||
      !selectedTime ||
      selectedServices.length === 0
    ) {
      message.error("Por favor, preencha todos os campos");
      return;
    }

    // Monta o horário de início
    const [hour, minute] = selectedTime.split(":").map(Number);
    const scheduledAt = selectedDate.hour(hour).minute(minute).second(0);
    const endTime = scheduledAt.add(totalDuration, "minute");

    try {
      await createAppointment.mutateAsync({
        scheduledAt: scheduledAt.toISOString(),
        endTime: endTime.toISOString(),
        totalPrice,
        totalDuration,
        userId: user.id,
        shopId: shop.id,
        vehicleId: selectedVehicle.id,
        serviceIds: selectedServices.map((s) => ({
          serviceId: s.id,
          serviceName: s.name,
          servicePrice: parseFloat(s.price),
          duration: s.duration,
        })),
      });

      setBookingComplete(true);
      message.success("Agendamento realizado com sucesso!");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        err.response?.data?.message || "Erro ao criar agendamento";
      message.error(errorMessage);
    }
  };

  const canProceedToStep = (step: number) => {
    switch (step) {
      case 0:
        return !!selectedVehicleId;
      case 1:
        return selectedServices.length > 0;
      case 2:
        return !!selectedDate && !!selectedTime;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceedToStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 2));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Loading states
  if (authLoading || shopLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  if (shopError || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Alert
          type="error"
          message="Loja não encontrada"
          description="A loja que você está procurando não existe ou foi desativada."
          showIcon
        />
      </div>
    );
  }

  // Tela de sucesso
  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center">
          <Result
            status="success"
            title="Agendamento Confirmado!"
            subTitle={
              <div className="space-y-2">
                <Text>
                  Seu agendamento foi realizado com sucesso para{" "}
                  <strong>
                    {selectedDate?.format("DD/MM/YYYY")} às {selectedTime}
                  </strong>
                </Text>
                <br />
                <Text type="secondary">
                  Você receberá uma confirmação em breve.
                </Text>
              </div>
            }
            extra={[
              <Button
                type="primary"
                key="shop"
                onClick={() => router.push(`/shop/${slug}`)}
              >
                Voltar para a Loja
              </Button>,
              <Button key="home" onClick={() => router.push("/")}>
                Ir para Início
              </Button>,
            ]}
          />
        </Card>
      </div>
    );
  }

  const steps = [
    {
      title: "Veículo",
      icon: <CarOutlined />,
      description: "Selecione seu veículo",
    },
    {
      title: "Serviços",
      icon: <AppstoreOutlined />,
      description: "Escolha os serviços",
    },
    {
      title: "Data e Hora",
      icon: <CalendarOutlined />,
      description: "Agende o horário",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push(`/shop/${slug}`)}
            >
              Voltar
            </Button>
            <div>
              <Title level={4} className="!mb-0">
                Agendar em {shop.name}
              </Title>
              <Text type="secondary">
                Olá, {user?.firstName}! Complete seu agendamento abaixo.
              </Text>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Steps */}
        <Card className="mb-6">
          <Steps
            current={currentStep}
            items={steps.map((step, index) => ({
              ...step,
              status:
                index < currentStep
                  ? "finish"
                  : index === currentStep
                    ? "process"
                    : "wait",
            }))}
          />
        </Card>

        <Row gutter={[24, 24]}>
          {/* Conteúdo Principal */}
          <Col xs={24} lg={16}>
            <Card>
              {/* Step 0: Veículo */}
              {currentStep === 0 && (
                <div>
                  <Title level={4} className="!mb-6">
                    <CarOutlined className="mr-2" />
                    Selecione seu Veículo
                  </Title>

                  {vehiclesLoading ? (
                    <div className="flex justify-center py-8">
                      <Spin />
                    </div>
                  ) : (
                    <VehicleSelector
                      vehicles={vehicles}
                      selectedVehicleId={selectedVehicleId}
                      onSelect={setSelectedVehicleId}
                      onAddVehicle={() => setShowAddVehicleModal(true)}
                    />
                  )}
                </div>
              )}

              {/* Step 1: Serviços */}
              {currentStep === 1 && (
                <div>
                  <Title level={4} className="!mb-2">
                    <AppstoreOutlined className="mr-2" />
                    Escolha os Serviços
                  </Title>
                  <Text type="secondary" className="block mb-6">
                    Selecione um ou mais serviços para seu agendamento
                  </Text>

                  {servicesLoading ? (
                    <div className="flex justify-center py-8">
                      <Spin />
                    </div>
                  ) : services.length === 0 ? (
                    <Alert
                      type="info"
                      message="Nenhum serviço disponível"
                      showIcon
                    />
                  ) : (
                    <div className="space-y-4">
                      {services.map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          selected={selectedServices.some(
                            (s) => s.id === service.id
                          )}
                          onSelect={handleServiceToggle}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Data e Hora */}
              {currentStep === 2 && (
                <div>
                  <Title level={4} className="!mb-2">
                    <CalendarOutlined className="mr-2" />
                    Escolha a Data e Horário
                  </Title>
                  <Text type="secondary" className="block mb-6">
                    Selecione quando deseja realizar o serviço
                  </Text>

                  <DateTimePicker
                    shopSchedules={schedules}
                    existingAppointments={existingAppointments}
                    shop={shop}
                    totalDuration={totalDuration}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onDateChange={handleDateChange}
                    onTimeChange={setSelectedTime}
                    loading={schedulesLoading || appointmentsLoading}
                  />
                </div>
              )}

              {/* Navegação */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  Voltar
                </Button>

                {currentStep < 2 ? (
                  <Button
                    type="primary"
                    onClick={nextStep}
                    disabled={!canProceedToStep(currentStep)}
                  >
                    Continuar
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={handleConfirmBooking}
                    loading={createAppointment.isPending}
                    disabled={
                      !canProceedToStep(2) ||
                      selectedServices.length === 0 ||
                      !selectedVehicleId
                    }
                  >
                    Confirmar Agendamento
                  </Button>
                )}
              </div>
            </Card>
          </Col>

          {/* Sidebar - Resumo */}
          <Col xs={24} lg={8}>
            <BookingSummary
              selectedServices={selectedServices}
              selectedVehicle={selectedVehicle}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              totalPrice={totalPrice}
              totalDuration={totalDuration}
              onConfirm={handleConfirmBooking}
              loading={createAppointment.isPending}
              disabled={currentStep < 2}
            />
          </Col>
        </Row>
      </div>

      {/* Modal para adicionar veículo */}
      <AddVehicleModal
        open={showAddVehicleModal}
        onClose={() => setShowAddVehicleModal(false)}
        onSuccess={() => {
          refetchVehicles();
        }}
      />
    </div>
  );
}
