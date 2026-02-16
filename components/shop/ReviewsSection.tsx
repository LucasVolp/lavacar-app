"use client";

import { useMemo, useState } from "react";
import { Avatar, Image } from "antd";
import { LeftOutlined, RightOutlined, StarFilled } from "@ant-design/icons";
import { EvaluationWithRelations } from "@/types/evaluation";
import { getApiImageUrl } from "@/utils/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface ReviewsSectionProps {
  reviews: EvaluationWithRelations[];
  averageRating: number;
  totalReviews: number;
  isLoading?: boolean;
}

function getInitials(firstName?: string, lastName?: string, fallbackId?: string): string {
  const first = firstName?.trim().charAt(0).toUpperCase() || "";
  const last = lastName?.trim().charAt(0).toUpperCase() || "";
  const initials = `${first}${last}`.trim();
  if (initials) {
    return initials;
  }

  if (fallbackId) {
    return fallbackId.slice(0, 2).toUpperCase();
  }

  return "CL";
}

function ReviewCard({ review }: { review: EvaluationWithRelations }) {
  const displayName = review.user
    ? `${review.user.firstName || ""} ${review.user.lastName || ""}`.trim()
    : "Cliente";
  const initials = getInitials(review.user?.firstName, review.user?.lastName, review.id);
  const avatarSrc = getApiImageUrl(review.user?.picture);
  
  return (
    <div className="relative group p-6 rounded-2xl bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 min-h-[220px]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            src={avatarSrc || undefined}
            className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700 transition-colors duration-300"
          >
            {!avatarSrc ? initials : null}
          </Avatar>
          <div>
            <div className="text-slate-900 dark:text-slate-200 font-medium leading-none mb-1 transition-colors duration-300">
              {displayName || "Cliente Verificado"}
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-xs transition-colors duration-300">{dayjs(review.createdAt).fromNow()}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
            <StarFilled className="text-amber-400 text-sm" />
            <span className="text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors duration-300">{review.rating}</span>
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-0 transition-colors duration-300">
        &ldquo;{review.comment?.trim() || "O cliente não escreveu nada."}&rdquo;
      </p>

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Image.PreviewGroup>
            {review.photos.map((photo, idx) => (
              <Image
                key={idx}
                src={getApiImageUrl(photo)}
                alt={`Foto ${idx + 1}`}
                width={48}
                height={48}
                className="rounded-lg object-cover border border-slate-200 dark:border-[#27272a]"
                fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+"
              />
            ))}
          </Image.PreviewGroup>
        </div>
      )}
    </div>
  );
}

export function ReviewsSection({
  reviews,
  averageRating,
  totalReviews,
  isLoading,
}: ReviewsSectionProps) {
  const [page, setPage] = useState(0);

  const cardsPerPage = 3;
  const pages = useMemo(() => {
    const chunks: EvaluationWithRelations[][] = [];
    for (let i = 0; i < reviews.length; i += cardsPerPage) {
      chunks.push(reviews.slice(i, i + cardsPerPage));
    }
    return chunks;
  }, [reviews]);

  const safePage = Math.min(page, Math.max(0, pages.length - 1));

  if (isLoading) {
    return (
      <section className="py-20 bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 flex justify-center">
           <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-slate-200 dark:bg-slate-800 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              </div>
           </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50 dark:bg-[#09090b] border-t border-slate-200 dark:border-[#27272a] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter text-slate-900 dark:text-slate-50 mb-2 transition-colors duration-300">Avaliações</h2>
            <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">O que nossos clientes dizem sobre a experiência.</p>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <StarFilled className="text-amber-400" />
            <span className="text-sm font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-xs opacity-80">({totalReviews} avaliações)</span>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${safePage * 100}%)` }}
          >
            {pages.map((pageReviews, idx) => (
              <div key={idx} className="w-full shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6">
                {pageReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {pages.length > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPage((prev) => (prev > 0 ? prev - 1 : pages.length - 1))}
              className="h-10 w-10 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors"
              aria-label="Avaliações anteriores"
            >
              <LeftOutlined />
            </button>

            <div className="flex items-center gap-2">
              {pages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPage(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    safePage === idx ? "w-8 bg-slate-900 dark:bg-slate-100" : "w-2.5 bg-slate-300 dark:bg-slate-600"
                  }`}
                  aria-label={`Ir para página ${idx + 1} de avaliações`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setPage((prev) => (prev < pages.length - 1 ? prev + 1 : 0))}
              className="h-10 w-10 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors"
              aria-label="Próximas avaliações"
            >
              <RightOutlined />
            </button>
          </div>
        )}
        {pages.length > 1 && (
          <div className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
            Página {safePage + 1} de {pages.length}
          </div>
        )}
      </div>
    </section>
  );
}
