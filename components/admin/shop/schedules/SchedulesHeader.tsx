"use client";

import React from "react";
import { Typography, Button } from "antd";
import { ClockCircleOutlined, SaveOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface SchedulesHeaderProps {
  onSave: () => void;
  saving: boolean;
  hasChanges: boolean;
}

export const SchedulesHeader: React.FC<SchedulesHeaderProps> = ({
  onSave,
  saving,
  hasChanges,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col gap-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={3} className="!mb-1 flex items-center gap-2 !text-zinc-900 dark:!text-zinc-100">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full flex items-center justify-center">
              <ClockCircleOutlined className="text-blue-600 dark:text-blue-400" />
            </div>
            Horários de Funcionamento
          </Title>
          <Text className="text-zinc-500 dark:text-zinc-400 block mt-1">
            Configure os dias e horários que o estabelecimento atende
          </Text>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          size="large"
          onClick={onSave}
          loading={saving}
          disabled={!hasChanges}
          className={`${
            hasChanges 
              ? 'shadow-[0_0_0_4px_rgba(59,130,246,0.2)] dark:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' 
              : ''
          }`}
        >
          Salvar Alterações
        </Button>
      </div>

      {hasChanges && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/30 transition-colors animate-fade-in">
          <ExclamationCircleOutlined className="text-orange-500 dark:text-orange-400 text-lg mt-0.5" />
          <div>
            <div className="font-medium text-orange-800 dark:text-orange-200">
              Você tem alterações não salvas
            </div>
            <div className="text-sm text-orange-600 dark:text-orange-300/80 mt-1">
              Lembre-se de clicar em salvar para aplicar os novos horários.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
