"use client";

import React, { useState } from "react";
import { Card, message } from "antd";
import {
  BlockedTimesHeader,
  BlockedTimesList,
  BlockedTimeFormModal,
  type BlockedTime,
} from "@/components/owner/blocked-times";

// Mock data
const mockBlockedTimes: BlockedTime[] = [
  {
    id: "1",
    title: "Confraternização Universal",
    reason: "Feriado Nacional",
    startDate: "01/01/2026",
    endDate: "01/01/2026",
    isFullDay: true,
    type: "holiday",
  },
  {
    id: "2",
    title: "Carnaval",
    reason: "Feriado prolongado",
    startDate: "16/02/2026",
    endDate: "17/02/2026",
    isFullDay: true,
    type: "holiday",
  },
  {
    id: "3",
    title: "Manutenção Equipamentos",
    reason: "Troca de mangueiras e revisão geral",
    startDate: "15/01/2026",
    endDate: "15/01/2026",
    startTime: "14:00",
    endTime: "18:00",
    isFullDay: false,
    type: "maintenance",
  },
  {
    id: "4",
    title: "Consulta Médica",
    reason: "Compromisso pessoal",
    startDate: "20/01/2026",
    endDate: "20/01/2026",
    startTime: "08:00",
    endTime: "12:00",
    isFullDay: false,
    type: "personal",
  },
];

export default function OwnerBlockedTimesPage() {
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>(mockBlockedTimes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlockedTime, setEditingBlockedTime] = useState<BlockedTime | null>(null);

  const handleAddNew = () => {
    setEditingBlockedTime(null);
    setIsModalOpen(true);
  };

  const handleEdit = (blockedTime: BlockedTime) => {
    setEditingBlockedTime(blockedTime);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setBlockedTimes((prev) => prev.filter((bt) => bt.id !== id));
    message.success("Bloqueio excluído com sucesso");
  };

  const handleSubmit = (values: Omit<BlockedTime, "id">) => {
    if (editingBlockedTime) {
      setBlockedTimes((prev) =>
        prev.map((bt) =>
          bt.id === editingBlockedTime.id ? { ...bt, ...values } : bt
        )
      );
      message.success("Bloqueio atualizado com sucesso");
    } else {
      const newBlockedTime: BlockedTime = {
        ...values,
        id: `${Date.now()}`,
      };
      setBlockedTimes((prev) => [...prev, newBlockedTime]);
      message.success("Bloqueio criado com sucesso");
    }
    setIsModalOpen(false);
    setEditingBlockedTime(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <BlockedTimesHeader onAddNew={handleAddNew} />

      <Card className="border-base-200">
        <BlockedTimesList
          blockedTimes={blockedTimes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddNew={handleAddNew}
        />
      </Card>

      <BlockedTimeFormModal
        open={isModalOpen}
        blockedTime={editingBlockedTime}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingBlockedTime(null);
        }}
      />
    </div>
  );
}
