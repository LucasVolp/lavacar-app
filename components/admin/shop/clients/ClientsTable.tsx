"use client";

import React from "react";
import { Table, Avatar, Typography, Button } from "antd";
import { 
  EyeOutlined, 
  CarOutlined, 
  CalendarOutlined, 
  StarFilled,
  PhoneOutlined,
  WhatsAppOutlined,
  EditOutlined
} from "@ant-design/icons";
import { ShopClient } from "@/types/shopClient";
import { formatPhone } from "@/utils/formatters";
import { CustomTooltip, StatusBadge } from "@/components/ui";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";

const { Text } = Typography;

interface ClientsTableProps {
  clients: ShopClient[];
  onViewClient: (client: ShopClient) => void;
  onEditClient?: (client: ShopClient) => void;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({ clients, onViewClient, onEditClient }) => {
  const getAvatarColor = (name: string) => {
    const colors = [
      "#f56a00", "#7265e6", "#ffbf00", "#00a2ae", 
      "#f5222d", "#52c41a", "#1890ff", "#eb2f96"
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleWhatsApp = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    const cleanPhone = phone?.replace(/\D/g, "");
    if (cleanPhone) {
      window.open(`https://wa.me/${cleanPhone}`, "_blank");
    }
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
          <div className="flex items-center gap-3 min-w-0">
            <Avatar
              size={40}
              src={user.picture}
              style={{ backgroundColor: !user.picture ? getAvatarColor(fullName) : undefined }}
              className="flex-shrink-0"
            >
              {!user.picture && initials}
            </Avatar>
            <div className="min-w-0">
              <Text strong className="block dark:text-white truncate">{fullName}</Text>
              <Text type="secondary" className="text-xs truncate block">{email}</Text>
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
          <div className="flex items-center gap-2">
             <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
              <PhoneOutlined />
              {formatPhone(phone)}
            </div>
            <CustomTooltip title="Abrir no WhatsApp">
              <Button
                type="text"
                size="small"
                icon={<WhatsAppOutlined />}
                onClick={(e) => handleWhatsApp(e, phone)}
                className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center justify-center"
              />
            </CustomTooltip>
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
        <CustomTooltip title={record.user?.vehicles?.map(v => `${v.brand} ${v.model}`).join(", ") || "Sem veículos"}>
          <div className="flex items-center justify-center gap-1">
            <CarOutlined className="text-emerald-500" />
            <Text strong className="dark:text-zinc-300">{record.user?.vehicles?.length || 0}</Text>
          </div>
        </CustomTooltip>
      ),
    },
    {
      title: "Visitas",
      key: "appointments",
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          <CalendarOutlined className="text-blue-500" />
          <Text strong className="dark:text-zinc-300">{record.user?.appointments?.length || 0}</Text>
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
            <Text strong className="text-amber-600 dark:text-amber-500">{avg}</Text>
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
            <span className="dark:text-zinc-400">{dayjs(lastAppointment.scheduledAt).format("DD/MM/YYYY")}</span>
            <StatusBadge status={lastAppointment.status} className="m-0" />
          </div>
        );
      },
    },
    {
      title: "Cliente desde",
      key: "createdAt",
      render: (_, record) => <span className="dark:text-zinc-400">{dayjs(record.createdAt).format("DD/MM/YYYY")}</span>,
    },
    {
      title: "",
      key: "actions",
      align: "center",
      width: 100,
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1">
          <CustomTooltip title="Ver detalhes">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={(e) => {
                e.stopPropagation();
                onViewClient(record);
              }}
              className="text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400"
            />
          </CustomTooltip>
          {onEditClient && (
            <CustomTooltip title="Editar">
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClient(record);
                }}
                className="text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400"
              />
            </CustomTooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={clients}
      rowKey="id"
      scroll={{ x: 800 }}
      pagination={{
        pageSize: 10, 
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} clientes`,
        className: "!px-4 !py-4 !mr-4"
      }}
      className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 [&_.ant-pagination]:mt-4 [&_.ant-pagination]:mb-2 [&_.ant-table-thead_th]:!bg-zinc-50 dark:[&_.ant-table-thead_th]:!bg-zinc-900 dark:[&_.ant-table-thead_th]:!text-zinc-400 dark:[&_.ant-table-tbody_td]:!border-zinc-800 dark:[&_.ant-table-row:hover_td]:!bg-zinc-800/50"
      rowClassName="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer dark:bg-zinc-900/50"
      onRow={(record) => ({
        onClick: () => onViewClient(record),
      })}
    />
  );
};
