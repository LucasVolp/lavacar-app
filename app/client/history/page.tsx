"use client";

import React, { useState } from "react";
import { Pagination, Spin, message } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/hooks/useAppointments";
import { useCreateEvaluation } from "@/hooks/useEvaluations";
import { HistoryItem } from "@/components/client/HistoryItem";
import { HistoryEmptyState, HistoryPageHeader } from "@/components/client/history";
import { ReviewModal } from "@/components/modals/ReviewModal";
import type { Appointment } from "@/types/appointment";

export default function HistoryPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data: appointmentsData, isLoading } = useAppointments(
    {
      userId: user?.id,
      status: ["COMPLETED", "CANCELED"],
      sortOrder: "desc",
      page,
      perPage,
    },
    !!user?.id
  );

  const createEvaluation = useCreateEvaluation();

  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    appointmentId: string;
    serviceName: string;
  }>({ open: false, appointmentId: "", serviceName: "" });

  const historyAppointments: Appointment[] = appointmentsData?.data ?? [];
  const meta = appointmentsData?.meta;

  const handleOpenReview = (appointmentId: string, serviceName: string) => {
    setReviewModal({ open: true, appointmentId, serviceName });
  };

  const handleSubmitReview = (data: {
    appointmentId: string;
    rating: number;
    comment?: string;
    photos?: string[];
  }) => {
    if (!user?.id) return;

    createEvaluation.mutate(
      {
        appointmentId: data.appointmentId,
        userId: user.id,
        rating: data.rating,
        comment: data.comment,
        photos: data.photos,
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
      <HistoryPageHeader />

      {historyAppointments.length === 0 ? (
        <HistoryEmptyState />
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {historyAppointments.map((appointment) => (
              <HistoryItem key={appointment.id} appointment={appointment} onReview={handleOpenReview} />
            ))}
          </div>

          <div className="flex justify-end">
            <Pagination
              current={meta?.page ?? page}
              pageSize={meta?.perPage ?? perPage}
              total={meta?.total ?? historyAppointments.length}
              onChange={(nextPage, nextPerPage) => {
                setPage(nextPage);
                setPerPage(nextPerPage);
              }}
              showSizeChanger
              pageSizeOptions={["5", "10", "50"]}
            />
          </div>
        </>
      )}

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
