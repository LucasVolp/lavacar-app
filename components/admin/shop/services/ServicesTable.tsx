"use client";

import React from "react";
import { Table, Tag, Space, Button, Typography, Card } from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  StopOutlined, 
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Services } from "@/types/services";
import { CustomTooltip } from "@/components/ui";

const { Text } = Typography;

interface ServicesTableProps {
  services: Services[];
  loading?: boolean;
  onEdit: (service: Services) => void;
  onDelete: (id: string) => void;
  onToggleActive: (service: Services) => void;
  updatingServiceId?: string | null;
}

export const ServicesTable: React.FC<ServicesTableProps> = ({
  services,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
  updatingServiceId,
}) => {
  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Services) => (
        <div>
          <Text strong>{text}</Text>
          {record.description && (
            <Text type="secondary" className="block text-xs line-clamp-1">
              {record.description}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Preço",
      dataIndex: "price",
      key: "price",
      render: (price: string) => (
        <Text strong className="text-green-600">
          R$ {parseFloat(price).toFixed(2)}
        </Text>
      ),
      sorter: (a: Services, b: Services) => parseFloat(a.price) - parseFloat(b.price),
    },
    {
      title: "Duração",
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => `${duration} min`,
      sorter: (a: Services, b: Services) => a.duration - b.duration,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive !== false ? "success" : "error"}>
          {isActive !== false ? "Ativo" : "Inativo"}
        </Tag>
      ),
      filters: [
        { text: "Ativo", value: true },
        { text: "Inativo", value: false },
      ],
      onFilter: (value: boolean | React.Key, record: Services) => {
        const isActive = record.isActive !== false;
        return isActive === value;
      },
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: unknown, record: Services) => (
        <Space>
          <CustomTooltip title="Editar">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => onEdit(record)} 
              className="text-blue-500"
            />
          </CustomTooltip>
          <CustomTooltip title={record.isActive === false ? "Ativar" : "Desativar"}>
            <Button
              type="text"
              icon={record.isActive === false ? <CheckCircleOutlined /> : <StopOutlined />}
              onClick={() => onToggleActive(record)}
              loading={updatingServiceId === record.id}
              className={record.isActive === false ? "text-green-500" : "text-orange-500"}
            />
          </CustomTooltip>
          <CustomTooltip title="Excluir">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => onDelete(record.id)} 
            />
          </CustomTooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card className="shadow-sm">
      <Table
        dataSource={services}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};
