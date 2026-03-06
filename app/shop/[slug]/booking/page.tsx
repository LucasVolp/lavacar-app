"use client";

import { use, useState } from "react";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { InfoCircleOutlined, UserOutlined, LoginOutlined } from "@ant-design/icons";

import { useBookingFlow } from "@/hooks/useBookingFlow";
import {
  AddVehicleModal,
  BookingHeader,
  BookingSteps,
  BookingReviewCard,
} from "@/components/booking";
import { Vehicle } from "@/types/vehicle";
import { IdentificationStep } from "@/components/shop/booking/IdentificationStep";
import { ServicesStep } from "@/components/shop/booking/ServicesStep";
import { DateTimeStep } from "@/components/shop/booking/DateTimeStep";
import { BookingSuccess } from "@/components/shop/booking/BookingSuccess";
import { LoginModal } from "@/components/shop/booking/LoginModal";
import { BookingNavigationDesktop, BookingNavigationMobile } from "@/components/shop/booking/BookingNavigation";

interface BookingPageProps {
  params: Promise<{ slug: string }>;
}

export default function BookingPage({ params }: BookingPageProps) {
  const { slug } = use(params);
  const router = useRouter();

  // UI-only modal states
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const booking = useBookingFlow(slug);

  // ─── Loading ───
  if (booking.shopLoading || booking.isRestoring) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#09090b]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto" />
          <span className="block mt-4 text-slate-500 dark:text-slate-400 font-medium">
            Carregando...
          </span>
        </div>
      </div>
    );
  }

  // ─── Error ───
  if (booking.shopError || !booking.shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#09090b] p-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-3xl p-12">
          <div className="text-7xl mb-6">&#x1F697;</div>
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

  // ─── Success ───
  if (booking.bookingComplete) {
    return (
      <BookingSuccess
        selectedDate={booking.selectedDate}
        selectedTime={booking.selectedTime}
        selectedServices={booking.selectedServices}
        totalDuration={booking.totalDuration}
        totalPrice={booking.totalPrice}
        formatDuration={booking.formatDuration}
        onReturnToShop={booking.resetBooking}
        onReturnToHome={() =>
          router.push(
            booking.isAuthenticated && !booking.user?.isGuest
              ? "/client/appointments"
              : "/"
          )
        }
      />
    );
  }

  const shop = booking.shop;
  const navProps = {
    currentStep: booking.currentStep,
    canProceed: booking.canProceedToStep(booking.currentStep),
    isBookingPending: booking.isBookingPending,
    selectedVehicleId: booking.selectedVehicleId,
    hasServices: booking.selectedServices.length > 0,
    onPrev: booking.prevStep,
    onNext: booking.nextStep,
    onConfirm: booking.handleConfirmBooking,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] transition-colors duration-300 pb-24 md:pb-0">
      <BookingHeader
        shop={shop}
        onBack={() => router.push(`/shop/${slug}`)}
        userName={booking.user?.firstName}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Alerts Section (Timezone and Login) */}
        <div className="flex flex-col gap-4 mb-8">
          {booking.userTimezone && shop.timeZone && booking.userTimezone !== shop.timeZone && (
            <div className="animate-fade-in">
              <div className="flex flex-row items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white dark:bg-[#18181b] dark:border-[#27272a] shadow-sm text-slate-700 dark:text-slate-300">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                   <InfoCircleOutlined className="text-xl" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium">Seu fuso horário ({booking.userTimezone}) é diferente da loja ({shop.timeZone}). Os horários exibidos seguem o fuso da loja.</span>
                </div>
              </div>
            </div>
          )}

          {/* Login Suggestion Alert */}
          {!booking.isAuthenticated && booking.currentStep === 0 && (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5">
                <div className="flex flex-row items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                    <UserOutlined className="text-lg sm:text-xl" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Já tem uma conta?</span>
                    <span className="block text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                      Faça login para gerenciar seus agendamentos.
                    </span>
                  </div>
                </div>
                <Button 
                  type="primary" 
                  icon={<LoginOutlined />}
                  onClick={() => setShowLoginModal(true)}
                  size="large"
                  className="w-full sm:w-auto !rounded-xl !bg-slate-900 !text-white hover:!bg-slate-800 dark:!bg-white dark:!text-black dark:hover:!bg-slate-200 !border-none !font-semibold !shadow-none !h-10 sm:!h-11 !text-sm"
                >
                  Fazer Login
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Steps Progress */}
        <div className="mb-6 sm:mb-8 md:mb-12 overflow-x-auto pb-2 hide-scrollbar">
          <BookingSteps currentStep={booking.currentStep} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
          {/* Content */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex-1 bg-white dark:bg-[#18181b] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-[#27272a] shadow-xl overflow-hidden min-h-[400px] sm:min-h-[500px] mb-6 md:mb-0">
              {/* Step 0: Identification */}
              {booking.currentStep === 0 && (
                <IdentificationStep
                  isAuthenticated={booking.isAuthenticated}
                  isLoading={booking.vehiclesLoading}
                  vehicles={booking.vehicles}
                  selectedVehicleId={booking.selectedVehicleId}
                  onSelectVehicle={booking.setSelectedVehicleId}
                  onAddVehicle={() => setShowAddVehicleModal(true)}
                  shopId={shop.id}
                  onGuestUserCreated={booking.handleGuestUserCreated}
                  onLogin={() => setShowLoginModal(true)}
                />
              )}

              {/* Step 1: Services */}
              {booking.currentStep === 1 && (
                <ServicesStep
                  isLoading={booking.servicesLoading}
                  services={booking.services}
                  selectedServices={booking.selectedServices}
                  totalDuration={booking.totalDuration}
                  totalPrice={booking.totalPrice}
                  onToggleService={booking.handleServiceToggle}
                  formatDuration={booking.formatDuration}
                />
              )}

              {/* Step 2: Date & Time */}
              {booking.currentStep === 2 && (
                <DateTimeStep
                  schedules={booking.schedules}
                  availableSlots={booking.availableSlots}
                  shop={shop}
                  totalDuration={booking.totalDuration}
                  selectedDate={booking.selectedDate}
                  selectedTime={booking.selectedTime}
                  onDateChange={booking.handleDateChange}
                  onTimeChange={booking.setSelectedTime}
                  isLoading={booking.schedulesLoading || booking.availabilityLoading}
                />
              )}

              {/* Desktop Navigation */}
              <BookingNavigationDesktop {...navProps} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 hidden lg:block">
            <BookingReviewCard
              selectedServices={booking.selectedServices}
              selectedVehicle={booking.selectedVehicle as Vehicle | null}
              selectedDate={booking.selectedDate}
              selectedTime={booking.selectedTime}
              totalPrice={booking.totalPrice}
              totalDuration={booking.totalDuration}
              isLoading={booking.isBookingPending}
              disabled={booking.currentStep < 2}
              onConfirm={booking.handleConfirmBooking}
            />
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <BookingNavigationMobile {...navProps} />

      {/* Modals */}
      <AddVehicleModal
        open={showAddVehicleModal}
        onClose={() => setShowAddVehicleModal(false)}
        onSuccess={() => booking.refetchVehicles()}
      />

      <LoginModal
        open={showLoginModal}
        onCancel={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          booking.handleLoginSuccess();
        }}
      />
    </div>
  );
}
