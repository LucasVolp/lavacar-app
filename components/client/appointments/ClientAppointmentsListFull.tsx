"use client";

import React from "react";
import { Typography, Card, List, Tag, Button, Empty, Space } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CarOutlined,
  ShopOutlined,
  PlusOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

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
}

const statusConfig: Record<string, { color: string; label: string }> = {
  PENDING: { color: "gold", label: "Pendente" },
  CONFIRMED: { color: "blue", label: "Confirmado" },
  IN_PROGRESS: { color: "processing", label: "Em Andamento" },
  COMPLETED: { color: "green", label: "Concluído" },
  CANCELED: { color: "red", label: "Cancelado" },
};

export const ClientAppointmentsListFull: React.FC<ClientAppointmentsListFullProps> = ({
  appointments,
  onCancel,
  onConfirm,
  onClick,
  isHistory = false,
  isConfirming = false,
}) => {
  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isHistory ? (
              <HistoryOutlined className="text-slate-500" />
            ) : (
              <CalendarOutlined className="text-indigo-500" />
            )}
            <span>{isHistory ? "Histórico" : "Próximos Agendamentos"}</span>
          </div>
        </div>
      }
      className="border-slate-200 dark:border-slate-800"
    >
      {appointments.length > 0 ? (
        <List
          itemLayout="vertical"
          dataSource={appointments}
          renderItem={(item) => {
            const actions: React.ReactNode[] = [];

            // View details button - always visible
            actions.push(
              <Button
                key="view"
                type="text"
                icon={<EyeOutlined />}
                onClick={() => onClick?.(item.id)}
              >
                Ver Detalhes
              </Button>
            );

            // Actions for non-completed/canceled appointments
            if (item.status === "PENDING") {
              actions.push(
                <Button
                  key="confirm"
                  type="text"
                  icon={<CheckCircleOutlined />}
                  onClick={() => onConfirm?.(item.id)}
                  loading={isConfirming}
                  className="text-green-600 hover:text-green-700"
                >
                  Confirmar
                </Button>
              );
            }

            if (item.status !== "COMPLETED" && item.status !== "CANCELED") {
              actions.push(
                <Button
                  key="cancel"
                  type="text"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => onCancel?.(item.id)}
                >
                  Cancelar
                </Button>
              );
            }

            if (item.status === "COMPLETED") {
              actions.push(
                <Tag key="evaluated" color={item.isEvaluated ? "blue" : "default"}>
                  {item.isEvaluated ? "Avaliado" : "Não Avaliado"}
                </Tag>
              );
            }

            return (
              <List.Item
                actions={actions}
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-4 px-4 rounded-lg transition-colors"
                onClick={() => onClick?.(item.id)}
              >
                <List.Item.Meta
                  avatar={
                    <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                      <CalendarOutlined className="text-indigo-500 text-2xl" />
                    </div>
                  }
                  title={
                    <div className="flex items-center gap-2 flex-wrap">
                      <Text strong className="text-lg">
                        {item.services.map((s) => s.name).join(", ") || "Serviço"}
                      </Text>
                      <Tag color={statusConfig[item.status]?.color || "default"}>
                        {statusConfig[item.status]?.label || item.status}
                      </Tag>
                      <Text strong className="text-green-600">
                        R$ {item.price.toFixed(2)}
                      </Text>
                    </div>
                  }
                  description={
                    <Space direction="vertical" className="w-full">
                      <div className="flex items-center gap-2">
                        <ShopOutlined className="text-slate-400" />
                        <Text type="secondary">{item.shop}</Text>
                        {item.shopAddress && (
                          <Text type="secondary" className="text-xs">
                            • {item.shopAddress}
                          </Text>
                        )}
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <Text type="secondary">
                          <ClockCircleOutlined className="mr-1" />
                          {item.date} às {item.time} ({item.duration}min)
                        </Text>
                        <Text type="secondary">
                          <CarOutlined className="mr-1" />
                          {item.vehicle} - {item.vehiclePlate}
                        </Text>
                      </div>
                    </Space>
                  }
                />
              </List.Item>
            );
          }}
        />
      ) : (
        <Empty
          description={
            isHistory
              ? "Nenhum agendamento no histórico"
              : "Nenhum agendamento pendente"
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          {!isHistory && (
            <Link href="/">
              <Button type="primary" icon={<PlusOutlined />}>
                Agendar Agora
              </Button>
            </Link>
          )}
        </Empty>
      )}
    </Card>
  );
};

export default ClientAppointmentsListFull;
