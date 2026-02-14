"use client";

import React from "react";
import { Spin } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useAuth } from "@/contexts/AuthContext";
import { useUserEvaluations } from "@/hooks/useEvaluations";
import {
  EvaluationCard,
  EvaluationsEmptyState,
  EvaluationsPageHeader,
} from "@/components/client/evaluations";

dayjs.locale("pt-br");

export default function MyEvaluationsPage() {
  const { user } = useAuth();

  const { data: evaluationsData, isLoading } = useUserEvaluations(
    user?.id || null,
    { perPage: 100 },
    !!user?.id
  );

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Spin size="large" />
        <span className="mt-4 text-slate-500 dark:text-slate-400">Carregando avaliações...</span>
      </div>
    );
  }

  const evaluations = evaluationsData?.data ?? [];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-10">
      <EvaluationsPageHeader />

      {evaluations.length === 0 ? (
        <EvaluationsEmptyState />
      ) : (
        <div className="flex flex-col gap-5">
          {evaluations.map((review) => (
            <EvaluationCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
