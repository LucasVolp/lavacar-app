"use client";

import React, { useState } from "react";
import { Typography, Select, message, Pagination } from "antd";
import { StarOutlined } from "@ant-design/icons";
import { useShopEvaluations, useEvaluationSummary, useDeleteEvaluation } from "@/hooks/useEvaluations";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { EvaluationStats } from "@/components/admin/shop/evaluations/EvaluationStats";
import { EvaluationList } from "@/components/admin/shop/evaluations/EvaluationList";

const { Title, Text } = Typography;

export default function ShopEvaluationsPage() {
  const { shopId } = useShopAdmin();
  const [filterRating, setFilterRating] = useState<string | null>("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filters = {
    rating: filterRating && filterRating !== "all" ? Number(filterRating) : undefined,
    page,
    perPage,
  };

  const { data: evaluationsData, isLoading } = useShopEvaluations(shopId, filters);
  const { data: stats } = useEvaluationSummary(shopId);
  const deleteEvaluation = useDeleteEvaluation();

  const evaluations = evaluationsData?.data ?? [];
  const meta = evaluationsData?.meta;

  const handleDelete = async (id: string) => {
    try {
      await deleteEvaluation.mutateAsync(id);
      message.success("Avaliação removida com sucesso");
    } catch {
      message.error("Erro ao remover avaliação");
    }
  };

  const handleRatingChange = (value: string) => {
    setFilterRating(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPageSize && newPageSize !== perPage) {
      setPerPage(newPageSize);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
           <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-500 shadow-sm">
                    <StarOutlined className="text-2xl" />
                </div>
                <div>
                    <Title level={2} className="!m-0 !text-zinc-900 dark:!text-zinc-50 tracking-tight">Avaliações</Title>
                    <Text className="text-zinc-500 dark:text-zinc-400 text-base">
                        Acompanhe e gerencie a reputação do seu estabelecimento
                    </Text>
                </div>
           </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           <div className="lg:col-span-4 xl:col-span-3 space-y-4">
               <div className="space-y-4 sticky top-24">
                   {stats && <EvaluationStats stats={stats} isLoading={isLoading} />}
               </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-24 space-y-4">
                       <Title level={5} className="!m-0 !text-zinc-800 dark:!text-zinc-200">Filtros</Title>
                       
                       <div className="space-y-3">
                           <div>
                               <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">Classificação</div>
                               <Select 
                                    value={filterRating || "all"}
                                    className="w-full"
                                    size="large"
                                    onChange={handleRatingChange}
                                    options={[
                                        { value: 'all', label: 'Todas as avaliações' },
                                        { value: '5', label: '★★★★★ (5)' },
                                        { value: '4', label: '★★★★☆ (4)' },
                                        { value: '3', label: '★★★☆☆ (3)' },
                                        { value: '2', label: '★★☆☆☆ (2)' },
                                        { value: '1', label: '★☆☆☆☆ (1)' },
                                    ]}
                                />
                           </div>
                       </div>
                </div>
           </div>

           <div className="lg:col-span-8 xl:col-span-9 space-y-4">
               <div className="flex items-center justify-between px-1">
                   <Text className="text-zinc-500 font-medium">
                       Mostrando {evaluations.length} de {meta?.total ?? 0} avaliações
                   </Text>
               </div>
               
               <EvaluationList 
                  evaluations={evaluations} 
                  loading={isLoading} 
                  onDelete={handleDelete}
               />

               {meta && meta.totalPages > 1 && (
                 <div className="flex justify-center pt-4">
                   <Pagination
                     current={page}
                     pageSize={perPage}
                     total={meta.total}
                     onChange={handlePageChange}
                     showSizeChanger
                     showTotal={(total, range) => `${range[0]}-${range[1]} de ${total} avaliações`}
                     pageSizeOptions={["10", "20", "50"]}
                   />
                 </div>
               )}
           </div>
       </div>
    </div>
  );
}
