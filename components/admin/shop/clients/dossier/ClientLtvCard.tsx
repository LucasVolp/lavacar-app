"use client";

import React from "react";
import { Button, Card, Tooltip, Typography } from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  WhatsAppOutlined,
  RiseOutlined,
  WarningOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface ClientLtvCardProps {
  ltv: number;
  avgReturnDays: number;
  avgTicket: number;
  isOverdue: boolean;
  daysSinceLastVisit: number;
  whatsappUrl: string;
  completedCount: number;
}

export const ClientLtvCard: React.FC<ClientLtvCardProps> = ({
  ltv,
  avgReturnDays,
  avgTicket,
  isOverdue,
  daysSinceLastVisit,
  whatsappUrl,
  completedCount,
}) => {
  return (
    <Card className="!rounded-2xl !shadow-sm hover:!shadow-md transition-shadow !overflow-hidden !p-0">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white rounded-2xl m-3 mb-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <RiseOutlined className="text-base" />
          </div>
          <Text className="!text-white/90 text-xs font-semibold uppercase tracking-wider">
            Lifetime Value
          </Text>
        </div>
        <div className="text-4xl font-black tracking-tight leading-tight">
          R$ {ltv.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-white/70 text-sm mt-1.5 font-medium">
          {completedCount} serviço{completedCount !== 1 ? "s" : ""} concluído{completedCount !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Tooltip title="Ticket médio baseado nos atendimentos concluídos">
            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-3 text-center">
              <DollarOutlined className="text-emerald-500 text-lg mb-1" />
              <div className="font-bold text-sm dark:text-zinc-100">
                R$ {avgTicket.toFixed(2)}
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                Ticket Médio
              </div>
            </div>
          </Tooltip>

          <Tooltip title="Frequência média de retorno do cliente">
            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-3 text-center">
              <CalendarOutlined className="text-blue-500 text-lg mb-1" />
              <div className="font-bold text-sm dark:text-zinc-100">
                {avgReturnDays} dias
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                Retorno Médio
              </div>
            </div>
          </Tooltip>
        </div>

        {isOverdue && (
          <div className="flex items-center gap-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
              <WarningOutlined className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <Text className="!text-amber-800 dark:!text-amber-300 text-xs font-semibold block">
                Cliente atrasado
              </Text>
              <Text className="!text-amber-600 dark:!text-amber-400 text-[11px]">
                {daysSinceLastVisit} dias sem retorno ({daysSinceLastVisit - avgReturnDays}d além da média)
              </Text>
            </div>
          </div>
        )}

        {!isOverdue && daysSinceLastVisit > 0 && (
          <div className="flex items-center gap-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-3">
            <ClockCircleOutlined className="text-zinc-400" />
            <Text className="text-xs text-zinc-500 dark:text-zinc-400">
              Última visita há {daysSinceLastVisit} dia{daysSinceLastVisit !== 1 ? "s" : ""}
            </Text>
          </div>
        )}

        <Button
          type="primary"
          icon={<WhatsAppOutlined />}
          block
          size="large"
          className="!rounded-xl !h-12 !font-semibold !shadow-sm hover:!shadow-md !transition-all"
          disabled={!whatsappUrl}
          onClick={() => window.open(whatsappUrl, "_blank")}
        >
          Enviar ZAP de Resgate
        </Button>
      </div>
    </Card>
  );
};
