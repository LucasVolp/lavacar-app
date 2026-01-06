"use client";

import React, { useState } from "react";
import { Card, Row, Col, message } from "antd";
import {
  SchedulesHeader,
  SchedulesList,
  ScheduleSettings,
  type DaySchedule,
} from "@/components/owner/schedules";

// Mock data - Horários padrão
const defaultSchedules: DaySchedule[] = [
  { dayOfWeek: 0, dayName: "Domingo", isOpen: false, openTime: "08:00", closeTime: "18:00" },
  { dayOfWeek: 1, dayName: "Segunda-feira", isOpen: true, openTime: "08:00", closeTime: "18:00", breakStart: "12:00", breakEnd: "13:00" },
  { dayOfWeek: 2, dayName: "Terça-feira", isOpen: true, openTime: "08:00", closeTime: "18:00", breakStart: "12:00", breakEnd: "13:00" },
  { dayOfWeek: 3, dayName: "Quarta-feira", isOpen: true, openTime: "08:00", closeTime: "18:00", breakStart: "12:00", breakEnd: "13:00" },
  { dayOfWeek: 4, dayName: "Quinta-feira", isOpen: true, openTime: "08:00", closeTime: "18:00", breakStart: "12:00", breakEnd: "13:00" },
  { dayOfWeek: 5, dayName: "Sexta-feira", isOpen: true, openTime: "08:00", closeTime: "18:00", breakStart: "12:00", breakEnd: "13:00" },
  { dayOfWeek: 6, dayName: "Sábado", isOpen: true, openTime: "08:00", closeTime: "14:00" },
];

export default function OwnerSchedulesPage() {
  const [schedules, setSchedules] = useState<DaySchedule[]>(defaultSchedules);
  const [originalSchedules] = useState<DaySchedule[]>(defaultSchedules);
  const [slotDuration, setSlotDuration] = useState(30);
  const [maxAppointmentsPerSlot, setMaxAppointmentsPerSlot] = useState(2);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = JSON.stringify(schedules) !== JSON.stringify(originalSchedules);

  const handleSave = async () => {
    setIsSaving(true);
    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    message.success("Horários salvos com sucesso!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SchedulesHeader
        onSave={handleSave}
        isSaving={isSaving}
        hasChanges={hasChanges}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title="Dias da Semana"
            className="border-base-200"
          >
            <SchedulesList
              schedules={schedules}
              onChange={setSchedules}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <ScheduleSettings
            slotDuration={slotDuration}
            maxAppointmentsPerSlot={maxAppointmentsPerSlot}
            onSlotDurationChange={setSlotDuration}
            onMaxAppointmentsChange={setMaxAppointmentsPerSlot}
          />
        </Col>
      </Row>
    </div>
  );
}
