import React from "react";
import { Card } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Appointment } from "@/types/appointment";
import { formatDuration } from "./formatters";

interface AppointmentDateTimeCardProps {
  appointment: Appointment;
}

export function AppointmentDateTimeCard({ appointment }: AppointmentDateTimeCardProps) {
  const scheduledDate = dayjs(appointment.scheduledAt);
  const endDate = dayjs(appointment.endTime);

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-20 h-20 bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-cyan-100 dark:border-cyan-500/10">
          <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
            {scheduledDate.format("DD")}
          </span>
          <span className="text-xs font-bold text-cyan-500 dark:text-cyan-400 uppercase tracking-wider">
            {scheduledDate.format("MMM")}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold m-0 text-zinc-800 dark:text-zinc-100 capitalize">
            {scheduledDate.format("dddd")}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 m-0 mb-3">
            {scheduledDate.format("DD [de] MMMM [de] YYYY")}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-700/50">
            <span className="flex items-center gap-2 font-medium">
              <ClockCircleOutlined className="text-cyan-500" />
              {scheduledDate.format("HH:mm")} - {endDate.format("HH:mm")}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600 hidden sm:block" />
            <span className="text-sm">
              Duração estimada:{" "}
              <span className="font-semibold">{formatDuration(appointment.totalDuration)}</span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
