"use client";

import React from "react";
import { Typography } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const SchedulesHeader: React.FC = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 sm:p-6 transition-colors duration-300">
      <div className="min-w-0">
        <Title level={3} className="!mb-1 flex items-center gap-2 !text-zinc-900 dark:!text-zinc-100 !text-lg sm:!text-xl">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full flex items-center justify-center shrink-0">
            <ClockCircleOutlined className="text-blue-600 dark:text-blue-400" />
          </div>
          Horários de Funcionamento
        </Title>
        <Text className="text-zinc-500 dark:text-zinc-400 block mt-1 text-sm">
          Configure os dias e horários que o estabelecimento atende
        </Text>
      </div>
    </div>
  );
};
