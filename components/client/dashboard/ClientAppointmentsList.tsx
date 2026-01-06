"use client";

import React from "react";
import { Typography, Card, List, Tag, Button, Empty } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CarOutlined,
  ShopOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

export interface ClientAppointment {
  id: string;
  shop: string;
  service: string;
  vehicle: string;
  date: string;
  time: string;
  status: string;
}

interface ClientAppointmentsListProps {
  appointments: ClientAppointment[];
}

const statusConfig: Record<string, { color: string; label: string }> = {
  PENDING: { color: "gold", label: "Pendente" },
  CONFIRMED: { color: "blue", label: "Confirmado" },
  COMPLETED: { color: "green", label: "Concluído" },
  CANCELED: { color: "red", label: "Cancelado" },
};

export const ClientAppointmentsList: React.FC<ClientAppointmentsListProps> = ({
  appointments,
}) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-success" />
          <span>Próximos Agendamentos</span>
        </div>
      }
      extra={
        <Link href="/client/appointments">
          <Button type="link" size="small">
            Ver todos
          </Button>
        </Link>
      }
      className="border-base-200 mb-4 lg:mb-0"
    >
      {appointments.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={appointments}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <CalendarOutlined className="text-success text-xl" />
                  </div>
                }
                title={
                  <div className="flex items-center gap-2">
                    <Text strong>{item.service}</Text>
                    <Tag color={statusConfig[item.status]?.color || "default"}>
                      {statusConfig[item.status]?.label || item.status}
                    </Tag>
                  </div>
                }
                description={
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ShopOutlined className="text-base-content/40" />
                      <Text type="secondary" className="text-sm">
                        {item.shop}
                      </Text>
                    </div>
                    <div className="flex items-center gap-4">
                      <Text type="secondary" className="text-sm">
                        <ClockCircleOutlined className="mr-1" />
                        {item.date} às {item.time}
                      </Text>
                      <Text type="secondary" className="text-sm">
                        <CarOutlined className="mr-1" />
                        {item.vehicle}
                      </Text>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
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

export default ClientAppointmentsList;
