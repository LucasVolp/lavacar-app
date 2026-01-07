"use client";

import React from "react";
import { Card, Typography, InputNumber, Space, Divider } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

interface ScheduleSettingsProps {
  slotDuration: number;
  maxAppointmentsPerSlot: number;
  onSlotDurationChange: (value: number) => void;
  onMaxAppointmentsChange: (value: number) => void;
}

export const ScheduleSettings: React.FC<ScheduleSettingsProps> = ({
  slotDuration,
  maxAppointmentsPerSlot,
  onSlotDurationChange,
  onMaxAppointmentsChange,
}) => {
  return (
    <Card className="border-base-200">
      <div className="flex items-center gap-2 mb-4">
        <ClockCircleOutlined className="text-primary" />
        <Title level={5} className="!mb-0">
          Configurações de Agendamento
        </Title>
      </div>

      <Space direction="vertical" className="w-full" size="middle">
        <div className="flex items-center justify-between">
          <div>
            <Text strong className="block">Intervalo entre horários</Text>
            <Text type="secondary" className="text-xs">
              Duração mínima de cada slot de agendamento
            </Text>
          </div>
          <InputNumber
            min={15}
            max={120}
            step={15}
            value={slotDuration}
            onChange={(value) => onSlotDurationChange(value || 30)}
            addonAfter="min"
            className="w-32"
          />
        </div>

        <Divider className="my-2" />

        <div className="flex items-center justify-between">
          <div>
            <Text strong className="block">Atendimentos simultâneos</Text>
            <Text type="secondary" className="text-xs">
              Máximo de agendamentos no mesmo horário
            </Text>
          </div>
          <InputNumber
            min={1}
            max={10}
            value={maxAppointmentsPerSlot}
            onChange={(value) => onMaxAppointmentsChange(value || 1)}
            className="w-20"
          />
        </div>
      </Space>
    </Card>
  );
};

export default ScheduleSettings;
