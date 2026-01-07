"use client";

import React from "react";
import { Typography, Button, Space } from "antd";
import { SettingOutlined, SaveOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface SettingsHeaderProps {
  onSave?: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  onSave,
  isSaving = false,
  hasChanges = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <SettingOutlined className="text-primary text-xl" />
        </div>
        <div>
          <Title level={3} className="!mb-0">
            Configurações
          </Title>
          <span className="text-base-content/60 text-sm">
            Configure os dados do seu estabelecimento
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

export default SettingsHeader;
