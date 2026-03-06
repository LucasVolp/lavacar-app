"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { message } from "antd";
import { parseISO } from "date-fns";
import { setTimeOnDate, addMinutes, formatDateInTimezone, DEFAULT_TIMEZONE } from "@/utils/dateUtils";
import { useAuth } from "@/contexts/AuthContext";
import { useShop } from "@/contexts/ShopContext";
import { useShopBySlug } from "@/hooks/useShops";
import { usePublicServicesByShop } from "@/hooks/useServices";
import { useUserVehicles } from "@/hooks/useVehicles";
import { usePublicShopSchedules } from "@/hooks/useSchedules";
import { usePublicAvailability, useCreateAppointment } from "@/hooks/useAppointments";
import { Services } from "@/types/services";
import { timeApiService } from "@/services/timeApi";

const STORAGE_KEY = "lavacar_booking_draft";

interface BookingDraft {
  step: number;
  vehicleId: string | null;
  services: Services[];
  date: string | null;
  time: string | null;
  shopSlug: string;
  guestUserId?: string | null;
}

export function useBookingFlow(slug: string) {
  const { user, isAuthenticated } = useAuth();
  const { setShopBySlug } = useShop();

  // Core booking state
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<Services[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [userTimezone, setUserTimezone] = useState("");
  const [guestUserId, setGuestUserId] = useState<string | null>(null);

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

  const selectedServiceIds = useMemo(
    () => selectedServices.map((s) => s.id),
    [selectedServices]
  );

  const { data: availabilityData, isLoading: availabilityLoading } = usePublicAvailability(
    shop?.id || null,
    selectedDate
      ? formatDateInTimezone(selectedDate, "yyyy-MM-dd", shop?.timeZone || DEFAULT_TIMEZONE)
      : null,
    selectedServiceIds,
    !!shop && !!selectedDate && selectedServiceIds.length > 0
  );

  const availableSlots = availabilityData?.availableSlots ?? [];
  const createAppointment = useCreateAppointment();

  // ----- Side Effects -----

  useEffect(() => {
    if (slug) setShopBySlug(slug);
  }, [slug, setShopBySlug]);

  useEffect(() => {
    setUserTimezone(timeApiService.detectTimezone());
  }, []);

  // Restore draft from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const draft: BookingDraft = JSON.parse(raw);
        if (draft.shopSlug === slug) {
          setCurrentStep(draft.step);
          setSelectedVehicleId(draft.vehicleId);
          setSelectedServices(draft.services);
          if (draft.date) setSelectedDate(parseISO(draft.date));
          setSelectedTime(draft.time);
          if (draft.guestUserId) setGuestUserId(draft.guestUserId);
        }
      }
    } catch {
      // silently ignore corrupt drafts
    } finally {
      setIsRestoring(false);
    }
  }, [slug]);

  // Persist draft to sessionStorage
  useEffect(() => {
    if (isRestoring) return;
    if (bookingComplete) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    const draft: BookingDraft = {
      step: currentStep,
      vehicleId: selectedVehicleId,
      services: selectedServices,
      date: selectedDate ? selectedDate.toISOString() : null,
      time: selectedTime,
      shopSlug: slug,
      guestUserId,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [currentStep, selectedVehicleId, selectedServices, selectedDate, selectedTime, slug, bookingComplete, isRestoring, guestUserId]);

  // ----- Computed -----

  const selectedVehicle = useMemo(() => {
    if (isAuthenticated && selectedVehicleId && selectedVehicleId !== "new-vehicle-pending") {
      return vehicles.find((v) => v.id === selectedVehicleId) || null;
    }
    return null;
  }, [vehicles, selectedVehicleId, isAuthenticated]);

  const totalDuration = useMemo(
    () => selectedServices.reduce((sum, s) => sum + s.duration, 0),
    [selectedServices]
  );

  const totalPrice = useMemo(
    () => selectedServices.reduce((sum, s) => sum + parseFloat(s.price), 0),
    [selectedServices]
  );

  // ----- Handlers -----

  const handleServiceToggle = useCallback((service: Services) => {
    setSelectedTime(null);
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      return exists ? prev.filter((s) => s.id !== service.id) : [...prev, service];
    });
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  }, []);

  const handleGuestUserCreated = useCallback((userId: string, vehicleId: string) => {
    setGuestUserId(userId);
    setSelectedVehicleId(vehicleId);
    message.success("Tudo certo! Vamos escolher os serviços.");
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleLoginSuccess = useCallback(() => {
    refetchVehicles().then(({ data: userVehicles }) => {
      if (userVehicles && userVehicles.length > 0 && !selectedVehicleId) {
        message.info("Por favor, selecione seu veículo.");
        setCurrentStep(0);
      }
    });
  }, [refetchVehicles, selectedVehicleId]);

  const handleConfirmBooking = useCallback(async () => {
    if (!selectedVehicleId || selectedVehicleId === "new-vehicle-pending") {
      message.warning("Selecione um veículo para continuar");
      setCurrentStep(0);
      return;
    }

    const bookingUserId = user?.id || guestUserId;
    if (!bookingUserId || !shop || !selectedDate || !selectedTime || selectedServices.length === 0) {
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
        userId: bookingUserId,
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
      message.error(err.response?.data?.message || "Erro ao criar agendamento");
    }
  }, [selectedVehicleId, user, guestUserId, shop, selectedDate, selectedTime, selectedServices, totalDuration, totalPrice, createAppointment]);

  const canProceedToStep = useCallback(
    (step: number) => {
      switch (step) {
        case 0:
          return !!selectedVehicleId && selectedVehicleId !== "new-vehicle-pending";
        case 1:
          return selectedServices.length > 0;
        case 2:
          return !!selectedDate && !!selectedTime;
        default:
          return false;
      }
    },
    [selectedVehicleId, selectedServices, selectedDate, selectedTime]
  );

  const nextStep = useCallback(() => {
    if (canProceedToStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 2));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [canProceedToStep, currentStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const resetBooking = useCallback(() => {
    setBookingComplete(false);
    setCurrentStep(0);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedServices([]);
    setSelectedVehicleId(null);
    setGuestUserId(null);
  }, []);

  const formatDuration = useCallback((minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }, []);

  return {
    // State
    currentStep,
    setCurrentStep,
    selectedVehicleId,
    setSelectedVehicleId,
    selectedServices,
    selectedDate,
    selectedTime,
    setSelectedTime,
    bookingComplete,
    isRestoring,
    userTimezone,
    guestUserId,

    // Query data
    shop,
    shopLoading,
    shopError,
    services,
    servicesLoading,
    vehicles,
    vehiclesLoading,
    schedules,
    schedulesLoading,
    availableSlots,
    availabilityLoading,

    // Computed
    selectedVehicle,
    totalDuration,
    totalPrice,
    selectedServiceIds,
    isBookingPending: createAppointment.isPending,

    // Handlers
    handleServiceToggle,
    handleDateChange,
    handleGuestUserCreated,
    handleLoginSuccess,
    handleConfirmBooking,
    canProceedToStep,
    nextStep,
    prevStep,
    resetBooking,
    formatDuration,
    refetchVehicles,

    // Auth
    user,
    isAuthenticated,
  };
}
