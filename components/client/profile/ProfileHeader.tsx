"use client";

import React from "react";
import { Typography, Button, Space } from "antd";
import { UserOutlined, SaveOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface ProfileHeaderProps {
  onSave?: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onSave,
  isSaving = false,
  hasChanges = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
          <UserOutlined className="text-info text-xl" />
        </div>
        <div>
          <Title level={3} className="!mb-0">
            Meu Perfil
          </Title>
          <span className="text-base-content/60 text-sm">
            Gerencie suas informações pessoais
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

export default ProfileHeader;
