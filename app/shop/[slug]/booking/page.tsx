"use client";

import { use, useState, useEffect, useMemo } from "react";
import { Alert, message } from "antd";
import { useRouter } from "next/navigation";
import { parseISO } from "date-fns";
import { setTimeOnDate, addMinutes, formatDateInTimezone, DEFAULT_TIMEZONE } from "@/utils/dateUtils";

import { useAuth } from "@/contexts/AuthContext";
import { useShop } from "@/contexts/ShopContext";
import { useShopBySlug } from "@/hooks/useShops";
import { usePublicServicesByShop } from "@/hooks/useServices";
import { useUserVehicles } from "@/hooks/useVehicles";
import { usePublicShopSchedules } from "@/hooks/useSchedules";
import { usePublicAvailability, useCreateAppointment } from "@/hooks/useAppointments";
import {
  AddVehicleModal,
  BookingHeader,
  BookingSteps,
  BookingReviewCard,
} from "@/components/booking";
import { Services } from "@/types/services";
import { VehicleStep } from "@/components/shop/booking/VehicleStep";
import { GuestVehicleData } from "@/components/shop/booking/GuestVehicleForm";
import { ServicesStep } from "@/components/shop/booking/ServicesStep";
import { DateTimeStep } from "@/components/shop/booking/DateTimeStep";
import { BookingSuccess } from "@/components/shop/booking/BookingSuccess";
import { LoginModal } from "@/components/shop/booking/LoginModal";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { timeApiService } from "@/services/timeApi";

interface BookingPageProps {
  params: Promise<{ slug: string }>;
}

const STORAGE_KEY = "lavacar_booking_draft";

interface BookingDraft {
  step: number;
  vehicleId: string | null;
  guestVehicle: GuestVehicleData | null;
  services: Services[];
  date: string | null;
  time: string | null;
  shopSlug: string;
}

