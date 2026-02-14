"use client";

import React from "react";
import { Spin, Tag, Rate, Image } from "antd";
import { StarOutlined, ShopOutlined, ClockCircleOutlined, PictureOutlined } from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useUserEvaluations } from "@/hooks/useEvaluations";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

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
        <span className="mt-4 text-slate-500 dark:text-slate-400">
          Carregando avaliações...
        </span>
      </div>
    );
  }

  const evaluations = evaluationsData?.data ?? [];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
          <StarOutlined className="text-amber-500 text-2xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 m-0">
            Minhas Avaliações
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Histórico de feedback enviado para lava-jatos
          </p>
        </div>
      </div>

      {/* Content */}
      {evaluations.length === 0 ? (
        <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-3xl p-12 shadow-sm text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 dark:bg-[#27272a] flex items-center justify-center">
            <StarOutlined className="text-4xl text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Nenhuma avaliação
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Você ainda não avaliou nenhum serviço. Após concluir um agendamento, você
            poderá deixar seu feedback.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {evaluations.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Header: Shop logo + Name + Date */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-[#27272a] rounded-xl flex items-center justify-center shrink-0 border border-slate-200 dark:border-[#27272a]">
                    <ShopOutlined className="text-slate-500 dark:text-slate-400 text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 m-0">
                      {review.appointment?.shop?.name ?? "Loja desconhecida"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      <ClockCircleOutlined className="text-xs" />
                      <span>{dayjs(review.createdAt).format("DD [de] MMMM, YYYY")}</span>
                    </div>
                  </div>
                </div>

                {/* Rating badge */}
                <div className="flex flex-col items-end gap-1">
                  <Rate
                    disabled
                    value={review.rating}
                    className="text-amber-400 text-base [&_.ant-rate-star]:mr-0.5"
                  />
                </div>
              </div>

              {/* Comment */}
              {review.comment && (
                <div className="p-4 bg-slate-50 dark:bg-[#27272a]/50 rounded-2xl border border-slate-100 dark:border-[#27272a] mb-4">
                  <p className="text-slate-700 dark:text-slate-300 m-0 leading-relaxed italic">
                    &quot;{review.comment}&quot;
                  </p>
                </div>
              )}

              {/* Photos */}
              {review.photos && review.photos.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-2">
                    <PictureOutlined className="text-xs" />
                    <span>Fotos ({review.photos.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Image.PreviewGroup>
                      {review.photos.map((photo, idx) => (
                        <Image
                          key={idx}
                          src={photo}
                          alt={`Foto ${idx + 1}`}
                          width={72}
                          height={72}
                          className="rounded-xl object-cover border border-slate-200 dark:border-[#27272a]"
                          fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNjY2MiIGZvbnQtc2l6ZT0iMTAiPkVycm88L3RleHQ+PC9zdmc+"
                        />
                      ))}
                    </Image.PreviewGroup>
                  </div>
                </div>
              )}

              {/* Services tags */}
              {review.appointment?.services && review.appointment.services.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-[#27272a]">
                  {review.appointment.services.map((s, index) => (
                    <Tag
                      key={`${s.serviceName}-${index}`}
                      className="m-0 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-lg px-3 py-1"
                    >
                      {s.serviceName}
                    </Tag>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
