"use client";

import React from "react";
import { Modal, Form, DatePicker, TimePicker, Button, Input, type FormInstance } from "antd";
import { StopOutlined, ClockCircleOutlined, CalendarOutlined, WarningOutlined } from "@ant-design/icons";
import { BlockedTime } from "@/types/blockedTime";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

const { TextArea } = Input;

interface BlockedTimeFormValues {
  type: "FULL_DAY" | "PARTIAL";
  date: Dayjs;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

interface BlockedTimeModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: BlockedTimeFormValues) => Promise<void>;
  editingBlockedTime: BlockedTime | null;
  isLoading: boolean;
  form: FormInstance<BlockedTimeFormValues>;
  blockType: "FULL_DAY" | "PARTIAL";
}

export const BlockedTimeModal: React.FC<BlockedTimeModalProps> = ({
  open,
  onCancel,
  onSubmit,
  editingBlockedTime,
  isLoading,
  form,
  blockType,
}) => {
  const currentType = Form.useWatch('type', form) || blockType;
  const startTime = Form.useWatch('startTime', form);
  const endTime = Form.useWatch('endTime', form);

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400">
            {editingBlockedTime ? <StopOutlined /> : <CalendarOutlined />}
          </div>
          <div className="flex flex-col">
            <span>{editingBlockedTime ? "Editar Bloqueio" : "Novo Bloqueio"}</span>
            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400 mt-0.5">
              Bloqueie datas ou horários específicos
            </span>
          </div>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
      width={480}
      className="[&_.ant-modal-content]:!bg-white dark:[&_.ant-modal-content]:!bg-zinc-900 [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-close]:!text-zinc-400 [&_.ant-modal-close:hover]:!text-zinc-600 dark:[&_.ant-modal-close:hover]:!text-zinc-200"
      styles={{
        body: { padding: '24px' }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        className="mt-6 flex flex-col gap-5"
        initialValues={{ type: "FULL_DAY" }}
      >
        {/* Type Selector */}
        <Form.Item
          name="type"
          className="!mb-0"
          rules={[{ required: true, message: "Selecione o tipo" }]}
        >
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => form.setFieldValue('type', 'FULL_DAY')}
              className={`
                flex items-center justify-center gap-2 h-12 rounded-xl font-medium text-sm transition-all duration-200 border
                ${currentType === 'FULL_DAY' 
                  ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-500/20' 
                  : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
                }
              `}
            >
              <StopOutlined />
              Dia Inteiro
            </button>
            <button
              type="button"
              onClick={() => form.setFieldValue('type', 'PARTIAL')}
              className={`
                flex items-center justify-center gap-2 h-12 rounded-xl font-medium text-sm transition-all duration-200 border
                ${currentType === 'PARTIAL' 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
                }
              `}
            >
              <ClockCircleOutlined />
              Horário Parcial
            </button>
          </div>
        </Form.Item>
        
        <div className="flex flex-col gap-4">
          <Form.Item
            name="date"
            label={<span className="text-zinc-700 dark:text-zinc-300 font-medium text-sm">Data do Bloqueio</span>}
            rules={[{ required: true, message: "Selecione a data" }]}
            className="!mb-0"
          >
            <DatePicker 
              className="w-full h-11 !bg-zinc-50 dark:!bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-600 rounded-xl"
              format="DD/MM/YYYY"
              placeholder="Selecione a data"
              suffixIcon={<CalendarOutlined className="text-zinc-400" />}
              popupClassName="dark:[&_.ant-picker-panel]:!bg-zinc-800 dark:[&_.ant-picker-header]:!text-zinc-200 dark:[&_.ant-picker-body]:!text-zinc-200 dark:[&_.ant-picker-content_th]:!text-zinc-400 dark:[&_.ant-picker-cell-inner]:!text-zinc-200 dark:[&_.ant-picker-cell-inner:hover]:!bg-zinc-700"
            />
          </Form.Item>

          {currentType === "PARTIAL" && (
            <div className="grid grid-cols-2 gap-3 animate-fade-in">
              <Form.Item
                name="startTime"
                label={<span className="text-zinc-700 dark:text-zinc-300 font-medium text-sm">Início</span>}
                rules={[{ required: currentType === "PARTIAL", message: "Obrigatório" }]}
                className="!mb-0"
              >
                <TimePicker
                  format="HH:mm"
                  placeholder="00:00"
                  className="w-full h-11 !bg-zinc-50 dark:!bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl"
                  popupClassName="dark:[&_.ant-picker-panel]:!bg-zinc-800 dark:[&_.ant-picker-time-panel-column]:!border-zinc-700 dark:[&_li]:!text-zinc-300 dark:[&_li:hover]:!bg-zinc-700"
                  value={startTime ? dayjs(startTime, "HH:mm") : null}
                  onChange={(time) => form.setFieldValue("startTime", time ? time.format("HH:mm") : null)}
                  minuteStep={15}
                  showNow={false}
                  suffixIcon={<ClockCircleOutlined className="text-zinc-400" />}
                />
              </Form.Item>
              <Form.Item
                name="endTime"
                label={<span className="text-zinc-700 dark:text-zinc-300 font-medium text-sm">Fim</span>}
                rules={[{ required: currentType === "PARTIAL", message: "Obrigatório" }]}
                className="!mb-0"
              >
                <TimePicker
                  format="HH:mm"
                  placeholder="00:00"
                  className="w-full h-11 !bg-zinc-50 dark:!bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl"
                  popupClassName="dark:[&_.ant-picker-panel]:!bg-zinc-800 dark:[&_.ant-picker-time-panel-column]:!border-zinc-700 dark:[&_li]:!text-zinc-300 dark:[&_li:hover]:!bg-zinc-700"
                  value={endTime ? dayjs(endTime, "HH:mm") : null}
                  onChange={(time) => form.setFieldValue("endTime", time ? time.format("HH:mm") : null)}
                  minuteStep={15}
                  showNow={false}
                  suffixIcon={<ClockCircleOutlined className="text-zinc-400" />}
                />
              </Form.Item>
            </div>
          )}

          <Form.Item
            name="reason"
            label={<span className="text-zinc-700 dark:text-zinc-300 font-medium text-sm flex items-center justify-between w-full">Motivo <span className="text-zinc-400 font-normal text-xs">(opcional)</span></span>}
            className="!mb-0"
          >
            <TextArea 
              placeholder="Ex: Feriado Nacional, Manutenção..." 
              rows={3}
              showCount
              maxLength={200}
              className="!bg-zinc-50 dark:!bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:!text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 rounded-xl resize-none !hover:border-zinc-300 !focus:border-zinc-400"
            />
          </Form.Item>
        </div>

        {/* Custom Alert */}
        <div className="flex gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
          <WarningOutlined className="text-amber-500 dark:text-amber-400 text-lg flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-700 dark:text-amber-300 text-sm font-semibold">
              Impacto no Agendamento
            </p>
            <p className="text-amber-600/90 dark:text-amber-400/80 text-xs mt-1 leading-relaxed">
              O período selecionado ficará indisponível para novos agendamentos na agenda online.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <Button 
            onClick={onCancel} 
            className="!h-11 !px-6 !rounded-xl !border-zinc-200 dark:!border-zinc-700 !text-zinc-600 dark:!text-zinc-300 hover:!text-zinc-900 dark:hover:!text-zinc-100 hover:!border-zinc-300 dark:hover:!border-zinc-600 !bg-white dark:!bg-zinc-800 !shadow-sm hover:!shadow"
          >
            Cancelar
          </Button>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={isLoading}
            className="!h-11 !px-6 !rounded-xl !bg-red-600 hover:!bg-red-500 !border-0 !text-white !shadow-lg !shadow-red-600/20 font-medium"
          >
            {editingBlockedTime ? "Salvar Alterações" : "Criar Bloqueio"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
