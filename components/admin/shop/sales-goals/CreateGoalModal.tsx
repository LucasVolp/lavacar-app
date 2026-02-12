import React, { useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Select,
  message,
} from "antd";
import { RiseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { SalesGoal, GoalPeriod, CreateSalesGoalPayload, UpdateSalesGoalPayload } from "@/types/salesGoal";
import { UseMutationResult } from "@tanstack/react-query";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

/**
 * Disable past dates (yesterday and before)
 * Only allow today or future dates for goal creation
 */
const disabledDate = (current: dayjs.Dayjs): boolean => {
  return current && current < dayjs().startOf('day');
};

const datePickerPopupClassName = `
  [&_.ant-picker-panel-container]:!bg-white
  dark:[&_.ant-picker-panel-container]:!bg-zinc-800
  [&_.ant-picker-header]:!border-zinc-200
  dark:[&_.ant-picker-header]:!border-zinc-700
  [&_.ant-picker-header]:!text-zinc-800
  dark:[&_.ant-picker-header]:!text-zinc-200
  [&_.ant-picker-header_button]:!text-zinc-500
  dark:[&_.ant-picker-header_button]:!text-zinc-400
  [&_.ant-picker-header_button:hover]:!text-zinc-800
  dark:[&_.ant-picker-header_button:hover]:!text-zinc-200
  [&_.ant-picker-content_th]:!text-zinc-500
  dark:[&_.ant-picker-content_th]:!text-zinc-400
  [&_.ant-picker-cell]:!text-zinc-700
  dark:[&_.ant-picker-cell]:!text-zinc-300
  [&_.ant-picker-cell-disabled]:!text-zinc-300
  dark:[&_.ant-picker-cell-disabled]:!text-zinc-600
  [&_.ant-picker-cell-disabled_.ant-picker-cell-inner]:!bg-transparent
  [&_.ant-picker-cell:hover_.ant-picker-cell-inner]:!bg-zinc-100
  dark:[&_.ant-picker-cell:hover_.ant-picker-cell-inner]:!bg-zinc-700
  [&_.ant-picker-cell-in-view.ant-picker-cell-selected_.ant-picker-cell-inner]:!bg-indigo-500
  [&_.ant-picker-cell-in-view.ant-picker-cell-range-start_.ant-picker-cell-inner]:!bg-indigo-500
  [&_.ant-picker-cell-in-view.ant-picker-cell-range-end_.ant-picker-cell-inner]:!bg-indigo-500
  [&_.ant-picker-cell-in-view.ant-picker-cell-in-range]:!bg-indigo-50
  dark:[&_.ant-picker-cell-in-view.ant-picker-cell-in-range]:!bg-indigo-900/30
  [&_.ant-picker-cell-in-view.ant-picker-cell-in-range::before]:!bg-indigo-50
  dark:[&_.ant-picker-cell-in-view.ant-picker-cell-in-range::before]:!bg-indigo-900/30
  [&_.ant-picker-cell-today_.ant-picker-cell-inner::before]:!border-indigo-500
  [&_.ant-picker-footer]:!border-zinc-200
  dark:[&_.ant-picker-footer]:!border-zinc-700
  [&_.ant-picker-footer]:!bg-zinc-50
  dark:[&_.ant-picker-footer]:!bg-zinc-800
  [&_.ant-picker-today-btn]:!text-indigo-500
  [&_.ant-picker-preset]:!border-zinc-200
  dark:[&_.ant-picker-preset]:!border-zinc-700
  [&_.ant-picker-preset>span]:!text-zinc-600
  dark:[&_.ant-picker-preset>span]:!text-zinc-400
`;

interface SalesGoalFormValues {
  amount: number | string;
  period: GoalPeriod;
  dates: dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs];
}

