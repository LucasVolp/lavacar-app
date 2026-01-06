"use client";

import React from "react";
import { Typography, Card, List, Avatar, Tag, Button, Empty } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

export interface Appointment {
  id: string;
  customer: string;
  vehicle: string;
  service: string;
  time: string;
  status: string;
}

interface UpcomingAppointmentsListProps {
  appointments: Appointment[];
  onConfirm?: (id: string) => void;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  PENDING: { color: "gold", label: "Pendente" },
  CONFIRMED: { color: "blue", label: "Confirmado" },
  WAITING: { color: "purple", label: "Aguardando" },
  IN_PROGRESS: { color: "processing", label: "Em andamento" },
  COMPLETED: { color: "green", label: "Concluído" },
  CANCELED: { color: "red", label: "Cancelado" },
};

export const UpcomingAppointmentsList: React.FC<UpcomingAppointmentsListProps> = ({
  appointments,
  onConfirm,
}) => {
  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-primary" />
            <span>Próximos Agendamentos</span>
          </div>
          <Link href="/owner/appointments">
            <Button type="link" size="small">
              Ver todos
            </Button>
          </Link>
        </div>
      }
      className="border-base-200 h-full"
    >
      {appointments.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={appointments}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key="confirm"
                  type="link"
                  size="small"
                  onClick={() => onConfirm?.(item.id)}
                >
                  Confirmar
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={<UserOutlined />}
                    className="bg-gradient-to-br from-primary to-secondary"
                  />
                }
                title={
                  <div className="flex items-center gap-2">
                    <Text strong>{item.customer}</Text>
                    <Tag color={statusConfig[item.status]?.color || "default"}>
                      {statusConfig[item.status]?.label || item.status}
                    </Tag>
                  </div>
                }
                description={
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <Text type="secondary" className="text-xs">
                      <ClockCircleOutlined className="mr-1" />
                      {item.time}
                    </Text>
                    <Text type="secondary" className="text-xs">
                      <CarOutlined className="mr-1" />
                      {item.vehicle}
                    </Text>
                    <Text type="secondary" className="text-xs">
                      {item.service}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty description="Nenhum agendamento para hoje" />
      )}
    </Card>
  );
};

export default UpcomingAppointmentsList;
