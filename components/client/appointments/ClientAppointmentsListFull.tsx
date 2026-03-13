import React from "react";
import { Card, Button, Empty, Tooltip, Badge } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CarOutlined,
  ShopOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  HistoryOutlined,
  DollarOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatVehiclePlate } from "@/utils/vehiclePlate";

export interface ClientAppointmentFull {
  id: string;
  shop: string;
  shopAddress?: string;
  services: { name: string }[];
  vehicle: string;
  vehiclePlate: string;
  date: string;
  time: string;
  scheduledAt?: string;
  duration: number;
  price: number;
  status: string;
  createdAt: string;
  isEvaluated?: boolean;
}

interface ClientAppointmentsListFullProps {
  appointments: ClientAppointmentFull[];
  onCancel?: (id: string) => void;
  onConfirm?: (id: string) => void;
  onClick?: (id: string) => void;
  isHistory?: boolean;
  isConfirming?: boolean;
  lastShopInfo?: { name: string; slug: string } | null;
}

export const ClientAppointmentsListFull: React.FC<ClientAppointmentsListFullProps> = ({
  appointments,
  onCancel,
  onConfirm,
  onClick,
  isHistory = false,
  isConfirming = false,
  lastShopInfo,
}) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          {isHistory ? (
            <HistoryOutlined className="text-zinc-500 dark:text-zinc-400" />
          ) : (
            <CalendarOutlined className="text-cyan-500" />
          )}
          <span className="font-semibold text-base">
            {isHistory ? "Histórico" : "Próximos Agendamentos"}
          </span>
        </div>
      }
      className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900"
    >
      {appointments.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {appointments.map((item) => {
            const servicesText = item.services?.map((s) => s.name).join(", ") || "Serviço";

            return (
              <div
                key={item.id}
                className="group p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 hover:border-cyan-200 dark:hover:border-cyan-800 transition-colors cursor-pointer"
                onClick={() => onClick?.(item.id)}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-100 truncate">
                      {servicesText}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm shrink-0">
                    <DollarOutlined className="mr-0.5" />
                    R$ {item.price.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <ShopOutlined className="text-cyan-500 shrink-0" />
                    <span className="truncate">{item.shop}</span>
                    {item.shopAddress && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" />
                        <span className="truncate text-zinc-400 dark:text-zinc-500">{item.shopAddress}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <ClockCircleOutlined className="text-cyan-500 shrink-0" />
                    <span>{item.date} às {item.time}</span>
                    {item.duration > 0 && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" />
                        <span>{item.duration}min</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <CarOutlined className="text-cyan-500 shrink-0" />
                    <span className="truncate">{item.vehicle || "Veículo removido"}</span>
                    {item.vehiclePlate && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" />
                        <span className="font-mono uppercase text-[10px]">{formatVehiclePlate(item.vehiclePlate)}</span>
                      </>
                    )}
                  </div>
                </div>

                <div
                  className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Tooltip title="Ver detalhes">
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => onClick?.(item.id)}
                      className="!text-xs text-zinc-500 hover:!text-cyan-600"
                    >
                      Detalhes
                    </Button>
                  </Tooltip>

                  {item.status === "PENDING" && (
                    <Tooltip title="Confirmar presença">
                      <Button
                        type="primary"
                        size="small"
                        icon={<CheckCircleOutlined />}
                        onClick={() => onConfirm?.(item.id)}
                        loading={isConfirming}
                        className="!bg-emerald-600 hover:!bg-emerald-500 !border-emerald-600 !shadow-none !text-xs"
                      >
                        Confirmar
                      </Button>
                    </Tooltip>
                  )}

                  {item.status !== "COMPLETED" && item.status !== "CANCELED" && (
                    <Tooltip title="Cancelar agendamento">
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<CloseCircleOutlined />}
                        onClick={() => onCancel?.(item.id)}
                        className="!shadow-none !text-xs"
                      >
                        Cancelar
                      </Button>
                    </Tooltip>
                  )}

                  {item.status === "COMPLETED" && (
                    <Badge
                      status={item.isEvaluated ? "success" : "default"}
                      text={
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {item.isEvaluated ? "Avaliado" : "Não Avaliado"}
                        </span>
                      }
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Empty
          description={
            <span className="text-zinc-500 dark:text-zinc-400">
              {isHistory
                ? "Nenhum agendamento no histórico"
                : "Nenhum agendamento pendente"}
            </span>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="my-8"
        >
          {!isHistory && lastShopInfo && (
            <Link href={`/shop/${lastShopInfo.slug}/booking`}>
              <Button type="primary" icon={<RedoOutlined />}>
                Reagendar Novamente
              </Button>
            </Link>
          )}
        </Empty>
      )}
    </Card>
  );
};

export default ClientAppointmentsListFull;
