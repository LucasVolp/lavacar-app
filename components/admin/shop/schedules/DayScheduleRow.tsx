"use client";

import React from "react";
import { Row, Col, Switch, TimePicker } from "antd";
import { ClockCircleOutlined, CoffeeOutlined } from "@ant-design/icons";
import { ScheduleFormData, Weekday } from "./types";
import dayjs from "dayjs";

interface DayScheduleRowProps {
  dayKey: Weekday;
  dayLabel: string;
  data: ScheduleFormData;
  onChange: (day: Weekday, field: keyof ScheduleFormData, value: Date | null | boolean) => void;
  isWeekend: boolean;
  isLast: boolean;
}

export const DayScheduleRow: React.FC<DayScheduleRowProps> = ({
  dayKey,
  dayLabel,
  data,
  onChange,
  isWeekend,
  isLast,
}) => {
  return (
    <>
      <div
        className={`p-4 rounded-lg border transition-all duration-300 ${
          data.isOpen
            ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/50"
            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-75"
        }`}
      >
        <Row gutter={[16, 16]} align="middle">
          {/* Toggle & Day Name */}
          <Col xs={24} sm={6}>
            <div className="flex items-center gap-3">
              <Switch
                checked={data.isOpen}
                onChange={(checked) => onChange(dayKey, "isOpen", checked)}
              />
              <div className="flex items-center flex-wrap gap-2">
                <span
                  className={`font-semibold transition-colors ${
                    data.isOpen
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-zinc-500 dark:text-zinc-500"
                  }`}
                >
                  {dayLabel}
                </span>
                {isWeekend && (
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                    Fim de semana
                  </span>
                )}
              </div>
            </div>
          </Col>

          {/* Opening Hours */}
          <Col xs={24} sm={8}>
            <div
              className={`flex items-center gap-2 transition-opacity duration-300 ${
                data.isOpen ? "opacity-100 pointer-events-auto" : "opacity-50 pointer-events-none"
              }`}
            >
              <ClockCircleOutlined
                className={`${
                  data.isOpen ? "text-blue-500 dark:text-blue-400" : "text-zinc-300 dark:text-zinc-600"
                }`}
              />
              <TimePicker
                value={data.startTime ? dayjs(data.startTime) : null}
                onChange={(time) => onChange(dayKey, "startTime", time ? time.toDate() : null)}
                format="HH:mm"
                placeholder="Início"
                className="w-24"
                allowClear={false}
              />
              <span className="text-zinc-400 text-xs">às</span>
              <TimePicker
                value={data.endTime ? dayjs(data.endTime) : null}
                onChange={(time) => onChange(dayKey, "endTime", time ? time.toDate() : null)}
                format="HH:mm"
                placeholder="Fim"
                className="w-24"
                allowClear={false}
              />
            </div>
          </Col>

          {/* Break Time */}
          <Col xs={24} sm={10}>
            <div
              className={`flex items-center gap-2 flex-wrap transition-opacity duration-300 ${
                data.isOpen ? "opacity-100 pointer-events-auto" : "opacity-50 pointer-events-none"
              }`}
            >
              <div className="flex items-center gap-2 px-2 py-1 bg-zinc-100 dark:bg-zinc-800/50 rounded text-sm">
                <Switch
                  checked={data.hasBreak}
                  onChange={(checked) => onChange(dayKey, "hasBreak", checked)}
                  size="small"
                />
                <CoffeeOutlined
                  className={`${
                    data.hasBreak && data.isOpen
                      ? "text-orange-500 dark:text-orange-400"
                      : "text-zinc-300 dark:text-zinc-600"
                  }`}
                />
                <span className="text-zinc-500 dark:text-zinc-400 text-xs">Intervalo</span>
              </div>

              {data.hasBreak && (
                <div className="flex items-center gap-2 animate-fade-in">
                  <TimePicker
                    value={data.breakStartTime ? dayjs(data.breakStartTime) : null}
                    onChange={(time) => onChange(dayKey, "breakStartTime", time ? time.toDate() : null)}
                    format="HH:mm"
                    placeholder="Início"
                    className="w-20"
                    size="small"
                    allowClear={false}
                  />
                  <span className="text-zinc-400 text-xs">-</span>
                  <TimePicker
                    value={data.breakEndTime ? dayjs(data.breakEndTime) : null}
                    onChange={(time) => onChange(dayKey, "breakEndTime", time ? time.toDate() : null)}
                    format="HH:mm"
                    placeholder="Fim"
                    className="w-20"
                    size="small"
                    allowClear={false}
                  />
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
      {!isLast && <div className="h-3" />}
    </>
  );
};