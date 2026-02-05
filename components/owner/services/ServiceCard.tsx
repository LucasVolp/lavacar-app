"use client";

import React from "react";
import { Card, Tag, Switch } from "antd";
import { EditOutlined, DeleteOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { Services } from "@/types/services";
import { CustomTooltip, CustomPopconfirm } from "@/components/ui";

const { Text } = Typography;

interface ServiceCardProps {
  service: Services;
  onEdit: (service: Services) => void;
  onDelete: (id: string) => void;
  onToggleActive: (service: Services) => void;
  isUpdating: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onEdit,
  onDelete,
  onToggleActive,
  isUpdating,
}) => {
  return (
    <Card
      hoverable
      className={`h-full transition-all duration-200 hover:shadow-lg ${
        service.isActive === false ? "opacity-70 grayscale-[30%]" : ""
      }`}
      style={{
        borderTop: `4px solid ${service.isActive !== false ? "#52c41a" : "#d9d9d9"}`,
      }}
      actions={[
        <CustomTooltip title={service.isActive !== false ? "Desativar" : "Ativar"} key="toggle">
          <Switch
            size="small"
            checked={service.isActive !== false}
            onChange={() => onToggleActive(service)}
            loading={isUpdating}
          />
        </CustomTooltip>,
        <CustomTooltip title="Editar" key="edit">
          <EditOutlined
            onClick={() => onEdit(service)}
            className="text-blue-500"
          />
        </CustomTooltip>,
        <CustomPopconfirm
          key="delete"
          title="Excluir serviço"
          description="Tem certeza que deseja excluir?"
          onConfirm={() => onDelete(service.id)}
          okText="Sim"
          cancelText="Não"
          okButtonProps={{ danger: true }}
        >
          <CustomTooltip title="Excluir">
            <DeleteOutlined className="text-red-500" />
          </CustomTooltip>
        </CustomPopconfirm>,
      ]}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Text strong className="text-lg block dark:text-zinc-100">
              {service.name}
            </Text>
            {service.description && (
              <Text type="secondary" className="text-sm line-clamp-2 dark:text-zinc-400">
                {service.description}
              </Text>
            )}
          </div>
          <Tag
            color={service.isActive !== false ? "success" : "default"}
            className="ml-2 shrink-0"
          >
            {service.isActive !== false ? "Ativo" : "Inativo"}
          </Tag>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t dark:border-zinc-800">
          <div className="flex items-center gap-1 text-gray-500 dark:text-zinc-400">
            <ClockCircleOutlined />
            <span>{service.duration} min</span>
          </div>
          <Text strong className="text-xl text-green-600 dark:text-green-400">
            R$ {parseFloat(service.price).toFixed(2)}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
