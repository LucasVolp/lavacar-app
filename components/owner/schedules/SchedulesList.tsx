"use client";

import React from "react";
import { Space } from "antd";
import { DayScheduleCard, type DaySchedule } from "./DayScheduleCard";

interface SchedulesListProps {
  schedules: DaySchedule[];
  onChange: (schedules: DaySchedule[]) => void;
}

export const SchedulesList: React.FC<SchedulesListProps> = ({
  schedules,
  onChange,
}) => {
  const handleDayChange = (updatedSchedule: DaySchedule) => {
    const newSchedules = schedules.map((s) =>
      s.dayOfWeek === updatedSchedule.dayOfWeek ? updatedSchedule : s
    );
    onChange(newSchedules);
  };

  return (
    <Space direction="vertical" className="w-full" size="small">
      {schedules.map((schedule) => (
        <DayScheduleCard
          key={schedule.dayOfWeek}
          schedule={schedule}
          onChange={handleDayChange}
        />
      ))}
    </Space>
  );
};

export default SchedulesList;
