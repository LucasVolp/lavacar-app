"use client";

import React from "react";
import { Card, Empty, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface VehiclesEmptyStateProps {
  onAdd: () => void;
}

export const VehiclesEmptyState: React.FC<VehiclesEmptyStateProps> = ({ onAdd }) => {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900">
      <Empty
        description={
          <span className="text-zinc-500 dark:text-zinc-400">
            Você ainda não tem veículos cadastrados
          </span>
        }
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        className="my-8"
      >
        <Button type="primary" onClick={onAdd} icon={<PlusOutlined />}>
          Cadastrar Primeiro Veículo
        </Button>
      </Empty>
    </Card>
  );
};
