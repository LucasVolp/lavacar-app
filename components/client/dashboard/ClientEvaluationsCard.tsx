"use client";

import React from "react";
import { Card, Empty, Rate, Tooltip, Typography } from "antd";
import { StarFilled, MessageOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

const { Text, Paragraph } = Typography;

export interface ClientEvaluation {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  shopName?: string;
  serviceName?: string;
}

interface ClientEvaluationsCardProps {
  evaluations: ClientEvaluation[];
  averageRating: number;
  totalEvaluations: number;
}

export const ClientEvaluationsCard: React.FC<ClientEvaluationsCardProps> = ({
  evaluations,
  averageRating,
  totalEvaluations,
}) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <StarFilled className="text-amber-500 text-lg" />
          <span className="font-semibold text-base">Minhas Avaliações</span>
        </div>
      }
      extra={
        totalEvaluations > 0 ? (
          <Tooltip title={`Média baseada em ${totalEvaluations} avaliação(ões)`}>
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-lg">
              <StarFilled className="text-amber-500 text-sm" />
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                {averageRating.toFixed(1)}
              </span>
            </div>
          </Tooltip>
        ) : null
      }
      className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900"
    >
      {evaluations.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className="text-zinc-500 dark:text-zinc-400">
              Você ainda não fez nenhuma avaliação
            </span>
          }
          className="my-4"
        />
      ) : (
        <div className="space-y-3">
          {evaluations.map((evaluation) => (
            <div
              key={evaluation.id}
              className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700"
            >
              <div className="flex items-center justify-between mb-1.5">
                <Rate
                  disabled
                  value={evaluation.rating}
                  className="text-sm [&_.ant-rate-star]:!me-0.5"
                />
                <Tooltip title={dayjs(evaluation.createdAt).format("DD/MM/YYYY [às] HH:mm")}>
                  <Text className="text-[11px] text-zinc-400 dark:text-zinc-500 cursor-default">
                    {dayjs(evaluation.createdAt).fromNow()}
                  </Text>
                </Tooltip>
              </div>

              {(evaluation.shopName || evaluation.serviceName) && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  {evaluation.shopName && (
                    <Text className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      {evaluation.shopName}
                    </Text>
                  )}
                  {evaluation.shopName && evaluation.serviceName && (
                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  )}
                  {evaluation.serviceName && (
                    <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                      {evaluation.serviceName}
                    </Text>
                  )}
                </div>
              )}

              {evaluation.comment && (
                <div className="flex items-start gap-1.5 mt-1">
                  <MessageOutlined className="text-zinc-400 dark:text-zinc-500 text-xs mt-0.5" />
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    className="!mb-0 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed"
                  >
                    {evaluation.comment}
                  </Paragraph>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
