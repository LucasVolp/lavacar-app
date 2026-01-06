"use client";

import React from "react";
import { Table, Tag, Button, Space, Avatar, Dropdown, Typography } from "antd";
import type { MenuProps, TableProps } from "antd";
import {
  UserOutlined,
  CarOutlined,
  ClockCircleOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export interface AppointmentRecord {
  id: string;
  customer: string;
  customerPhone?: string;
  vehicle: string;
  vehiclePlate: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: string;
}

interface AppointmentsTableProps {
  appointments: AppointmentRecord[];
  loading?: boolean;
  onView?: (record: AppointmentRecord) => void;
  onEdit?: (record: AppointmentRecord) => void;
  onConfirm?: (record: AppointmentRecord) => void;
  onCancel?: (record: AppointmentRecord) => void;
  onComplete?: (record: AppointmentRecord) => void;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  PENDING: { color: "gold", label: "Pendente" },
  CONFIRMED: { color: "blue", label: "Confirmado" },
  WAITING: { color: "purple", label: "Aguardando" },
  IN_PROGRESS: { color: "processing", label: "Em andamento" },
  COMPLETED: { color: "green", label: "Concluído" },
  CANCELED: { color: "red", label: "Cancelado" },
};

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  loading = false,
  onView,
  onEdit,
  onConfirm,
  onCancel,
  onComplete,
}) => {
  const getActionItems = (record: AppointmentRecord): MenuProps["items"] => {
    const items: MenuProps["items"] = [
      {
        key: "view",
        icon: <EyeOutlined />,
        label: "Ver detalhes",
        onClick: () => onView?.(record),
      },
      {
        key: "edit",
        icon: <EditOutlined />,
        label: "Editar",
        onClick: () => onEdit?.(record),
      },
    ];

    if (record.status === "PENDING") {
      items.push({
        key: "confirm",
        icon: <CheckCircleOutlined />,
        label: "Confirmar",
        onClick: () => onConfirm?.(record),
      });
    }

    if (record.status === "CONFIRMED" || record.status === "IN_PROGRESS") {
      items.push({
        key: "complete",
        icon: <CheckCircleOutlined className="text-success" />,
        label: "Marcar como concluído",
        onClick: () => onComplete?.(record),
      });
    }

    if (record.status !== "COMPLETED" && record.status !== "CANCELED") {
      items.push({ type: "divider" });
      items.push({
        key: "cancel",
        icon: <CloseCircleOutlined />,
        label: "Cancelar",
        danger: true,
        onClick: () => onCancel?.(record),
      });
    }

    return items;
  };

  const columns: TableProps<AppointmentRecord>["columns"] = [
    {
      title: "Cliente",
      key: "customer",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar icon={<UserOutlined />} className="bg-primary" />
          <div>
            <Text strong className="block text-sm">{record.customer}</Text>
            <Text type="secondary" className="text-xs">{record.customerPhone}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Veículo",
      key: "vehicle",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <CarOutlined className="text-info" />
          <div>
            <Text className="block text-sm">{record.vehicle}</Text>
            <Text type="secondary" className="text-xs">{record.vehiclePlate}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Serviço",
      dataIndex: "service",
      key: "service",
      render: (service) => <Text className="text-sm">{service}</Text>,
    },
    {
      title: "Data/Hora",
      key: "datetime",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-base-content/40" />
          <div>
            <Text className="block text-sm">{record.date}</Text>
            <Text type="secondary" className="text-xs">{record.time} ({record.duration}min)</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Valor",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Text strong className="text-success">
          R$ {price.toFixed(2)}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusConfig[status]?.color || "default"}>
          {statusConfig[status]?.label || status}
        </Tag>
      ),
    },
    {
      title: "Ações",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => onView?.(record)}>
            Ver
          </Button>
          <Dropdown menu={{ items: getActionItems(record) }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={appointments}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total: ${total} agendamentos`,
      }}
      className="bg-base-100 rounded-lg"
    />
  );
};

export default AppointmentsTable;
