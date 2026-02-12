"use client";

import React, { useState } from "react";
import { Spin, message } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/hooks/useAppointments";
import { useCreateEvaluation } from "@/hooks/useEvaluations";
import { HistoryItem } from "@/components/client/HistoryItem";
import { ReviewModal } from "@/components/modals/ReviewModal";
import dayjs from "dayjs";
import type { Appointment } from "@/types/appointment";

export default function HistoryPage() {
  const { user } = useAuth();
  const { data: appointmentsData, isLoading } = useAppointments(
    { userId: user?.id, perPage: 100 },
    !!user?.id
  );
  const createEvaluation = useCreateEvaluation();

  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    appointmentId: string;
    serviceName: string;
  }>({ open: false, appointmentId: "", serviceName: "" });

  const appointments: Appointment[] = appointmentsData?.data ?? [];

  const historyAppointments = appointments
    .filter((a) => ["COMPLETED", "CANCELED"].includes(a.status))
    .sort((a, b) => dayjs(b.scheduledAt).valueOf() - dayjs(a.scheduledAt).valueOf());

  const handleOpenReview = (appointmentId: string, serviceName: string) => {
    setReviewModal({ open: true, appointmentId, serviceName });
  };

  const handleSubmitReview = (data: { appointmentId: string; rating: number; comment?: string }) => {
    if (!user?.id) return;

    createEvaluation.mutate(
      {
        appointmentId: data.appointmentId,
        userId: user.id,
        rating: data.rating,
        comment: data.comment,
      },
      {
        onSuccess: () => {
          message.success("Avaliação enviada com sucesso!");
          setReviewModal({ open: false, appointmentId: "", serviceName: "" });
        },
        onError: () => {
          message.error("Erro ao enviar avaliação. Tente novamente.");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Spin size="large" />
        <span className="mt-4 text-slate-500 dark:text-slate-400">Carregando histórico...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#27272a] flex items-center justify-center border border-slate-200 dark:border-[#27272a]">
          <HistoryOutlined className="text-slate-500 dark:text-slate-400 text-2xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 m-0">Histórico</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Seus serviços anteriores</p>
        </div>
      </div>

      {/* Content */}
      {historyAppointments.length === 0 ? (
        <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-3xl p-12 shadow-sm text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 dark:bg-[#27272a] flex items-center justify-center">
            <HistoryOutlined className="text-4xl text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Nenhum histórico
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Você ainda não tem serviços concluídos ou cancelados.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {historyAppointments.map((app) => (
            <HistoryItem
              key={app.id}
              appointment={app}
              onReview={handleOpenReview}
            />
          ))}
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        open={reviewModal.open}
        appointmentId={reviewModal.appointmentId}
        serviceName={reviewModal.serviceName}
        onSubmit={handleSubmitReview}
        onCancel={() => setReviewModal({ open: false, appointmentId: "", serviceName: "" })}
        loading={createEvaluation.isPending}
      />
    </div>
  );
}
