"use client";

import React from "react";
import { Typography, Card, List, Tag, Button, Empty, Space, Popconfirm } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CarOutlined,
  ShopOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

export interface ClientAppointmentFull {
  id: string;
  shop: string;
  shopAddress?: string;
  service: string;
  vehicle: string;
  vehiclePlate: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: string;
  createdAt: string;
  isEvaluated?: boolean;
}

interface ClientAppointmentsListFullProps {
  appointments: ClientAppointmentFull[];
  onCancel?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  PENDING: { color: "gold", label: "Pendente" },
  CONFIRMED: { color: "blue", label: "Confirmado" },
  COMPLETED: { color: "green", label: "Concluído" },
  CANCELED: { color: "red", label: "Cancelado" },
};

export const ClientAppointmentsListFull: React.FC<ClientAppointmentsListFullProps> = ({
  appointments,
  onCancel,
  onEdit,
}) => {
  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-success" />
            <span>Meus Agendamentos</span>
          </div>
        </div>
      }
      className="border-base-200"
    >
      {appointments.length > 0 ? (
        <List
          itemLayout="vertical"
          dataSource={appointments}
          renderItem={(item) => {
            const actions: React.ReactNode[] = [];
            
            if (item.status !== "COMPLETED" && item.status !== "CANCELED") {
                actions.push(
                    <Button
                    key="edit"
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onEdit?.(item.id)}
                    disabled={item.status === "CONFIRMED"}
                    >
                    Editar
                    </Button>
                );
                
                actions.push(
                    <Popconfirm
                    key="cancel"
                    title="Cancelar agendamento"
                    description="Tem certeza que deseja cancelar este agendamento?"
                    onConfirm={() => onCancel?.(item.id)}
                    okText="Sim, cancelar"
                    cancelText="Não"
                    >
                    <Button type="text" danger icon={<DeleteOutlined />}>
                        Cancelar
                    </Button>
                    </Popconfirm>
                );
            }
            
            if (item.status === "COMPLETED") {
                actions.push(
                    <Tag color={item.isEvaluated ? "blue" : "default"}>
                        {item.isEvaluated ? "Avaliado" : "Não Avaliado"}
                    </Tag>
                );
            }

            return (
            <List.Item actions={actions}>
              <List.Item.Meta
                avatar={
                  <div className="w-14 h-14 bg-success/10 rounded-lg flex items-center justify-center">
                    <CalendarOutlined className="text-success text-2xl" />
                  </div>
                }
                title={
                  <div className="flex items-center gap-2 flex-wrap">
                    <Text strong className="text-lg">{item.service}</Text>
                    <Tag color={statusConfig[item.status]?.color || "default"}>
                      {statusConfig[item.status]?.label || item.status}
                    </Tag>
                    <Text strong className="text-success">
                      R$ {item.price.toFixed(2)}
                    </Text>
                  </div>
                }
                description={
                  <Space direction="vertical" className="w-full">
                    <div className="flex items-center gap-2">
                      <ShopOutlined className="text-base-content/40" />
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
          )}}
        />
      ) : (
        <Empty
          description="Nenhum agendamento pendente"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Link href="/client/appointments/new">
            <Button type="primary" icon={<PlusOutlined />}>
              Agendar Agora
            </Button>
          </Link>
        </Empty>
      )}
    </Card>
  );
};

export default ClientAppointmentsListFull;
