"use client";

import { useMemo } from "react";
import {
  ClockCircleFilled,
  CarFilled,
  SyncOutlined,
  CheckCircleFilled,
  CarOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { StatusBadge } from "@/components/ui";

const TRACK_STEPS = [
  {
    key: "PENDING",
    label: "Agendado",
    description: "Seu horário foi reservado e está confirmado na agenda.",
    icon: <ClockCircleFilled />,
  },
  {
    key: "CONFIRMED",
    label: "Veículo Entregue",
    description: "O veículo já foi entregue e o atendimento foi iniciado.",
    icon: <CarFilled />,
  },
  {
    key: "WAITING",
    label: "Em Lavagem",
    description: "A equipe está cuidando do seu veículo agora.",
    icon: <SyncOutlined spin />,
  },
  {
    key: "IN_PROGRESS",
    label: "Finalizado",
    description: "O serviço principal foi concluído e está em fase final.",
    icon: <CheckCircleFilled />,
  },
  {
    key: "COMPLETED",
    label: "Pronto para Retirada",
    description: "Seu veículo está pronto para ser retirado.",
    icon: <CarOutlined />,
  },
];

const STATUS_TO_STEP: Record<string, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  WAITING: 2,
  IN_PROGRESS: 3,
  COMPLETED: 4,
  CANCELED: -1,
  NO_SHOW: -1,
};

interface TrackingProgressTrackerProps {
  status: string;
}

export function TrackingProgressTracker({ status }: TrackingProgressTrackerProps) {
  const currentStep = STATUS_TO_STEP[status] ?? 0;
  const isCanceled = currentStep === -1;

  const stepStates = useMemo(() => {
    return TRACK_STEPS.map((step, index) => {
      const state = isCanceled
        ? "muted"
        : index < currentStep
        ? "done"
        : index === currentStep
        ? "current"
        : "future";

      return {
        ...step,
        state,
      };
    });
  }, [currentStep, isCanceled]);

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#27272a] dark:bg-[#18181b] sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            Rastreamento do Serviço
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            Acompanhe em tempo real
          </h2>
        </div>
        <StatusBadge status={status} className="shrink-0 rounded-full px-3 py-1.5 text-sm" />
      </div>

      {isCanceled ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-900/10">
          <div className="flex items-start gap-3">
            <CloseCircleFilled className="mt-0.5 text-2xl text-red-500" />
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Agendamento Cancelado
              </p>
              <p className="mt-1 text-sm leading-relaxed text-red-700 dark:text-red-300">
                Este agendamento não está mais ativo. Entre em contato com a loja, caso precise de suporte.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative pl-1">
          <div className="absolute bottom-6 left-[18px] top-6 w-px bg-gradient-to-b from-indigo-500 via-slate-300 to-slate-200 dark:via-slate-700 dark:to-slate-800" />

          <div className="space-y-4">
            {stepStates.map((step) => {
              const isCurrent = step.state === "current";
              const isDone = step.state === "done";
              const isFuture = step.state === "future";

              return (
                <div key={step.key} className="relative flex gap-4">
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                      isCurrent
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-110"
                        : isDone
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : isFuture
                        ? "border-slate-300 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-600"
                        : "border-red-300 bg-red-100 text-red-500"
                    }`}
                  >
                    <span className={`text-lg ${isCurrent ? "animate-pulse" : ""}`}>
                      {step.icon}
                    </span>
                  </div>

                  <div
                    className={`flex-1 rounded-2xl border px-4 py-4 transition-all duration-300 ${
                      isCurrent
                        ? "border-indigo-200 bg-indigo-50/70 shadow-sm dark:border-indigo-900/40 dark:bg-indigo-900/10"
                        : isDone
                        ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/30 dark:bg-emerald-900/10"
                        : "border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p
                          className={`text-base font-extrabold tracking-tight sm:text-lg ${
                            isCurrent
                              ? "text-indigo-700 dark:text-indigo-300"
                              : isDone
                              ? "text-emerald-700 dark:text-emerald-300"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {step.description}
                        </p>
                      </div>

                      {isCurrent && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-950">
                          <SyncOutlined spin className="text-lg text-indigo-600" />
                        </div>
                      )}
                      {isDone && !isCurrent && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-950">
                          <CheckCircleFilled className="text-lg text-emerald-600" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
