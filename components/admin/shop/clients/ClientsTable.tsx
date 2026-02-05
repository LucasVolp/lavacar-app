"use client";

import React from "react";
import { Table, Avatar, Typography, Tag, Button, Tooltip } from "antd";
import { 
  EyeOutlined, 
  CarOutlined, 
  CalendarOutlined, 
  StarFilled,
  PhoneOutlined
} from "@ant-design/icons";
import { ShopClient } from "@/types/shopClient";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";

const { Text } = Typography;

interface ClientsTableProps {
  clients: ShopClient[];
  onViewClient: (client: ShopClient) => void;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({ clients, onViewClient }) => {
  const getAvatarColor = (name: string) => {
    const colors = [
      "#f56a00", "#7265e6", "#ffbf00", "#00a2ae", 
      "#f5222d", "#52c41a", "#1890ff", "#eb2f96"
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const columns: ColumnsType<ShopClient> = [
    {
      title: "Cliente",
      key: "client",
      render: (_, record) => {
        const user = record.user;
        if (!user) return "-";
        
        const fullName = record.customName || `${user.firstName} ${user.lastName || ""}`.trim();
        const email = record.customEmail || user.email;
        
        const initials = fullName
          .split(" ")
          .slice(0, 2)
          .map(n => n[0])
          .join("")
          .toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <Avatar 
              size={40} 
              src={user.picture}
              style={{ backgroundColor: !user.picture ? getAvatarColor(fullName) : undefined }}
            >
              {!user.picture && initials}
            </Avatar>
            <div>
              <Text strong className="block dark:text-white">{fullName}</Text>
              <Text type="secondary" className="text-xs">{email}</Text>
            </div>
          </div>
        );
      },
    },
    {
      title: "Telefone",
      key: "phone",
      render: (_, record) => {
        const phone = record.customPhone || record.user?.phone;
        return phone ? (
          <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
            <PhoneOutlined />
            {phone}
          </div>
        ) : (
          <Text type="secondary">-</Text>
        );
      },
    },
    {
      title: "Veículos",
      key: "vehicles",
      align: "center",
      render: (_, record) => (
        <Tooltip title={record.user?.vehicles?.map(v => `${v.brand} ${v.model}`).join(", ") || "Sem veículos"}>
          <div className="flex items-center justify-center gap-1">
            <CarOutlined className="text-emerald-500" />
            <Text strong>{record.user?.vehicles?.length || 0}</Text>
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Visitas",
      key: "appointments",
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          <CalendarOutlined className="text-blue-500" />
          <Text strong>{record.user?.appointments?.length || 0}</Text>
        </div>
      ),
    },
    {
      title: "Avaliação",
      key: "rating",
      align: "center",
      render: (_, record) => {
        const evaluations = record.user?.evaluations || [];
        if (evaluations.length === 0) return <Text type="secondary">-</Text>;
        
        const avg = (evaluations.reduce((acc, e) => acc + e.rating, 0) / evaluations.length).toFixed(1);
        return (
          <div className="flex items-center justify-center gap-1">
            <StarFilled className="text-amber-500" />
            <Text strong className="text-amber-600">{avg}</Text>
          </div>
        );
      },
    },
    {
      title: "Última Visita",
      key: "lastVisit",
      render: (_, record) => {
        const lastAppointment = record.user?.appointments?.[0];
        if (!lastAppointment) return <Text type="secondary">-</Text>;
        
        return (
          <div className="flex items-center gap-2">
            <span>{dayjs(lastAppointment.scheduledAt).format("DD/MM/YYYY")}</span>
            <Tag 
              color={
                lastAppointment.status === "COMPLETED" ? "success" :
                lastAppointment.status === "CANCELED" ? "error" :
                "processing"
              }
              className="m-0"
            >
              {lastAppointment.status === "COMPLETED" ? "OK" :
               lastAppointment.status === "CANCELED" ? "Cancelado" : "Pendente"}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Cliente desde",
      key: "createdAt",
      render: (_, record) => dayjs(record.createdAt).format("DD/MM/YYYY"),
    },
    {
      title: "",
      key: "actions",
      align: "center",
      width: 60,
      render: (_, record) => (
        <Button 
          type="text" 
          icon={<EyeOutlined />} 
          onClick={() => onViewClient(record)}
          className="text-zinc-500 hover:text-cyan-600"
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={clients}
      rowKey="id"
      pagination={{ 
        pageSize: 10, 
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} clientes`,
        className: "px-4 py-3"
      }}
      className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 [&_.ant-pagination]:mt-4 [&_.ant-pagination]:mb-2"
      rowClassName="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer"
      onRow={(record) => ({
        onClick: () => onViewClient(record),
      })}
    />
  );
};
