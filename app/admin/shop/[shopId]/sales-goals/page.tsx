"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Select,
  message,
  Progress,
  Popconfirm,
  Spin
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  RiseOutlined,
  TrophyOutlined,
  CalendarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { useShopSalesGoals, useCreateSalesGoal, useUpdateSalesGoal, useDeleteSalesGoal } from "@/hooks/useSalesGoals";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

import { SalesGoal, GoalPeriod } from "@/types/salesGoal";
import { formatCurrency } from "@/lib/security";

const { RangePicker } = DatePicker;

/**
 * Disable past dates (yesterday and before)
 * Only allow today or future dates for goal creation
 */
const disabledDate = (current: dayjs.Dayjs): boolean => {
  // Disable dates before today
  return current && current < dayjs().startOf('day');
};

/**
 * Theme-aware DatePicker popup styles
 */
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

/**
 * Styled metric card component
 */
interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  color: "indigo" | "emerald" | "amber" | "zinc";
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, subtitle, color }) => {
  const colorClasses = {
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/30",
    emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30",
    zinc: "bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
  };

  const iconBgClasses = {
    indigo: "bg-indigo-100 dark:bg-indigo-800/30",
    emerald: "bg-emerald-100 dark:bg-emerald-800/30",
    amber: "bg-amber-100 dark:bg-amber-800/30",
    zinc: "bg-zinc-200 dark:bg-zinc-700",
  };

  return (
    <div className={`${colorClasses[color]} border rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`${iconBgClasses[color]} p-2.5 rounded-xl`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
      </div>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      {subtitle && (
        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
};

/**
 * Goal card with progress visualization
 */
interface GoalCardProps {
  goal: SalesGoal;
  onEdit: (goal: SalesGoal) => void;
  onDelete: (id: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  const now = dayjs();
  const start = dayjs(goal.startDate);
  const end = dayjs(goal.endDate);
  const isActive = now.isAfter(start) && now.isBefore(end);
  const isPast = now.isAfter(end);

  // Use real sales data from backend
  const targetAmount = parseFloat(String(goal.amount));
  const currentAmount = goal.currentSales ? Number(goal.currentSales) : 0;
  
  // Calculate progress percentage
  const rawPercent = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
  const progressPercent = Math.min(Math.round(rawPercent), 100);

  const getStatusConfig = () => {
    if (isActive) return {
      label: "Em Andamento",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      icon: <ClockCircleOutlined />
    };
    if (isPast) return {
      label: "Finalizada",
      color: "text-zinc-500 dark:text-zinc-400",
      bg: "bg-zinc-100 dark:bg-zinc-800",
      icon: <CheckCircleOutlined />
    };
    return {
      label: "Futura",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/30",
      icon: <CalendarOutlined />
    };
  };

  const status = getStatusConfig();

  return (
    <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 ${isPast ? 'opacity-70' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
            <TrophyOutlined className={`text-xl ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
          </div>
          <div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
              {status.icon}
              {status.label}
            </span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {goal.period === 'MONTHLY' ? 'Meta Mensal' : goal.period === 'WEEKLY' ? 'Meta Semanal' : 'Meta Personalizada'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(goal)}
            className="text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400"
            size="small"
          />
          <Popconfirm
            title="Excluir meta"
            description="Tem certeza que deseja excluir esta meta?"
            onConfirm={() => onDelete(goal.id)}
            okText="Sim"
            cancelText="Não"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400"
              size="small"
            />
          </Popconfirm>
        </div>
      </div>

      {/* Goal Amount - Hero Typography */}
      <div className="mb-4">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-medium mb-1">
          Meta de Faturamento
        </p>
        <div className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          {formatCurrency(goal.amount)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Progresso
          </span>
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
            {progressPercent}%
          </span>
        </div>
        <Progress
          percent={progressPercent}
          showInfo={false}
          strokeColor={{
            '0%': '#6366f1',
            '100%': '#8b5cf6',
          }}
          trailColor={isPast ? '#d4d4d8' : '#e4e4e7'}
          className="[&_.ant-progress-inner]:!bg-zinc-200 dark:[&_.ant-progress-inner]:!bg-zinc-700"
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Atual: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(currentAmount)}</span>
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Faltam: <span className="font-semibold">{formatCurrency(parseFloat(String(goal.amount)) - currentAmount)}</span>
          </span>
        </div>
      </div>

      {/* Period */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <CalendarOutlined />
          <span>
            {start.format("DD/MM/YYYY")} — {end.format("DD/MM/YYYY")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function SalesGoalsPage() {
  const { shopId } = useShopAdmin();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SalesGoal | null>(null);
  const [form] = Form.useForm();
  
  // Watch the period to conditionally render date picker
  const selectedPeriod = Form.useWatch('period', form);

  const { data: salesGoalsData, isLoading } = useShopSalesGoals(shopId);
  // Hook now ensures data is an array or defaults to empty
  const salesGoals = useMemo(() => salesGoalsData || [], [salesGoalsData]);

  const createGoal = useCreateSalesGoal();
  const updateGoal = useUpdateSalesGoal();
  const deleteGoal = useDeleteSalesGoal();

  // Reset form when modal closes or opens fresh
  useEffect(() => {
    if (!isModalVisible) {
        // Optional: clear any other temporary state if needed
    }
  }, [isModalVisible]);

  // Calculate stats
  const stats = useMemo(() => {
    const now = dayjs();
    const activeGoals = salesGoals.filter(g => now.isAfter(g.startDate) && now.isBefore(g.endDate));
    const totalTarget = activeGoals.reduce((sum, g) => sum + parseFloat(String(g.amount)), 0);
    const futureGoals = salesGoals.filter(g => now.isBefore(g.startDate)).length;
    const completedGoals = salesGoals.filter(g => now.isAfter(g.endDate)).length;

    return {
      total: salesGoals.length,
      active: activeGoals.length,
      future: futureGoals,
      completed: completedGoals,
      totalTarget,
    };
  }, [salesGoals]);

  const handleEdit = (goal: SalesGoal) => {
    setEditingGoal(goal);
    
    // Determine how to display the date based on period
    let dateValue;
    if (goal.period === 'CUSTOM') {
        dateValue = [dayjs(goal.startDate), dayjs(goal.endDate)];
    } else {
        // For MONTHLY or WEEKLY, we can use the startDate to populate the picker
        dateValue = dayjs(goal.startDate);
    }

    form.setFieldsValue({
      amount: goal.amount,
      period: goal.period,
      dates: dateValue,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGoal.mutateAsync(id);
      message.success("Meta removida com sucesso");
    } catch {
      message.error("Erro ao remover meta");
    }
  };

  interface SalesGoalFormValues {
    amount: number | string;
    period: GoalPeriod;
    dates: dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs];
  }

  const handleFinish = async (values: SalesGoalFormValues) => {
    try {
      // 1. Sanitization to ensure amount is a clean number
      let sanitizedAmount = 0;
      if (typeof values.amount === 'string') {
        const cleaned = (values.amount as string).replace(/R\$\s?|(\.*)/g, "").replace(",", ".");
        sanitizedAmount = parseFloat(cleaned);
      } else {
        sanitizedAmount = Number(values.amount);
      }
      if (isNaN(sanitizedAmount)) sanitizedAmount = 0;

      // 2. Strict Date Logic Calculation
      let startDateStr = "";
      let endDateStr = "";

      if (values.period === 'MONTHLY') {
          // values.dates should be a single Dayjs object representing the month
          const date = values.dates as dayjs.Dayjs;
          startDateStr = date.startOf('month').toISOString();
          endDateStr = date.endOf('month').toISOString();
      } else if (values.period === 'WEEKLY') {
          // values.dates should be a single Dayjs object representing the week
          const date = values.dates as dayjs.Dayjs;
          startDateStr = date.startOf('week').toISOString();
          endDateStr = date.endOf('week').toISOString();
      } else {
          // CUSTOM: values.dates should be an array [start, end]
          const dates = values.dates as [dayjs.Dayjs, dayjs.Dayjs];
          startDateStr = dates[0].startOf('day').toISOString();
          endDateStr = dates[1].endOf('day').toISOString();
      }

      // 3. Conflict Prevention (Client-side check)
      const newStart = dayjs(startDateStr);
      const newEnd = dayjs(endDateStr);

      const hasConflict = salesGoals.some(goal => {
          // Skip the current goal if we are editing
          if (editingGoal && goal.id === editingGoal.id) return false;

          const existingStart = dayjs(goal.startDate);
          const existingEnd = dayjs(goal.endDate);

          // Check for overlap
          return (
              newStart.isBetween(existingStart, existingEnd, null, '[]') ||
              newEnd.isBetween(existingStart, existingEnd, null, '[]') ||
              existingStart.isBetween(newStart, newEnd, null, '[]')
          );
      });

      if (hasConflict) {
          message.error("Já existe uma meta definida para este período (ou parte dele). Ajuste as datas ou edite a meta existente.");
          return;
      }

      const payload = {
        amount: sanitizedAmount,
        period: values.period,
        startDate: startDateStr,
        endDate: endDateStr,
        shopId,
      };

      console.log("PAYLOAD DEBUG:", JSON.stringify(payload, null, 2));

      if (editingGoal) {
        await updateGoal.mutateAsync({ id: editingGoal.id, payload });
        message.success("Meta atualizada com sucesso");
      } else {
        await createGoal.mutateAsync(payload);
        message.success("Meta criada com sucesso");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingGoal(null);
    } catch (error) {
      console.group('Erro de Validação de Meta');
      console.error('Submission Error:', error);
      
      const apiError = error as { response?: { data?: unknown } };
      if (apiError.response?.data) {
        console.error('Response Data:', apiError.response.data);
      }
      
      console.groupEnd();
      message.error("Erro ao salvar meta");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando metas..." />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            Metas de Vendas
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Defina e acompanhe seus objetivos financeiros
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => {
            setEditingGoal(null);
            form.resetFields();
            form.setFieldsValue({
              period: 'MONTHLY',
              dates: dayjs() // Default to current month/date
            });
            setIsModalVisible(true);
          }}
          className="!bg-indigo-600 hover:!bg-indigo-500 !shadow-lg !shadow-indigo-600/20 !border-0 !h-11 !px-6 !rounded-xl"
        >
          Nova Meta
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<TrophyOutlined className="text-xl" />}
          label="Total de Metas"
          value={stats.total}
          subtitle="Todas as metas cadastradas"
          color="indigo"
        />
        <MetricCard
          icon={<RiseOutlined className="text-xl" />}
          label="Metas Ativas"
          value={stats.active}
          subtitle="Em andamento agora"
          color="emerald"
        />
        <MetricCard
          icon={<CalendarOutlined className="text-xl" />}
          label="Metas Futuras"
          value={stats.future}
          subtitle="Aguardando início"
          color="amber"
        />
        <MetricCard
          icon={<DollarOutlined className="text-xl" />}
          label="Meta Total Ativa"
          value={formatCurrency(stats.totalTarget)}
          subtitle="Soma das metas em andamento"
          color="zinc"
        />
      </div>

      {/* Goals Grid */}
      {salesGoals.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <TrophyOutlined className="text-3xl text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Nenhuma meta cadastrada
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
            Comece definindo suas metas de vendas para acompanhar o desempenho do seu negócio.
          </p>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              form.setFieldsValue({
                period: 'MONTHLY',
                dates: dayjs()
              });
              setIsModalVisible(true);
            }}
            className="!bg-indigo-600 hover:!bg-indigo-500"
          >
            Criar Primeira Meta
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {salesGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
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
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
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
                  // Reset dates when period changes to avoid incompatibility
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
                  // disabledDate={disabledDate} // Week picker disabledDate behaves slightly differently, can keep enabled or adjust logic
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
              onClick={() => setIsModalVisible(false)}
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
    </div>
  );
}
