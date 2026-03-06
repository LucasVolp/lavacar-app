"use client";

import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

interface BookingNavigationProps {
  currentStep: number;
  canProceed: boolean;
  isBookingPending: boolean;
  selectedVehicleId: string | null;
  hasServices: boolean;
  onPrev: () => void;
  onNext: () => void;
  onConfirm: () => void;
}

function NavButton({
  onClick,
  disabled,
  variant,
  children,
  className = "",
}: {
  onClick: () => void;
  disabled: boolean;
  variant: "back" | "next" | "confirm";
  children: React.ReactNode;
  className?: string;
}) {
  const base = "flex items-center justify-center gap-2 font-bold transition-all duration-200 active:scale-[0.97]";

  const variants = {
    back: `text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-200 dark:hover:bg-[#27272a] ${
      disabled ? "opacity-0 pointer-events-none" : ""
    }`,
    next: disabled
      ? "bg-slate-200 dark:bg-[#27272a] text-slate-400 dark:text-slate-600 cursor-not-allowed"
      : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-black dark:hover:bg-white shadow-lg dark:shadow-white/10",
    confirm: disabled
      ? "bg-slate-200 dark:bg-[#27272a] text-slate-400 dark:text-slate-600 cursor-not-allowed"
      : "bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20",
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function BookingNavigationDesktop({
  currentStep,
  canProceed,
  isBookingPending,
  selectedVehicleId,
  hasServices,
  onPrev,
  onNext,
  onConfirm,
}: BookingNavigationProps) {
  return (
    <div className={`hidden md:flex border-t border-slate-200 dark:border-[#27272a] p-6 lg:p-8 bg-slate-50/50 dark:bg-[#09090b]/50 items-center backdrop-blur-sm ${currentStep === 0 ? "justify-center" : "justify-between"}`}>
      {currentStep > 0 && (
        <NavButton onClick={onPrev} disabled={false} variant="back" className="px-6 py-3 rounded-xl text-sm">
          <ArrowLeftOutlined /> Voltar
        </NavButton>
      )}

      {currentStep < 2 ? (
        <NavButton onClick={onNext} disabled={!canProceed} variant="next" className={`px-8 py-3 rounded-xl text-sm tracking-wide ${currentStep === 0 ? "min-w-[240px]" : ""}`}>
          Continuar <ArrowRightOutlined />
        </NavButton>
      ) : (
        <NavButton
          onClick={onConfirm}
          disabled={!canProceed || !hasServices || !selectedVehicleId || isBookingPending}
          variant="confirm"
          className="px-8 py-3 rounded-xl text-sm tracking-wide"
        >
          {isBookingPending ? "Agendando..." : "Confirmar Agendamento"}
        </NavButton>
      )}
    </div>
  );
}

export function BookingNavigationMobile({
  currentStep,
  canProceed,
  isBookingPending,
  selectedVehicleId,
  hasServices,
  onPrev,
  onNext,
  onConfirm,
}: BookingNavigationProps) {
  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-lg border-t border-slate-200 dark:border-[#27272a] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex items-center ${currentStep === 0 ? "justify-center" : "justify-between"} shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]`}>
      {currentStep > 0 && (
        <NavButton
          onClick={onPrev}
          disabled={false}
          variant="back"
          className="p-3 rounded-xl h-14 w-14 shrink-0 bg-slate-100 dark:bg-[#27272a]"
        >
          <ArrowLeftOutlined className="text-xl" />
        </NavButton>
      )}

      {currentStep < 2 ? (
        <NavButton onClick={onNext} disabled={!canProceed} variant="next" className={`px-6 py-3 rounded-xl text-base h-14 ${currentStep === 0 ? "w-full max-w-md" : "flex-1 ml-4"}`}>
          Continuar <ArrowRightOutlined />
        </NavButton>
      ) : (
        <NavButton
          onClick={onConfirm}
          disabled={!canProceed || !hasServices || !selectedVehicleId || isBookingPending}
          variant="confirm"
          className="flex-1 ml-4 px-6 py-3 rounded-xl text-base h-14"
        >
          {isBookingPending ? "Agendando..." : "Confirmar"}
        </NavButton>
      )}
    </div>
  );
}
