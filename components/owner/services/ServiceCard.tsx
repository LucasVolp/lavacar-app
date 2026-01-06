"use client";

import React from "react";
import { Card, Typography, Tag, Button, Space, Dropdown, Switch } from "antd";
import type { MenuProps } from "antd";
import {
  ClockCircleOutlined,
  DollarOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // in minutes
  category?: string;
  isActive: boolean;
}

interface ServiceCardProps {
  service: Service;
  onEdit?: (service: Service) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (service: Service) => void;
  onToggleActive?: (id: string, active: boolean) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleActive,
}) => {
  const menuItems: MenuProps["items"] = [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Editar",
      onClick: () => onEdit?.(service),
    },
    {
      key: "duplicate",
      icon: <CopyOutlined />,
      label: "Duplicar",
      onClick: () => onDuplicate?.(service),
    },
    { type: "divider" },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Excluir",
      danger: true,
      onClick: () => onDelete?.(service.id),
    },
  ];

  return (
    <Card
      className={`border-base-200 hover:shadow-md transition-all ${!service.isActive ? "opacity-60" : ""}`}
      styles={{ body: { padding: "16px" } }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <Title level={5} className="!mb-0">
              {service.name}
            </Title>
            {service.category && (
              <Tag color="blue">{service.category}</Tag>
            )}
          </div>
          {service.description && (
            <Text type="secondary" className="text-sm line-clamp-2">
              {service.description}
            </Text>
          )}
        </div>
        <Space>
          <Switch
            size="small"
            checked={service.isActive}
            onChange={(checked) => onToggleActive?.(service.id, checked)}
          />
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      </div>

      <div className="flex items-center gap-4 pt-3 border-t border-base-200">
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-success" />
          <Text strong className="text-success">
            R$ {service.price.toFixed(2)}
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-info" />
          <Text type="secondary">{service.duration} min</Text>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
