"use client";

import React, { useState } from "react";
import { Button, Card, Row, Col, Switch, TimePicker, message } from "antd";
import { ClockCircleOutlined, CoffeeOutlined, CopyOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

type Weekday = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export interface ScheduleRow {
  weekday: Weekday;
  label: string;
  isOpen: boolean;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  hasBreak: boolean;
  breakStartTime: string; // HH:mm
  breakEndTime: string;   // HH:mm
}

interface StepScheduleProps {
  isSubmitting: boolean;
  onSubmit: (rows: ScheduleRow[]) => Promise<void>;
  onBack: () => void;
}

const SECTION_CONTAINER_CLASS =
  "bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-xl shadow-sm overflow-hidden transition-colors duration-200";

const DEFAULT_START = "08:00";
const DEFAULT_END = "18:00";
const DEFAULT_BREAK_START = "12:00";
const DEFAULT_BREAK_END = "13:00";

const WEEKDAYS: { weekday: Weekday; label: string; isWeekend: boolean }[] = [
  { weekday: "MONDAY", label: "Segunda-feira", isWeekend: false },
  { weekday: "TUESDAY", label: "Terça-feira", isWeekend: false },
  { weekday: "WEDNESDAY", label: "Quarta-feira", isWeekend: false },
  { weekday: "THURSDAY", label: "Quinta-feira", isWeekend: false },
  { weekday: "FRIDAY", label: "Sexta-feira", isWeekend: false },
  { weekday: "SATURDAY", label: "Sábado", isWeekend: true },
  { weekday: "SUNDAY", label: "Domingo", isWeekend: true },
];

const createInitialRows = (): ScheduleRow[] =>
  WEEKDAYS.map(({ weekday, label }) => ({
    weekday,
    label,
    isOpen: weekday !== "SUNDAY",
    startTime: DEFAULT_START,
    endTime: DEFAULT_END,
    hasBreak: false,
    breakStartTime: DEFAULT_BREAK_START,
    breakEndTime: DEFAULT_BREAK_END,
  }));

const timeFormat = "HH:mm";

export const StepSchedule: React.FC<StepScheduleProps> = ({
  isSubmitting,
  onSubmit,
  onBack,
}) => {
  const [rows, setRows] = useState<ScheduleRow[]>(createInitialRows);

  const updateRow = (index: number, patch: Partial<ScheduleRow>) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const copyMondayToAll = () => {
    const monday = rows[0];
    setRows((prev) =>
      prev.map((r, i) =>
        i === 0
          ? r
          : {
              ...r,
              isOpen: monday.isOpen,
              startTime: monday.startTime,
              endTime: monday.endTime,
              hasBreak: monday.hasBreak,
              breakStartTime: monday.breakStartTime,
              breakEndTime: monday.breakEndTime,
            }
      )
    );
    message.info("Horário de segunda copiado para todos os dias.");
  };

  const handleSubmit = async () => {
    const openDays = rows.filter((r) => r.isOpen);

    if (openDays.length === 0) {
      message.warning("Selecione ao menos um dia de funcionamento.");
      return;
    }

    for (const row of openDays) {
      if (row.startTime >= row.endTime) {
        message.error(`${row.label}: horário de abertura deve ser antes do fechamento.`);
        return;
      }
      if (row.hasBreak) {
        if (row.breakStartTime >= row.breakEndTime) {
          message.error(`${row.label}: horário de início do intervalo deve ser antes do fim.`);
          return;
        }
        if (row.breakStartTime <= row.startTime || row.breakEndTime >= row.endTime) {
          message.error(`${row.label}: o intervalo deve estar dentro do horário de funcionamento.`);
          return;
        }
      }
    }

    await onSubmit(rows);
  };

  return (
    <>
      <div className={SECTION_CONTAINER_CLASS}>
        <Card
          bordered={false}
          title={<span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Horários de Funcionamento</span>}
          extra={
            <Button
              icon={<CopyOutlined />}
              size="small"
              onClick={copyMondayToAll}
              className="text-zinc-600 dark:text-zinc-300"
            >
              Copiar Segunda para todos
            </Button>
          }
          className="bg-transparent"
          styles={{ header: { padding: "24px 32px 0", borderBottom: "none" }, body: { padding: 32 } }}
        >
          <div className="space-y-3">
            {rows.map((row, index) => {
              const weekdayMeta = WEEKDAYS.find((w) => w.weekday === row.weekday);
              const isWeekend = weekdayMeta?.isWeekend ?? false;

              return (
                <div
                  key={row.weekday}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    row.isOpen
                      ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/50"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-75"
                  }`}
                >
                  <Row gutter={[16, 16]} align="middle">
                    {/* Toggle & Day Name */}
                    <Col xs={24} sm={6}>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={row.isOpen}
                          onChange={(checked) => updateRow(index, { isOpen: checked })}
                        />
                        <div className="flex items-center flex-wrap gap-2">
                          <span
                            className={`font-semibold transition-colors ${
                              row.isOpen
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-zinc-500 dark:text-zinc-500"
                            }`}
                          >
                            {row.label}
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
                          row.isOpen ? "opacity-100 pointer-events-auto" : "opacity-50 pointer-events-none"
                        }`}
                      >
                        <ClockCircleOutlined
                          className={
                            row.isOpen ? "text-blue-500 dark:text-blue-400" : "text-zinc-300 dark:text-zinc-600"
                          }
                        />
                        <TimePicker
                          value={dayjs(row.startTime, timeFormat)}
                          format={timeFormat}
                          minuteStep={15}
                          needConfirm={false}
                          allowClear={false}
                          placeholder="Início"
                          className="w-24"
                          onChange={(value: Dayjs | null) => {
                            if (value) updateRow(index, { startTime: value.format(timeFormat) });
                          }}
                        />
                        <span className="text-zinc-400 text-xs">às</span>
                        <TimePicker
                          value={dayjs(row.endTime, timeFormat)}
                          format={timeFormat}
                          minuteStep={15}
                          needConfirm={false}
                          allowClear={false}
                          placeholder="Fim"
                          className="w-24"
                          onChange={(value: Dayjs | null) => {
                            if (value) updateRow(index, { endTime: value.format(timeFormat) });
                          }}
                        />
                      </div>
                    </Col>

                    {/* Break Time */}
                    <Col xs={24} sm={10}>
                      <div
                        className={`flex items-center gap-2 flex-wrap transition-opacity duration-300 ${
                          row.isOpen ? "opacity-100 pointer-events-auto" : "opacity-50 pointer-events-none"
                        }`}
                      >
                        <div className="flex items-center gap-2 px-2 py-1 bg-zinc-100 dark:bg-zinc-800/50 rounded text-sm">
                          <Switch
                            checked={row.hasBreak}
                            onChange={(checked) => updateRow(index, { hasBreak: checked })}
                            size="small"
                          />
                          <CoffeeOutlined
                            className={
                              row.hasBreak && row.isOpen
                                ? "text-orange-500 dark:text-orange-400"
                                : "text-zinc-300 dark:text-zinc-600"
                            }
                          />
                          <span className="text-zinc-500 dark:text-zinc-400 text-xs">Intervalo</span>
                        </div>

                        {row.hasBreak && (
                          <div className="flex items-center gap-2 animate-fade-in">
                            <TimePicker
                              value={dayjs(row.breakStartTime, timeFormat)}
                              format={timeFormat}
                              minuteStep={15}
                              needConfirm={false}
                              allowClear={false}
                              placeholder="Início"
                              className="w-20"
                              size="small"
                              onChange={(value: Dayjs | null) => {
                                if (value) updateRow(index, { breakStartTime: value.format(timeFormat) });
                              }}
                            />
                            <span className="text-zinc-400 text-xs">-</span>
                            <TimePicker
                              value={dayjs(row.breakEndTime, timeFormat)}
                              format={timeFormat}
                              minuteStep={15}
                              needConfirm={false}
                              allowClear={false}
                              placeholder="Fim"
                              className="w-20"
                              size="small"
                              onChange={(value: Dayjs | null) => {
                                if (value) updateRow(index, { breakEndTime: value.format(timeFormat) });
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <Button size="large" onClick={onBack} className="text-zinc-600 dark:text-zinc-300">
          Voltar
        </Button>
        <Button
          type="primary"
          size="large"
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          Salvar Horários e Continuar
        </Button>
      </div>
    </>
  );
};
