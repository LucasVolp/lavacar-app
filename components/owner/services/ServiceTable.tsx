"use client";

import React from "react";
import { Table, Popconfirm, Switch, Button, Tooltip, Empty, Avatar } from "antd";
import { EditOutlined, DeleteOutlined, ClockCircleOutlined, DollarOutlined, PictureOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Services } from "@/types/services";

interface ServiceTableProps {
  services: Services[];
  loading: boolean;
  onEdit: (service: Services) => void;
  onDelete: (id: string) => void;
  onToggleActive: (service: Services) => void;
  updatingServiceId: string | null;
}

export const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
  updatingServiceId,
}) => {
  const columns: ColumnsType<Services> = [
    {
      title: "Serviço",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Services) => (
        <div className="flex items-center gap-3">
          <Avatar
            shape="square"
            size={36}
            src={record.photoUrl || undefined}
            icon={!record.photoUrl ? <PictureOutlined /> : undefined}
            className="flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
          />
          <div>
            <div className="font-medium text-slate-800">{name}</div>
            {record.description && (
              <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                {record.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Preço",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <div className="flex items-center gap-1 text-green-600 font-medium">
          <DollarOutlined className="text-xs" />
          R$ {price.toFixed(2)}
        </div>
      ),
    },
    {
      title: "Duração",
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => (
        <div className="flex items-center gap-1 text-slate-600">
          <ClockCircleOutlined className="text-xs" />
          {duration} min
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: Services) => (
        <Switch
          checked={isActive}
          onChange={() => onToggleActive(record)}
          loading={updatingServiceId === record.id}
          checkedChildren="Ativo"
          unCheckedChildren="Inativo"
          size="small"
        />
      ),
    },
    {
      title: "Ações",
      key: "actions",
      width: 100,
      render: (_: unknown, record: Services) => (
        <div className="flex items-center gap-1">
          <Tooltip title="Editar">
            <Button 
              type="text" 
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Excluir serviço"
            description="Tem certeza que deseja excluir este serviço?"
            onConfirm={() => onDelete(record.id)}
            okText="Excluir"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Excluir">
              <Button 
                type="text" 
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={services}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `${total} serviço(s)`,
      }}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Nenhum serviço cadastrado"
          />
        ),
      }}
      className="border border-slate-200 rounded-lg overflow-hidden"
    />
  );
};

export default ServiceTable;