export default function BookingPage({ params }: BookingPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { setShopBySlug } = useShop();

  // Booking flow states
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [guestVehicle, setGuestVehicle] = useState<GuestVehicleData | null>(null);
  const [selectedServices, setSelectedServices] = useState<Services[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [userTimezone, setUserTimezone] = useState<string>("");

  // Queries
  const { data: shop, isLoading: shopLoading, error: shopError } = useShopBySlug(slug);
  const { data: servicesData, isLoading: servicesLoading } = usePublicServicesByShop(
    shop?.id || null,
    { isActive: true },
    !!shop
  );
  const services: Services[] = servicesData?.data ?? [];
  const { data: vehicles = [], isLoading: vehiclesLoading, refetch: refetchVehicles } =
    useUserVehicles(user?.id || null, !!user);
  const { data: schedules = [], isLoading: schedulesLoading } = usePublicShopSchedules(
    shop?.id || null,
    !!shop
  );
  const selectedServiceIds = useMemo(() => selectedServices.map((service) => service.id), [selectedServices]);

  const { data: availabilityData, isLoading: availabilityLoading } = usePublicAvailability(
    shop?.id || null,
    selectedDate ? formatDateInTimezone(selectedDate, "yyyy-MM-dd", shop?.timeZone || DEFAULT_TIMEZONE) : null,
    selectedServiceIds,
    !!shop && !!selectedDate && selectedServiceIds.length > 0
  );

  const availableSlots = availabilityData?.availableSlots ?? [];

  const createAppointment = useCreateAppointment();

  // Set shop context
  useEffect(() => {
    if (slug) {
      setShopBySlug(slug);
    }
  }, [slug, setShopBySlug]);

  useEffect(() => {
    let active = true;

    timeApiService.detectTimezoneByIp()
      .then((tz) => {
        if (!active) return;
        setUserTimezone(tz || Intl.DateTimeFormat().resolvedOptions().timeZone || "");
      })
      .catch(() => {
        if (!active) return;
        setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "");
      });

    return () => {
      active = false;
    };
  }, []);

  // Restore draft from sessionStorage
  useEffect(() => {
    try {
      const draftJson = sessionStorage.getItem(STORAGE_KEY);
      if (draftJson) {
        const draft: BookingDraft = JSON.parse(draftJson);
        // Only restore if it matches current shop
        if (draft.shopSlug === slug) {
          setCurrentStep(draft.step);
          setSelectedVehicleId(draft.vehicleId);
          setGuestVehicle(draft.guestVehicle);
          setSelectedServices(draft.services);
          if (draft.date) setSelectedDate(parseISO(draft.date));
          setSelectedTime(draft.time);
        }
      }
    } catch (e) {
      console.error("Failed to restore booking draft", e);
    } finally {
      setIsRestoring(false);
    }
  }, [slug]);

  // Save draft to sessionStorage
  useEffect(() => {
    if (isRestoring) return;

    // Don't save if complete
    if (bookingComplete) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }

    const draft: BookingDraft = {
      step: currentStep,
      vehicleId: selectedVehicleId,
      guestVehicle,
      services: selectedServices,
      date: selectedDate ? selectedDate.toISOString() : null,
      time: selectedTime,
      shopSlug: slug,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [
    currentStep,
    selectedVehicleId,
    guestVehicle,
    selectedServices,
    selectedDate,
    selectedTime,
    slug,
    bookingComplete,
    isRestoring
  ]);

  // Memoized calculations
  const selectedVehicle = useMemo(() => {
    if (!isAuthenticated && guestVehicle) {
        return {
            id: 'guest',
            brand: guestVehicle.brand,
            model: guestVehicle.model,
            plate: 'Visitante',
            type: guestVehicle.type
        };
    }
    return vehicles.find((v) => v.id === selectedVehicleId) || null;
  }, [vehicles, selectedVehicleId, isAuthenticated, guestVehicle]);

  const totalDuration = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.duration, 0);
  }, [selectedServices]);

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + parseFloat(s.price), 0);
  }, [selectedServices]);

  // Handlers
  const handleServiceToggle = (service: Services) => {
    setSelectedTime(null);
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      if (exists) {
        return prev.filter((s) => s.id !== service.id);
      }
      return [...prev, service];
    });
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    
    // We rely on session storage to restore state after redirect back from login
    // If the login modal does a redirect, this function might not even run on this page instance.
    // But if it was an inline login or popup, this would handle the aftermath.
    
    refetchVehicles().then(({ data: userVehicles }) => {
        // Try to match guest vehicle to a real vehicle if possible, or just ask user to select.
        // If we had a guest vehicle selected, we might want to clear it and force selection of a real vehicle.
        
        if (guestVehicle) {
            // Check if user has a similar vehicle? 
            // Simplified: Just keep guest vehicle as a fallback visual but require real selection
             setGuestVehicle(null);
             setSelectedVehicleId(null);
             message.info("Login realizado! Por favor, selecione seu veículo para continuar.");
             setCurrentStep(0);
        } else if (!userVehicles || userVehicles.length === 0) {
            setShowAddVehicleModal(true);
        } else if (!selectedVehicleId) {
             message.info("Por favor, selecione seu veículo.");
             setCurrentStep(0);
        }
    });
  };

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
        setShowLoginModal(true);
        return;
    }

    if (!selectedVehicleId) {
        message.warning("Selecione um veículo para continuar");
        setCurrentStep(0);
        return;
    }

    if (!user || !shop || !selectedDate || !selectedTime || selectedServices.length === 0) {
      message.error("Por favor, preencha todos os campos");
      return;
    }

    const scheduledAt = setTimeOnDate(selectedDate, selectedTime, shop.timeZone || DEFAULT_TIMEZONE);
    const endTime = addMinutes(scheduledAt, totalDuration);

    try {
      await createAppointment.mutateAsync({
        scheduledAt: scheduledAt.toISOString(),
        endTime: endTime.toISOString(),
        totalPrice,
        totalDuration,
        userId: user.id,
        shopId: shop.id,
        vehicleId: selectedVehicleId,
        serviceIds: selectedServices.map((s) => ({
          serviceId: s.id,
          serviceName: s.name,
          servicePrice: parseFloat(s.price),
          duration: s.duration,
        })),
      });

      setBookingComplete(true);
      sessionStorage.removeItem(STORAGE_KEY);
      message.success("Agendamento realizado com sucesso!");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || "Erro ao criar agendamento";
      message.error(errorMessage);
    }
  };

  const canProceedToStep = (step: number) => {
    switch (step) {
      case 0:
        return isAuthenticated ? !!selectedVehicleId : !!guestVehicle;
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  // Loading state
  if (shopLoading || isRestoring) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#09090b]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <span className="block mt-4 text-slate-500 font-medium">Carregando...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (shopError || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#09090b] p-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-3xl p-12">
          <div className="text-7xl mb-6">🚗</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            Loja não encontrada
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            A loja que você está procurando não existe ou foi desativada.
          </p>
          <button 
             onClick={() => router.push("/")}
             className="px-8 py-3 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-black dark:hover:bg-white font-bold rounded-xl hover:scale-105 transition-all"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (bookingComplete) {
    return (
      <BookingSuccess
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedServices={selectedServices}
        totalDuration={totalDuration}
        totalPrice={totalPrice}
        formatDuration={formatDuration}
        onReturnToShop={() => {
            setBookingComplete(false);
            setCurrentStep(0);
            setSelectedDate(null);
            setSelectedTime(null);
            setSelectedServices([]);
        }}
        onReturnToHome={() => router.push("/client/appointments")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
      {/* Header */}
      <BookingHeader
        shop={shop}
        onBack={() => router.push(`/shop/${slug}`)}
        userName={user?.firstName}
      />

      {userTimezone && shop.timeZone && userTimezone !== shop.timeZone && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert
            type="info"
            showIcon
            message={`Seu fuso horário (${userTimezone}) é diferente do fuso da loja (${shop.timeZone}). Os horários exibidos seguem o fuso da loja.`}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Steps */}
        <div className="mb-12">
          <BookingSteps currentStep={currentStep} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-[#18181b] rounded-3xl border border-slate-200 dark:border-[#27272a] shadow-xl overflow-hidden min-h-[500px]">
              {/* Step 0: Vehicle Selection */}
              {currentStep === 0 && (
                <VehicleStep
                  isAuthenticated={isAuthenticated}
                  isLoading={vehiclesLoading}
                  vehicles={vehicles}
                  selectedVehicleId={selectedVehicleId}
                  onSelectVehicle={setSelectedVehicleId}
                  onAddVehicle={() => setShowAddVehicleModal(true)}
                  onLogin={() => setShowLoginModal(true)}
                  guestVehicle={guestVehicle}
                  onGuestVehicleSelect={setGuestVehicle}
                />
              )}

              {/* Step 1: Services Selection */}
              {currentStep === 1 && (
                <ServicesStep
                  isLoading={servicesLoading}
                  services={services}
                  selectedServices={selectedServices}
                  totalDuration={totalDuration}
                  totalPrice={totalPrice}
                  onToggleService={handleServiceToggle}
                  formatDuration={formatDuration}
                />
              )}

              {/* Step 2: Date & Time Selection */}
              {currentStep === 2 && (
                <DateTimeStep
                  schedules={schedules}
                  availableSlots={availableSlots}
                  shop={shop}
                  totalDuration={totalDuration}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onDateChange={handleDateChange}
                  onTimeChange={setSelectedTime}
                  isLoading={schedulesLoading || availabilityLoading}
                />
              )}

              {/* Navigation Footer */}
              <div className="border-t border-slate-200 dark:border-[#27272a] p-6 sm:p-8 bg-slate-50/50 dark:bg-[#09090b]/50 flex items-center justify-between backdrop-blur-sm">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                    ${
                      currentStep === 0
                        ? "opacity-0 pointer-events-none"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-200 dark:hover:bg-[#27272a]"
                    }
                  `}
                >
                  <ArrowLeftOutlined /> Voltar
                </button>

                {currentStep < 2 ? (
                  <button
                    onClick={nextStep}
                    disabled={!canProceedToStep(currentStep)}
                    className={`
                       flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all
                       ${
                         !canProceedToStep(currentStep)
                           ? "bg-slate-200 dark:bg-[#27272a] text-slate-400 dark:text-slate-600 cursor-not-allowed"
                           : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-black dark:hover:bg-white hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]"
                       }
                    `}
                  >
                    Continuar <ArrowRightOutlined />
                  </button>
                ) : (
                  <button
                    onClick={handleConfirmBooking}
                    disabled={
                      !canProceedToStep(2) ||
                      selectedServices.length === 0 ||
                      !selectedVehicleId ||
                      createAppointment.isPending
                    }
                    className={`
                       lg:hidden flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all
                       ${
                         !canProceedToStep(2) || createAppointment.isPending
                           ? "bg-slate-200 dark:bg-[#27272a] text-slate-400 dark:text-slate-600 cursor-not-allowed"
                           : "bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
                       }
                    `}
                  >
                    {createAppointment.isPending
                      ? "Agendando..."
                      : "Confirmar Agendamento"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Review */}
          <div className="lg:col-span-4">
            <BookingReviewCard
              selectedServices={selectedServices}
              selectedVehicle={selectedVehicle}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              totalPrice={totalPrice}
              totalDuration={totalDuration}
              isLoading={createAppointment.isPending}
              disabled={currentStep < 2}
              onConfirm={handleConfirmBooking}
            />
          </div>
        </div>
      </main>

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        open={showAddVehicleModal}
        onClose={() => setShowAddVehicleModal(false)}
        onSuccess={() => {
          refetchVehicles();
        }}
      />
      
      {/* Login Modal */}
      <LoginModal 
        open={showLoginModal}
        onCancel={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
