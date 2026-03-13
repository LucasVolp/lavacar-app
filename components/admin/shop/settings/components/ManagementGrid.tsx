"use client";

import React from "react";
import {
  ClockCircleOutlined,
  StopOutlined,
  TeamOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { ManagementCard } from "./ManagementCard";
import { Schedule } from "@/types/schedule";
import { BlockedTime } from "@/types/blockedTime";
import { format, isSameDay, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ManagementGridProps {
  shopId: string;
  schedules?: Schedule[];
  blockedTimes?: BlockedTime[];
  employeeCount?: number;
}

const getTodayScheduleSummary = (schedules: Schedule[]): string => {
  if (!schedules || schedules.length === 0) {
    return "Nenhum horário configurado";
  }

  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayMap: Record<number, Schedule["weekday"]> = {
    0: "SUNDAY",
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
    6: "SATURDAY",
  };

  const todaySchedule = schedules.find(s => s.weekday === dayMap[dayOfWeek]);

  if (!todaySchedule || todaySchedule.isOpen !== "ACTIVE") {
    return "Fechado hoje";
  }

  return `Aberto das ${todaySchedule.startTime} às ${todaySchedule.endTime}`;
};

const getBlockedTimesSummary = (blockedTimes: BlockedTime[]): { count: number; summary: string } => {
  if (!blockedTimes || blockedTimes.length === 0) {
    return { count: 0, summary: "Nenhum bloqueio ativo" };
  }

  const today = startOfDay(new Date());
  const parseDateOnly = (dateValue: string) => {
    const dateKey = dateValue.split("T")[0];
    return new Date(`${dateKey}T12:00:00`);
  };
  const futureBlocks = blockedTimes.filter(bt => {
    const d = parseDateOnly(bt.date);
    return isSameDay(d, today) || !isBefore(d, today);
  });

  if (futureBlocks.length === 0) {
    return { count: 0, summary: "Nenhum bloqueio ativo" };
  }

  const nextBlock = futureBlocks.sort((a, b) =>
    parseDateOnly(a.date).getTime() - parseDateOnly(b.date).getTime()
  )[0];

  const nextDate = parseDateOnly(nextBlock.date);
  const isToday = isSameDay(nextDate, today);

  return {
    count: futureBlocks.length,
    summary: isToday
      ? "Bloqueio ativo hoje"
      : `Próximo: ${format(nextDate, "dd/MM", { locale: ptBR })}`
  };
};

export const ManagementGrid: React.FC<ManagementGridProps> = ({
  shopId,
  schedules = [],
  blockedTimes = [],
  employeeCount = 0
}) => {
  const scheduleSummary = getTodayScheduleSummary(schedules);
  const { count: blockedCount, summary: blockedSummary } = getBlockedTimesSummary(blockedTimes);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Gerenciamento Rápido
        </h3>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ManagementCard
          icon={<ClockCircleOutlined />}
          title="Horários de Funcionamento"
          summary={scheduleSummary}
          description={`${schedules.filter(s => s.isOpen === "ACTIVE").length} dias configurados`}
          href={`/admin/shop/${shopId}/schedules`}
          actionLabel="Gerenciar Horários"
          color="blue"
        />

        <ManagementCard
          icon={<StopOutlined />}
          title="Bloqueios de Agenda"
          summary={blockedCount > 0 ? `${blockedCount} bloqueio(s) ativos` : "Sem bloqueios"}
          description={blockedSummary}
          href={`/admin/shop/${shopId}/blocked-times`}
          actionLabel="Gerenciar Bloqueios"
          color="red"
        />

        <ManagementCard
          icon={<TeamOutlined />}
          title="Equipe"
          summary={`${employeeCount} funcionário(s)`}
          description={employeeCount > 0 ? "Equipe ativa" : "Nenhum membro cadastrado"}
          href={`/admin/shop/${shopId}/employees`}
          actionLabel="Ver Equipe"
          color="purple"
        />

        <ManagementCard
          icon={<SettingOutlined />}
          title="Configurações Avançadas"
          summary="Agenda & Sistema"
          description="Intervalos, antecedência, buffers"
          href={`/admin/shop/${shopId}/settings/advanced`}
          actionLabel="Configurar"
          color="zinc"
        />
      </div>
    </div>
  );
};
