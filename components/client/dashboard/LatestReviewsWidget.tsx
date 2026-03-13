"use client";

import React from "react";
import { Button, Rate } from "antd";
import { StarOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useRouter } from "next/navigation";

dayjs.locale("pt-br");

interface Evaluation {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string | Date;
  shopName?: string;
  serviceName?: string;
}

interface LatestReviewsWidgetProps {
  evaluations: Evaluation[];
}

export const LatestReviewsWidget: React.FC<LatestReviewsWidgetProps> = ({
  evaluations,
}) => {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm transition-colors overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <StarOutlined className="text-indigo-600 dark:text-indigo-400 text-sm" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 m-0">
            Minhas Avaliações
          </h3>
        </div>
        {evaluations.length > 0 && (
          <Button
            type="text"
            size="small"
            className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-medium text-xs h-7 px-2"
            onClick={() => router.push("/client/evaluations")}
          >
            Ver todas <RightOutlined className="text-[10px]" />
          </Button>
        )}
      </div>

      <div className="flex-1 p-3">
        {evaluations.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-4">
            <div className="w-10 h-10 mb-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <StarOutlined className="text-zinc-400 text-sm" />
            </div>
            <span className="text-zinc-500 dark:text-zinc-400 text-xs">
              Nenhuma avaliação
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {evaluations.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                onClick={() => router.push("/client/evaluations")}
              >
                <div className="flex items-center justify-between mb-1">
                  <Rate
                    disabled
                    value={review.rating}
                    className="text-amber-400 text-xs [&_.ant-rate-star]:mr-0"
                  />
                  <span className="text-[10px] text-zinc-400">
                    {dayjs(review.createdAt).format("DD/MM")}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1 m-0">
                    {review.comment}
                  </p>
                )}
                {review.shopName && (
                  <span className="text-[10px] text-zinc-400 mt-1 block truncate">
                    {review.shopName}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
