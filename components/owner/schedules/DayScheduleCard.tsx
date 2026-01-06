"use client";

import React from "react";
import { Card, Switch, TimePicker, Typography, Space } from "antd";
import dayjs, { Dayjs } from "dayjs";

const { Text } = Typography;

export interface DaySchedule {
  dayOfWeek: number;
  dayName: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStart?: string;
  breakEnd?: string;
}

interface DayScheduleCardProps {
  schedule: DaySchedule;
  onChange: (schedule: DaySchedule) => void;
}

const timeFormat = "HH:mm";

export const DayScheduleCard: React.FC<DayScheduleCardProps> = ({
  schedule,
  onChange,
}) => {
  const handleToggle = (checked: boolean) => {
    onChange({ ...schedule, isOpen: checked });
  };

  const handleTimeChange = (
    field: "openTime" | "closeTime" | "breakStart" | "breakEnd",
    time: Dayjs | null
  ) => {
    onChange({
      ...schedule,
      [field]: time ? time.format(timeFormat) : undefined,
    });
  };

  return (
    <Card
      className={`border-base-200 ${!schedule.isOpen ? "opacity-60" : ""}`}
      styles={{ body: { padding: "16px" } }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Day Name & Toggle */}
        <div className="flex items-center justify-between sm:w-32">
          <Text strong className={schedule.isOpen ? "text-success" : "text-base-content/50"}>
            {schedule.dayName}
          </Text>
          <Switch
            checked={schedule.isOpen}
            onChange={handleToggle}
            size="small"
          />
        </div>

        {schedule.isOpen && (
          <>
            {/* Operating Hours */}
            <div className="flex items-center gap-2 flex-grow">
              <Space size="small">
                <Text type="secondary" className="text-xs">Abre:</Text>
                <TimePicker
                  format={timeFormat}
                  value={dayjs(schedule.openTime, timeFormat)}
                  onChange={(time) => handleTimeChange("openTime", time)}
                  size="small"
                  className="w-20"
                  minuteStep={15}
                />
              </Space>
              <Text type="secondary">até</Text>
              <Space size="small">
                <Text type="secondary" className="text-xs">Fecha:</Text>
                <TimePicker
                  format={timeFormat}
                  value={dayjs(schedule.closeTime, timeFormat)}
                  onChange={(time) => handleTimeChange("closeTime", time)}
                  size="small"
                  className="w-20"
                  minuteStep={15}
                />
              </Space>
            </div>

            {/* Break (optional) */}
            <div className="flex items-center gap-2">
              <Text type="secondary" className="text-xs">Intervalo:</Text>
              <TimePicker
                format={timeFormat}
                value={schedule.breakStart ? dayjs(schedule.breakStart, timeFormat) : null}
                onChange={(time) => handleTimeChange("breakStart", time)}
                size="small"
                className="w-20"
                placeholder="Início"
                minuteStep={15}
              />
              <Text type="secondary">-</Text>
              <TimePicker
                format={timeFormat}
                value={schedule.breakEnd ? dayjs(schedule.breakEnd, timeFormat) : null}
                onChange={(time) => handleTimeChange("breakEnd", time)}
                size="small"
                className="w-20"
                placeholder="Fim"
                minuteStep={15}
              />
            </div>
          </>
        )}

        {!schedule.isOpen && (
          <Text type="secondary" className="italic">
            Fechado
          </Text>
        )}
      </div>
    </Card>
  );
};

export default DayScheduleCard;
