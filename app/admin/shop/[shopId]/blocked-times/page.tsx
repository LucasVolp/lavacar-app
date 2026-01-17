"use client";

import React, { useState } from "react";
import { Spin, Form, message } from "antd";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { 
  useBlockedTimesByShop, 
  useCreateBlockedTime, 
  useUpdateBlockedTime, 
  useDeleteBlockedTime 
} from "@/hooks/useBlockedTimes";
import { BlockedTime, CreateBlockedTimePayload } from "@/types/blockedTime";
import dayjs from "dayjs";
import { startOfDay, isAfter, isSameDay, isBefore, parseISO } from "date-fns";
import {
  BlockedTimeHeader,
  BlockedTimeStats,
  BlockedTimeList,
  BlockedTimeModal,
} from "@/components/admin/shop/blocked-times";

/**
 * Bloqueios de Horário do Shop - CRUD Completo
 */
export default function BlockedTimesPage() {
  const { shopId } = useShopAdmin();
  const { data: blockedTimes = [], isLoading } = useBlockedTimesByShop(shopId);
  const createBlockedTime = useCreateBlockedTime();
  const updateBlockedTime = useUpdateBlockedTime();
  const deleteBlockedTime = useDeleteBlockedTime();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlockedTime, setEditingBlockedTime] = useState<BlockedTime | null>(null);
  const [form] = Form.useForm();

  const blockType = Form.useWatch("type", form);

  // Estatísticas com date-fns
  const today = startOfDay(new Date());
  const stats = {
    total: blockedTimes.length,
    future: blockedTimes.filter(b => {
      const d = parseISO(b.date);
      return isAfter(d, today) || isSameDay(d, today);
    }).length,
    past: blockedTimes.filter(b => isBefore(parseISO(b.date), today)).length,
    fullDay: blockedTimes.filter(b => b.type === "FULL_DAY").length,
  };

  // Ordenar por data (futuros primeiro)
  const sortedBlockedTimes = [...blockedTimes].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleOpenModal = (blockedTime?: BlockedTime) => {
    if (blockedTime) {
      setEditingBlockedTime(blockedTime);
      // Ant Design Form fields expect dayjs objects for DatePicker/TimePicker
      form.setFieldsValue({
        type: blockedTime.type,
        date: dayjs(blockedTime.date),
        startTime: blockedTime.startTime ? dayjs(blockedTime.startTime, "HH:mm") : null,
        endTime: blockedTime.endTime ? dayjs(blockedTime.endTime, "HH:mm") : null,
        reason: blockedTime.reason,
      });
    } else {
      setEditingBlockedTime(null);
      form.resetFields();
      form.setFieldsValue({ type: "FULL_DAY" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlockedTime(null);
    form.resetFields();
  };

  const handleSubmit = async (values: {
    type: "FULL_DAY" | "PARTIAL";
    date: dayjs.Dayjs;
    startTime?: dayjs.Dayjs;
    endTime?: dayjs.Dayjs;
    reason?: string;
  }) => {
    try {
      const payload = {
        type: values.type,
        date: values.date.format("YYYY-MM-DD"),
        startTime: values.type === "PARTIAL" && values.startTime 
          ? values.startTime.format("HH:mm") 
          : undefined,
        endTime: values.type === "PARTIAL" && values.endTime 
          ? values.endTime.format("HH:mm") 
          : undefined,
        reason: values.reason,
      };

      if (editingBlockedTime) {
        await updateBlockedTime.mutateAsync({
          id: editingBlockedTime.id,
          payload,
        });
        message.success("Bloqueio atualizado com sucesso!");
      } else {
        const createPayload: CreateBlockedTimePayload = {
          ...payload,
          shopId,
        };
        await createBlockedTime.mutateAsync(createPayload);
        message.success("Bloqueio criado com sucesso!");
      }
      handleCloseModal();
    } catch {
      message.error("Erro ao salvar bloqueio. Tente novamente.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBlockedTime.mutateAsync(id);
      message.success("Bloqueio excluído com sucesso!");
    } catch {
      message.error("Erro ao excluir bloqueio. Tente novamente.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando bloqueios..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <BlockedTimeHeader onAdd={() => handleOpenModal()} />
      
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Visão Geral</h2>
        <BlockedTimeStats stats={stats} />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 px-1">Histórico de Bloqueios</h2>
        <BlockedTimeList 
          blockedTimes={sortedBlockedTimes}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          onAdd={() => handleOpenModal()}
        />
      </div>

      <BlockedTimeModal
        open={isModalOpen}
        onCancel={handleCloseModal}
        onSubmit={handleSubmit}
        editingBlockedTime={editingBlockedTime}
        isLoading={createBlockedTime.isPending || updateBlockedTime.isPending}
        form={form}
        blockType={blockType}
      />
    </div>
  );
}