'use client';

import { CreateSchedulePayload } from "@/types/schedule";
import { format, parse } from "date-fns";
import { message, Spin, Select, Button } from "antd";
import {
  WEEKDAYS,
  Weekday,
  ScheduleFormData,
  SchedulesHeader,
  SchedulesSummary,
  DayScheduleRow,
  ScheduleAlert,
} from "@/components/admin/shop/schedules";
import { useCreateSchedule, useShopSchedules, useUpdateSchedule } from "@/hooks";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useEffect, useState } from "react";
import { useUpdateShop } from "@/hooks/useShops";
import { timeApiService } from "@/services/timeApi";

/**
 * Horários de Funcionamento do Shop - Configuração completa
 */
export default function SchedulesPage() {
  const { shopId, shop } = useShopAdmin();
  const { data: schedules = [], isLoading } = useShopSchedules(shopId);
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const updateShop = useUpdateShop();
  const [timezones, setTimezones] = useState<string[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");
  const [savingTimezone, setSavingTimezone] = useState(false);

  const [formData, setFormData] = useState<Record<Weekday, ScheduleFormData>>(() => {
    const initial: Record<string, ScheduleFormData> = {};
    const baseDate = new Date();
    WEEKDAYS.forEach((day) => {
      initial[day.key] = {
        isOpen: false,
        startTime: parse("08:00", "HH:mm", baseDate),
        endTime: parse("18:00", "HH:mm", baseDate),
        hasBreak: false,
        breakStartTime: parse("12:00", "HH:mm", baseDate),
        breakEndTime: parse("13:00", "HH:mm", baseDate),
      };
    });
    return initial as Record<Weekday, ScheduleFormData>;
  });

  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    let active = true;

    const loadTimezones = async () => {
      try {
        const [zones, ipZone] = await Promise.all([
          timeApiService.listTimezones(),
          timeApiService.detectTimezoneByIp().catch(() => null),
        ]);

        if (!active) return;
        setTimezones(zones);
        setSelectedTimezone(shop?.timeZone || ipZone || Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo");
      } catch {
        const fallbackZones = typeof Intl.supportedValuesOf === "function"
          ? Intl.supportedValuesOf("timeZone")
          : ["America/Sao_Paulo"];
        if (!active) return;
        setTimezones(fallbackZones);
        setSelectedTimezone(shop?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo");
      }
    };

    loadTimezones();
    return () => {
      active = false;
    };
  }, [shop?.timeZone]);

  // Carregar dados existentes
  useEffect(() => {
    if (schedules.length > 0) {
      const baseDate = new Date();
      
      setFormData((prev) => {
        const next = { ...prev };
        
        schedules.forEach((schedule) => {
          if (next[schedule.weekday]) {
            next[schedule.weekday] = {
              isOpen: schedule.isOpen === "ACTIVE",
              startTime: parse(schedule.startTime, "HH:mm", baseDate),
              endTime: parse(schedule.endTime, "HH:mm", baseDate),
              hasBreak: !!(schedule.breakStartTime && schedule.breakEndTime),
              breakStartTime: schedule.breakStartTime
                ? parse(schedule.breakStartTime, "HH:mm", baseDate)
                : parse("12:00", "HH:mm", baseDate),
              breakEndTime: schedule.breakEndTime
                ? parse(schedule.breakEndTime, "HH:mm", baseDate)
                : parse("13:00", "HH:mm", baseDate),
            };
          }
        });
        
        return next;
      });
    }
  }, [schedules]);

  const handleFieldChange = (
    day: Weekday,
    field: keyof ScheduleFormData,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      for (const day of WEEKDAYS) {
        const data = formData[day.key];
        const existingSchedule = schedules.find((s) => s.weekday === day.key);

        const payload = {
          weekday: day.key,
          isOpen: data.isOpen ? ("ACTIVE" as const) : ("INACTIVE" as const),
          startTime: data.startTime ? format(data.startTime, "HH:mm") : "08:00",
          endTime: data.endTime ? format(data.endTime, "HH:mm") : "18:00",
          breakStartTime:
            data.hasBreak && data.breakStartTime
              ? format(data.breakStartTime, "HH:mm")
              : undefined,
          breakEndTime:
            data.hasBreak && data.breakEndTime
              ? format(data.breakEndTime, "HH:mm")
              : undefined,
        };

        if (existingSchedule) {
          await updateSchedule.mutateAsync({
            id: existingSchedule.id,
            payload,
          });
        } else {
          const createPayload: CreateSchedulePayload = {
            ...payload,
            shopId,
          };
          await createSchedule.mutateAsync(createPayload);
        }
      }
      message.success("Horários salvos com sucesso!");
      setHasChanges(false);
    } catch {
      message.error("Erro ao salvar horários. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTimezone = async () => {
    if (!selectedTimezone) return;
    setSavingTimezone(true);
    try {
      await updateShop.mutateAsync({
        id: shopId,
        payload: { timeZone: selectedTimezone },
      });
      message.success("Timezone atualizado com sucesso!");
    } catch {
      message.error("Erro ao atualizar timezone.");
    } finally {
      setSavingTimezone(false);
    }
  };

  // Resumo dos horários
  const openDays = WEEKDAYS.filter((day) => formData[day.key].isOpen);
  const closedDays = WEEKDAYS.filter((day) => !formData[day.key].isOpen);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando horários..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <SchedulesHeader
        onSave={handleSaveAll}
        saving={saving}
        hasChanges={hasChanges}
      />

      <SchedulesSummary openDays={openDays} closedDays={closedDays} />

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Fuso Horário da Loja
        </h3>
        <div className="grid md:grid-cols-[1fr_auto] gap-3">
          <Select
            showSearch
            placeholder="Selecione o fuso horário"
            value={selectedTimezone || undefined}
            onChange={setSelectedTimezone}
            options={timezones.map((tz) => ({ value: tz, label: tz }))}
            optionFilterProp="label"
          />
          <Button type="primary" onClick={handleSaveTimezone} loading={savingTimezone}>
            Salvar
          </Button>
        </div>
      </div>

      {/* Configuração por dia */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Configuração Semanal
        </h3>
        <div className="space-y-3">
          {WEEKDAYS.map((day, index) => {
            const data = formData[day.key];
            const isWeekend = ["SATURDAY", "SUNDAY"].includes(day.key);

            return (
              <DayScheduleRow
                key={day.key}
                dayKey={day.key}
                dayLabel={day.label}
                data={data}
                onChange={handleFieldChange}
                isWeekend={isWeekend}
                isLast={index === WEEKDAYS.length - 1}
              />
            );
          })}
        </div>
      </div>

      <ScheduleAlert />
    </div>
  );
}
