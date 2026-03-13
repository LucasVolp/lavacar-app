"use client";

import React from "react";
import { Button, Typography, Space, Tooltip } from "antd";
import { PlusOutlined, ShopOutlined, ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface ShopPageHeaderProps {
  title?: string;
  subtitle?: string;
  onCreate?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  totalCount?: number;
}

export default function ShopPageHeader({
  title = "Lojas",
  subtitle = "Gerencie seus estabelecimentos e configure agendamentos",
  onCreate,
  onRefresh,
  isLoading = false,
  totalCount,
}: ShopPageHeaderProps) {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 mb-6">
      <div className="card-body p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <ShopOutlined className="text-white text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <Title level={3} className="!mb-0 !text-base-content">
                  {title}
                </Title>
                {typeof totalCount === "number" && (
                  <span className="badge badge-primary badge-outline">
                    {totalCount} {totalCount === 1 ? "loja" : "lojas"}
                  </span>
                )}
              </div>
              <Text type="secondary" className="text-sm">
                {subtitle}
              </Text>
            </div>
          </div>

          <Space size="middle">
            {onRefresh && (
              <Tooltip title="Atualizar lista">
                <Button
                  icon={<ReloadOutlined spin={isLoading} />}
                  onClick={onRefresh}
                  loading={isLoading}
                  className="hover:border-primary hover:text-primary transition-colors"
                >
                  Atualizar
                </Button>
              </Tooltip>
            )}
            {onCreate && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onCreate}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-md"
              >
                Nova Loja
              </Button>
            )}
          </Space>
        </div>
      </div>
    </div>
  );
}
