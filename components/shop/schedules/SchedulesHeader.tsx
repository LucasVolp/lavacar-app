"use client";

import React from "react";
import { Typography, Button, Space } from "antd";
import { ClockCircleOutlined, SaveOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface SchedulesHeaderProps {
  onSave?: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
}

export const SchedulesHeader: React.FC<SchedulesHeaderProps> = ({
  onSave,
  isSaving = false,
  hasChanges = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
          <ClockCircleOutlined className="text-success text-xl" />
        </div>
        <div>
          <Title level={3} className="!mb-0">
            Horários de Funcionamento
          </Title>
          <span className="text-base-content/60 text-sm">
            Configure os horários de atendimento do seu estabelecimento
          </span>
        </div>
      </div>
      <Space>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={onSave}
          loading={isSaving}
          disabled={!hasChanges}
        >
          Salvar Alterações
        </Button>
      </Space>
    </div>
  );
};

export default SchedulesHeader;
