"use client";

import React, { useState, useEffect } from "react";
import { 
  Card, 
  Typography, 
  Button, 
  Switch, 
  TimePicker, 
  message, 
  Row, 
  Col,
  Spin,
  Alert,
  Divider,
  Tag,
} from "antd";
import { 
  ClockCircleOutlined, 
  SaveOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { 
  useShopSchedules, 
  useCreateSchedule, 
  useUpdateSchedule,
} from "@/hooks/useSchedules";
import { CreateSchedulePayload } from "@/types/schedule";
import dayjs, { Dayjs } from "dayjs";

const { Title, Text } = Typography;

type Weekday = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

const WEEKDAYS: { key: Weekday; label: string; short: string }[] = [
  { key: "MONDAY", label: "Segunda-feira", short: "Seg" },
  { key: "TUESDAY", label: "Terça-feira", short: "Ter" },
  { key: "WEDNESDAY", label: "Quarta-feira", short: "Qua" },
  { key: "THURSDAY", label: "Quinta-feira", short: "Qui" },
  { key: "FRIDAY", label: "Sexta-feira", short: "Sex" },
  { key: "SATURDAY", label: "Sábado", short: "Sáb" },
  { key: "SUNDAY", label: "Domingo", short: "Dom" },
];

interface ScheduleFormData {
  isOpen: boolean;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  hasBreak: boolean;
  breakStartTime: Dayjs | null;
  breakEndTime: Dayjs | null;
}

/**
 * Horários de Funcionamento do Shop - Configuração completa
 */
export default function SchedulesPage() {
  const { shopId } = useShopAdmin();
  const { data: schedules = [], isLoading } = useShopSchedules(shopId);
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();

  const [formData, setFormData] = useState<Record<Weekday, ScheduleFormData>>(() => {
    const initial: Record<string, ScheduleFormData> = {};
    WEEKDAYS.forEach(day => {
      initial[day.key] = {
        isOpen: false,
        startTime: dayjs("08:00", "HH:mm"),
        endTime: dayjs("18:00", "HH:mm"),
        hasBreak: false,
        breakStartTime: dayjs("12:00", "HH:mm"),
        breakEndTime: dayjs("13:00", "HH:mm"),
      };
    });
    return initial as Record<Weekday, ScheduleFormData>;
  });

  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Carregar dados existentes
  useEffect(() => {
    if (schedules.length > 0) {
      const newFormData = { ...formData };
      schedules.forEach((schedule) => {
        newFormData[schedule.weekday] = {
          isOpen: schedule.isOpen === "ACTIVE",
          startTime: dayjs(schedule.startTime, "HH:mm"),
          endTime: dayjs(schedule.endTime, "HH:mm"),
          hasBreak: !!(schedule.breakStartTime && schedule.breakEndTime),
          breakStartTime: schedule.breakStartTime ? dayjs(schedule.breakStartTime, "HH:mm") : dayjs("12:00", "HH:mm"),
          breakEndTime: schedule.breakEndTime ? dayjs(schedule.breakEndTime, "HH:mm") : dayjs("13:00", "HH:mm"),
        };
      });
      setFormData(newFormData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedules]);

  const handleFieldChange = (day: Weekday, field: keyof ScheduleFormData, value: unknown) => {
    setFormData(prev => ({
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
        const existingSchedule = schedules.find(s => s.weekday === day.key);

        const payload = {
          weekday: day.key,
          isOpen: data.isOpen ? "ACTIVE" as const : "INACTIVE" as const,
          startTime: data.startTime?.format("HH:mm") || "08:00",
          endTime: data.endTime?.format("HH:mm") || "18:00",
          breakStartTime: data.hasBreak && data.breakStartTime ? data.breakStartTime.format("HH:mm") : undefined,
          breakEndTime: data.hasBreak && data.breakEndTime ? data.breakEndTime.format("HH:mm") : undefined,
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

  // Resumo dos horários
  const openDays = WEEKDAYS.filter(day => formData[day.key].isOpen);
  const closedDays = WEEKDAYS.filter(day => !formData[day.key].isOpen);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando horários..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={3} className="!mb-1 flex items-center gap-2">
            <ClockCircleOutlined className="text-blue-500" />
            Horários de Funcionamento
          </Title>
          <Text type="secondary">
            Configure os dias e horários que o estabelecimento atende
          </Text>
        </div>
        <Button 
          type="primary" 
          icon={<SaveOutlined />}
          size="large"
          onClick={handleSaveAll}
          loading={saving}
          disabled={!hasChanges}
        >
          Salvar Alterações
        </Button>
      </div>

      {hasChanges && (
        <Alert
          message="Você tem alterações não salvas"
          type="warning"
          showIcon
          closable
        />
      )}

      {/* Resumo */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card className="bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircleOutlined className="text-2xl text-green-500" />
              <div>
                <Text strong className="text-lg text-green-700">Dias Abertos</Text>
                <div className="text-green-600">
                  {openDays.length === 0 
                    ? "Nenhum dia configurado" 
                    : openDays.map(d => d.short).join(", ")
                  }
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className="bg-gray-50 border-gray-200">
            <div className="flex items-center gap-3">
              <CloseCircleOutlined className="text-2xl text-gray-400" />
              <div>
                <Text strong className="text-lg text-gray-600">Dias Fechados</Text>
                <div className="text-gray-500">
                  {closedDays.length === 0 
                    ? "Aberto todos os dias" 
                    : closedDays.map(d => d.short).join(", ")
                  }
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Configuração por dia */}
      <Card>
        <div className="space-y-4">
          {WEEKDAYS.map((day, index) => {
            const data = formData[day.key];
            const isWeekend = ["SATURDAY", "SUNDAY"].includes(day.key);
            
            return (
              <React.Fragment key={day.key}>
                <div 
                  className={`p-4 rounded-xl transition-all ${
                    data.isOpen 
                      ? "bg-blue-50 border border-blue-200" 
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <Row gutter={[16, 16]} align="middle">
                    {/* Dia da semana */}
                    <Col xs={24} sm={6}>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={data.isOpen}
                          onChange={(checked) => handleFieldChange(day.key, "isOpen", checked)}
                        />
                        <div>
                          <Text strong className={data.isOpen ? "text-blue-700" : "text-gray-500"}>
                            {day.label}
                          </Text>
                          {isWeekend && (
                            <Tag color="default" className="ml-2">Fim de semana</Tag>
                          )}
                        </div>
                      </div>
                    </Col>

                    {/* Horário de funcionamento */}
                    <Col xs={24} sm={8}>
                      <div className="flex items-center gap-2">
                        <ClockCircleOutlined className={data.isOpen ? "text-blue-500" : "text-gray-400"} />
                        <TimePicker
                          value={data.startTime}
                          onChange={(time) => handleFieldChange(day.key, "startTime", time)}
                          format="HH:mm"
                          disabled={!data.isOpen}
                          placeholder="Início"
                          className="w-24"
                        />
                        <span className="text-gray-400">às</span>
                        <TimePicker
                          value={data.endTime}
                          onChange={(time) => handleFieldChange(day.key, "endTime", time)}
                          format="HH:mm"
                          disabled={!data.isOpen}
                          placeholder="Fim"
                          className="w-24"
                        />
                      </div>
                    </Col>

                    {/* Intervalo/Pausa */}
                    <Col xs={24} sm={10}>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={data.hasBreak}
                          onChange={(checked) => handleFieldChange(day.key, "hasBreak", checked)}
                          disabled={!data.isOpen}
                          size="small"
                        />
                        <CoffeeOutlined className={data.hasBreak && data.isOpen ? "text-orange-500" : "text-gray-400"} />
                        <Text type="secondary" className="text-sm mr-2">Intervalo:</Text>
                        <TimePicker
                          value={data.breakStartTime}
                          onChange={(time) => handleFieldChange(day.key, "breakStartTime", time)}
                          format="HH:mm"
                          disabled={!data.isOpen || !data.hasBreak}
                          placeholder="Início"
                          className="w-20"
                          size="small"
                        />
                        <span className="text-gray-400 text-sm">-</span>
                        <TimePicker
                          value={data.breakEndTime}
                          onChange={(time) => handleFieldChange(day.key, "breakEndTime", time)}
                          format="HH:mm"
                          disabled={!data.isOpen || !data.hasBreak}
                          placeholder="Fim"
                          className="w-20"
                          size="small"
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
                {index < WEEKDAYS.length - 1 && <Divider className="my-2" />}
              </React.Fragment>
            );
          })}
        </div>
      </Card>

      {/* Dica */}
      <Alert
        message="Dica"
        description="Os horários configurados serão usados para calcular os slots disponíveis para agendamento. 
        Configure intervalos para pausas como almoço ou descanso."
        type="info"
        showIcon
      />
    </div>
  );
}
