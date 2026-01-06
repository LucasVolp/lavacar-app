"use client";

import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Switch,
  Button,
  Space,
} from "antd";
import dayjs from "dayjs";
import type { BlockedTime } from "./BlockedTimeCard";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface BlockedTimeFormModalProps {
  open: boolean;
  blockedTime?: BlockedTime | null;
  onSubmit: (values: Omit<BlockedTime, "id">) => void;
  onCancel: () => void;
  loading?: boolean;
}

const typeOptions = [
  { value: "holiday", label: "Feriado" },
  { value: "maintenance", label: "Manutenção" },
  { value: "personal", label: "Pessoal" },
  { value: "other", label: "Outro" },
];

export const BlockedTimeFormModal: React.FC<BlockedTimeFormModalProps> = ({
  open,
  blockedTime,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const isEditing = !!blockedTime;
  const isFullDay = Form.useWatch("isFullDay", form);

  useEffect(() => {
    if (open && blockedTime) {
      form.setFieldsValue({
        ...blockedTime,
        dateRange: [dayjs(blockedTime.startDate, "DD/MM/YYYY"), dayjs(blockedTime.endDate, "DD/MM/YYYY")],
        timeRange: blockedTime.startTime && blockedTime.endTime
          ? [dayjs(blockedTime.startTime, "HH:mm"), dayjs(blockedTime.endTime, "HH:mm")]
          : undefined,
      });
    } else if (open) {
      form.resetFields();
      form.setFieldsValue({ isFullDay: true, type: "other" });
    }
  }, [open, blockedTime, form]);

  const handleFinish = (values: Record<string, unknown>) => {
    const [startDate, endDate] = (values.dateRange as dayjs.Dayjs[]) || [];
    const [startTime, endTime] = (values.timeRange as dayjs.Dayjs[]) || [];

    const data: Omit<BlockedTime, "id"> = {
      title: values.title as string,
      reason: values.reason as string,
      type: values.type as BlockedTime["type"],
      isFullDay: values.isFullDay as boolean,
      startDate: startDate?.format("DD/MM/YYYY") || "",
      endDate: endDate?.format("DD/MM/YYYY") || "",
      startTime: startTime?.format("HH:mm"),
      endTime: endTime?.format("HH:mm"),
    };

    onSubmit(data);
  };

  return (
    <Modal
      title={isEditing ? "Editar Bloqueio" : "Novo Bloqueio"}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="pt-4"
      >
        <Form.Item
          name="title"
          label="Título"
          rules={[{ required: true, message: "Informe o título" }]}
        >
          <Input placeholder="Ex: Feriado Nacional, Manutenção..." />
        </Form.Item>

        <Form.Item name="reason" label="Motivo">
          <TextArea rows={2} placeholder="Descreva o motivo do bloqueio..." />
        </Form.Item>

        <Form.Item name="type" label="Tipo" rules={[{ required: true }]}>
          <Select options={typeOptions} placeholder="Selecione o tipo" />
        </Form.Item>

        <Form.Item
          name="dateRange"
          label="Período"
          rules={[{ required: true, message: "Selecione o período" }]}
        >
          <RangePicker
            format="DD/MM/YYYY"
            className="w-full"
            placeholder={["Data início", "Data fim"]}
          />
        </Form.Item>

        <Form.Item name="isFullDay" label="Dia inteiro" valuePropName="checked">
          <Switch />
        </Form.Item>

        {!isFullDay && (
          <Form.Item
            name="timeRange"
            label="Horário"
            rules={[{ required: !isFullDay, message: "Selecione o horário" }]}
          >
            <TimePicker.RangePicker
              format="HH:mm"
              className="w-full"
              minuteStep={15}
              placeholder={["Início", "Fim"]}
            />
          </Form.Item>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-base-200">
          <Space>
            <Button onClick={onCancel}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? "Salvar Alterações" : "Criar Bloqueio"}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default BlockedTimeFormModal;