interface CreateGoalModalProps {
  open: boolean;
  onCancel: () => void;
  editingGoal: SalesGoal | null;
  shopId: string;
  salesGoals: SalesGoal[];
  createGoal: UseMutationResult<SalesGoal, unknown, CreateSalesGoalPayload, unknown>;
  updateGoal: UseMutationResult<SalesGoal, unknown, { id: string; payload: UpdateSalesGoalPayload }, unknown>;
}

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  open,
  onCancel,
  editingGoal,
  shopId,
  salesGoals,
  createGoal,
  updateGoal,
}) => {
  const [form] = Form.useForm();
  const selectedPeriod = Form.useWatch('period', form);

  useEffect(() => {
    if (open) {
      if (editingGoal) {
        let dateValue;
        if (editingGoal.period === 'CUSTOM') {
          dateValue = [dayjs(editingGoal.startDate), dayjs(editingGoal.endDate)];
        } else {
          dateValue = dayjs(editingGoal.startDate);
        }

        form.setFieldsValue({
          amount: editingGoal.amount,
          period: editingGoal.period,
          dates: dateValue,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          period: 'MONTHLY',
          dates: dayjs()
        });
      }
    }
  }, [open, editingGoal, form]);

  const handleFinish = async (values: SalesGoalFormValues) => {
    try {
      // 1. Sanitization
      let sanitizedAmount = 0;
      if (typeof values.amount === 'string') {
        const cleaned = (values.amount as string).replace(/R\$\s?|(\.*)/g, "").replace(",", ".");
        sanitizedAmount = parseFloat(cleaned);
      } else {
        sanitizedAmount = Number(values.amount);
      }
      if (isNaN(sanitizedAmount)) sanitizedAmount = 0;

      // 2. Strict Date Logic
      let startDateStr = "";
      let endDateStr = "";

      if (values.period === 'MONTHLY') {
        const date = values.dates as dayjs.Dayjs;
        startDateStr = date.startOf('month').toISOString();
        endDateStr = date.endOf('month').toISOString();
      } else if (values.period === 'WEEKLY') {
        const date = values.dates as dayjs.Dayjs;
        startDateStr = date.startOf('week').toISOString();
        endDateStr = date.endOf('week').toISOString();
      } else {
        const dates = values.dates as [dayjs.Dayjs, dayjs.Dayjs];
        startDateStr = dates[0].startOf('day').toISOString();
        endDateStr = dates[1].endOf('day').toISOString();
      }

      // 3. Conflict Prevention (Client-side)
      const newStart = dayjs(startDateStr);
      const newEnd = dayjs(endDateStr);

      const hasConflict = salesGoals.some(goal => {
        // Skip current goal if editing
        if (editingGoal && goal.id === editingGoal.id) return false;

        // Skip COMPLETED goals from conflict check
        // If a goal is already met, we allow creating a new one overlapping (or after) it
        const currentSales = Number(goal.currentSales || 0);
        const targetAmount = Number(goal.amount);
        if (currentSales >= targetAmount) {
             return false;
        }

        const existingStart = dayjs(goal.startDate);
        const existingEnd = dayjs(goal.endDate);

        // Check for overlap with INCOMPLETE goals
        return (
          newStart.isBetween(existingStart, existingEnd, null, '[]') ||
          newEnd.isBetween(existingStart, existingEnd, null, '[]') ||
          existingStart.isBetween(newStart, newEnd, null, '[]')
        );
      });

      if (hasConflict) {
        message.error("Já existe uma meta em andamento para este período. Complete-a antes de criar uma nova.");
        return;
      }

      const payload = {
        amount: sanitizedAmount,
        period: values.period,
        startDate: startDateStr,
        endDate: endDateStr,
        shopId,
      };

      if (editingGoal) {
        await updateGoal.mutateAsync({ id: editingGoal.id, payload });
        message.success("Meta atualizada com sucesso");
      } else {
        await createGoal.mutateAsync(payload);
        message.success("Meta criada com sucesso");
      }
      onCancel();
    } catch (error) {
      console.error('Submission Error:', error);
      message.error("Erro ao salvar meta");
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            <RiseOutlined className="text-xl" />
          </div>
          <div>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {editingGoal ? "Editar Meta" : "Nova Meta de Vendas"}
            </span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Defina o valor e o período da meta
            </p>
          </div>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
      width={480}
      className={`
        [&_.ant-modal-content]:!bg-white
        dark:[&_.ant-modal-content]:!bg-zinc-900
        [&_.ant-modal-header]:!bg-transparent
        [&_.ant-modal-close]:!text-zinc-400
        dark:[&_.ant-modal-close]:!text-zinc-500
        [&_.ant-modal-close:hover]:!text-zinc-600
        dark:[&_.ant-modal-close:hover]:!text-zinc-300
        [&_.ant-input-number]:!bg-white
        dark:[&_.ant-input-number]:!bg-zinc-800
        [&_.ant-input-number]:!border-zinc-200
        dark:[&_.ant-input-number]:!border-zinc-700
        [&_.ant-input-number-input]:!text-zinc-800
        dark:[&_.ant-input-number-input]:!text-zinc-200
        [&_.ant-select-selector]:!bg-white
        dark:[&_.ant-select-selector]:!bg-zinc-800
        [&_.ant-select-selector]:!border-zinc-200
        dark:[&_.ant-select-selector]:!border-zinc-700
        [&_.ant-select-selection-item]:!text-zinc-800
        dark:[&_.ant-select-selection-item]:!text-zinc-200
        [&_.ant-picker]:!bg-white
        dark:[&_.ant-picker]:!bg-zinc-800
        [&_.ant-picker]:!border-zinc-200
        dark:[&_.ant-picker]:!border-zinc-700
      `}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-6">
        <Form.Item
          name="amount"
          label={<span className="text-zinc-700 dark:text-zinc-300 font-medium">Valor da Meta (R$)</span>}
          rules={[{ required: true, message: "Informe o valor" }]}
        >
          <InputNumber<number>
            style={{ width: "100%" }}
            formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            parser={(value) => {
              const parsed = value?.replace(/R\$\s?|(\.*)/g, "").replace(",", ".");
              return parsed ? Number(parsed) : 0;
            }}
            size="large"
            className="!rounded-xl"
            min={0}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="period"
            label={<span className="text-zinc-700 dark:text-zinc-300 font-medium">Tipo</span>}
            rules={[{ required: true }]}
          >
            <Select 
              size="large" 
              className="[&_.ant-select-selector]:!rounded-xl"
              onChange={() => {
                form.setFieldsValue({ dates: null });
              }}
            >
              <Select.Option value="MONTHLY">Mensal</Select.Option>
              <Select.Option value="WEEKLY">Semanal</Select.Option>
              <Select.Option value="CUSTOM">Personalizado</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dates"
            label={<span className="text-zinc-700 dark:text-zinc-300 font-medium">Período</span>}
            rules={[{ required: true, message: "Selecione o período" }]}
          >
            {selectedPeriod === 'CUSTOM' ? (
              <RangePicker
                size="large"
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
                className="[&]:!rounded-xl [&_.ant-picker-input>input]:!text-zinc-800 dark:[&_.ant-picker-input>input]:!text-zinc-200"
                disabledDate={disabledDate}
                popupClassName={datePickerPopupClassName}
              />
            ) : selectedPeriod === 'WEEKLY' ? (
              <DatePicker
                picker="week"
                size="large"
                format="wo [Semana]"
                style={{ width: '100%' }}
                className="[&]:!rounded-xl [&_.ant-picker-input>input]:!text-zinc-800 dark:[&_.ant-picker-input>input]:!text-zinc-200"
                popupClassName={datePickerPopupClassName}
                placeholder="Selecione a Semana"
              />
            ) : (
              <DatePicker
                picker="month"
                size="large"
                format="MMMM YYYY"
                style={{ width: '100%' }}
                className="[&]:!rounded-xl [&_.ant-picker-input>input]:!text-zinc-800 dark:[&_.ant-picker-input>input]:!text-zinc-200"
                disabledDate={disabledDate}
                popupClassName={datePickerPopupClassName}
                placeholder="Selecione o Mês"
              />
            )}
          </Form.Item>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <Button
            onClick={onCancel}
            className="!h-11 !px-6 !rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={createGoal.isPending || updateGoal.isPending}
            className="!bg-indigo-600 hover:!bg-indigo-500 !h-11 !px-6 !rounded-xl !border-0"
          >
            {editingGoal ? "Salvar Alterações" : "Criar Meta"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
