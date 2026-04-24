"use client";

import React from "react";
import { Table, Space, Button, Typography, Card, Avatar } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { Services } from "@/types/services";
import { CustomTooltip } from "@/components/ui";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ServicePricingSummary } from "./ServicePricingSummary";
import { DEFAULT_SERVICE_IMAGE } from "@/lib/assets";

const { Text } = Typography;

interface ServicesTableProps {
  services: Services[];
  loading?: boolean;
  onEdit?: (service: Services) => void;
  onDelete?: (id: string) => void;
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
  const [failedImages, setFailedImages] = React.useState<Record<string, boolean>>({});

  const columns = [
    {
      title: "Serviço",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Services) => {
        const fallbackKey = `default:${record.id}`;
        const src = record.photoUrl || DEFAULT_SERVICE_IMAGE || undefined;
        const imageFailed = failedImages[record.id] || (!record.photoUrl && failedImages[fallbackKey]);

        return (
        <div className="flex items-center gap-3 min-w-[250px]">
          <Avatar
            shape="square"
            size={46}
            src={!imageFailed ? src : undefined}
            icon={<PictureOutlined />}
            onError={() => {
              setFailedImages((prev) => ({
                ...prev,
                [record.photoUrl ? record.id : fallbackKey]: true,
              }));
              return false;
            }}
            className="flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
          />
          <div className="space-y-1">
            <Text strong className="dark:text-zinc-100">
              {text}
            </Text>
            {record.description && (
              <Text type="secondary" className="block text-xs line-clamp-1 dark:text-zinc-400">
                {record.description}
              </Text>
            )}
            <div className="flex flex-wrap items-center gap-1.5">
              <StatusBadge status={record.isActive === false ? "INACTIVE" : "ACTIVE"} />
              {record.isBudgetOnly && <StatusBadge status="BUDGET_ONLY" />}
              {record.hasVariants && <StatusBadge status="HAS_VARIANTS" />}
            </div>
          </div>
        </div>
        );
      },
    },
    {
      title: "Preço",
      key: "price",
      render: (_: unknown, record: Services) => <ServicePricingSummary service={record} compact />,
    },
    {
      title: "Duração",
      key: "duration",
      render: (_: unknown, record: Services) => {
        if (record.hasVariants && record.variants?.length) {
          const durations = record.variants.map((v) => v.duration);
          return `${Math.min(...durations)} - ${Math.max(...durations)} min`;
        }
        return `${record.duration} min`;
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: 140,
      render: (_: unknown, record: Services) => (
        <Space>
          {onEdit && (
            <CustomTooltip title="Editar">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
                className="text-indigo-500"
              />
            </CustomTooltip>
          )}
          <CustomTooltip title={record.isActive === false ? "Ativar" : "Desativar"}>
            <Button
              type="text"
              icon={record.isActive === false ? <CheckCircleOutlined /> : <StopOutlined />}
              onClick={() => onToggleActive(record)}
              loading={updatingServiceId === record.id}
              className={record.isActive === false ? "text-emerald-500" : "text-amber-500"}
            />
          </CustomTooltip>
          {onDelete && (
            <CustomTooltip title="Excluir">
              <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(record.id)} />
            </CustomTooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
      <Table dataSource={services} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
    </Card>
  );
};
