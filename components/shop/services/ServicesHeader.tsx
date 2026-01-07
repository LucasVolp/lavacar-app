"use client";

import React from "react";
import { Typography, Button, Space, Input } from "antd";
import { AppstoreOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface ServicesHeaderProps {
  onAddNew?: () => void;
  onSearch?: (value: string) => void;
}

export const ServicesHeader: React.FC<ServicesHeaderProps> = ({
  onAddNew,
  onSearch,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
          <AppstoreOutlined className="text-info text-xl" />
        </div>
        <div>
          <Title level={3} className="!mb-0">
            Serviços
          </Title>
          <span className="text-base-content/60 text-sm">
            Gerencie os serviços oferecidos pelo seu estabelecimento
          </span>
        </div>
      </div>
      <Space>
        <Input
          placeholder="Buscar serviço..."
          prefix={<SearchOutlined className="text-base-content/40" />}
          className="w-48"
          onChange={(e) => onSearch?.(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
          Novo Serviço
        </Button>
      </Space>
    </div>
  );
};

export default ServicesHeader;
