"use client";

import React from "react";
import { Button } from "antd";
import { CarOutlined, PlusOutlined } from "@ant-design/icons";

interface VehiclesHeaderProps {
  onAdd: () => void;
}

export const VehiclesHeader: React.FC<VehiclesHeaderProps> = ({ onAdd }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl flex items-center justify-center shrink-0">
          <CarOutlined className="text-cyan-500 text-xl" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold m-0 text-zinc-800 dark:text-zinc-100">
            Meus Veículos
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm m-0">
            Gerencie seus veículos cadastrados
          </p>
        </div>
      </div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAdd}
        size="large"
        className="rounded-xl font-semibold min-h-[44px] w-full sm:w-auto"
      >
        Novo Veículo
      </Button>
    </div>
  );
};
