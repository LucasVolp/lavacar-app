"use client";

import React from "react";
import { Typography } from "antd";
import { StopOutlined, PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface BlockedTimeHeaderProps {
  onAdd: () => void;
}

export const BlockedTimeHeader: React.FC<BlockedTimeHeaderProps> = ({ onAdd }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors duration-300">
      <div>
        <Title level={3} className="!mb-1 flex items-center gap-2 !text-zinc-900 dark:!text-zinc-100">
          <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full flex items-center justify-center">
            <StopOutlined className="text-red-600 dark:text-red-400" />
          </div>
          Bloqueios de Horário
        </Title>
        <Text className="text-zinc-500 dark:text-zinc-400 block mt-1">
          Gerencie os dias e horários em que o estabelecimento não atenderá
        </Text>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 min-h-[44px] px-6 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-base shadow-lg shadow-red-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-red-500/30 w-full sm:w-auto"
      >
        <PlusOutlined />
        Novo Bloqueio
      </button>
    </div>
  );
};
