import React from "react";
import { ClockCircleOutlined, PictureOutlined, ShopOutlined } from "@ant-design/icons";
import { Image, Rate, Tag } from "antd";
import dayjs from "dayjs";
import type { EvaluationWithRelations } from "@/types/evaluation";

interface EvaluationCardProps {
  review: EvaluationWithRelations;
}

export function EvaluationCard({ review }: EvaluationCardProps) {
  return (
    <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
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

        <div className="flex flex-col items-end gap-1">
          <Rate
            disabled
            value={review.rating}
            className="text-amber-400 text-base [&_.ant-rate-star]:mr-0.5"
          />
        </div>
      </div>

      {review.comment && (
        <div className="p-4 bg-slate-50 dark:bg-[#27272a]/50 rounded-2xl border border-slate-100 dark:border-[#27272a] mb-4">
          <p className="text-slate-700 dark:text-slate-300 m-0 leading-relaxed italic">
            &quot;{review.comment}&quot;
          </p>
        </div>
      )}

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

      {review.appointment?.services && review.appointment.services.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-[#27272a]">
          {review.appointment.services.map((service, index) => (
            <Tag
              key={`${service.serviceName}-${index}`}
              className="m-0 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-lg px-3 py-1"
            >
              {service.serviceName}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
}
