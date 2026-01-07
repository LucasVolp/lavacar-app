"use client";

import React from "react";
import { Space, Empty, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { BlockedTimeCard, type BlockedTime } from "./BlockedTimeCard";

interface BlockedTimesListProps {
  blockedTimes: BlockedTime[];
  onEdit?: (blockedTime: BlockedTime) => void;
  onDelete?: (id: string) => void;
  onAddNew?: () => void;
}

export const BlockedTimesList: React.FC<BlockedTimesListProps> = ({
  blockedTimes,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  if (blockedTimes.length === 0) {
    return (
      <Empty
        description="Nenhum bloqueio cadastrado"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        className="py-12"
      >
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
          Criar Primeiro Bloqueio
        </Button>
      </Empty>
    );
  }

  return (
    <Space direction="vertical" className="w-full" size="middle">
      {blockedTimes.map((blockedTime) => (
        <BlockedTimeCard
          key={blockedTime.id}
          blockedTime={blockedTime}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Space>
  );
};

export default BlockedTimesList;
