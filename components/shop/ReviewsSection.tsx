"use client";

import { Avatar, Image } from "antd";
import { StarFilled, PictureOutlined } from "@ant-design/icons";
import { Evaluation } from "@/types/evaluation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface ReviewsSectionProps {
  reviews: Evaluation[];
  averageRating: number;
  totalReviews: number;
  isLoading?: boolean;
}

function getInitialFromId(id: string): string {
  const initials = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M"];
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return initials[hash % initials.length];
}

function ReviewCard({ review }: { review: Evaluation }) {
  const initial = getInitialFromId(review.id);
  
  return (
    <div className="relative group p-6 rounded-2xl bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700 transition-colors duration-300"
          >
            {initial}
          </Avatar>
          <div>
            <div className="text-slate-900 dark:text-slate-200 font-medium leading-none mb-1 transition-colors duration-300">Cliente Verificado</div>
            <div className="text-slate-500 dark:text-slate-400 text-xs transition-colors duration-300">{dayjs(review.createdAt).fromNow()}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
            <StarFilled className="text-amber-400 text-sm" />
            <span className="text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors duration-300">{review.rating}</span>
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-0 transition-colors duration-300">
        &ldquo;{review.comment}&rdquo;
      </p>

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Image.PreviewGroup>
            {review.photos.map((photo, idx) => (
              <Image
                key={idx}
                src={photo}
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
  isLoading,
}: ReviewsSectionProps) {
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
          <div className="flex items-center gap-2">
             {/* Decorative lines or "View All" link could go here */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review) => (
             <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
