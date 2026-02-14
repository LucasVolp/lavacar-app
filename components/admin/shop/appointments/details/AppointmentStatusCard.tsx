import React from "react";
import { Card, Steps, Button } from "antd";
import { 
  CheckCircleOutlined, 
  EnvironmentOutlined, 
  CloseCircleOutlined, 
  PlayCircleOutlined
} from "@ant-design/icons";
import { Appointment } from "@/types/appointment";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface AppointmentStatusCardProps {
  appointment: Appointment;
  onNextStatus: (status: string) => void;
  loading?: boolean;
}

const statusConfig: Record<string, { stepIndex: number }> = {
  PENDING: { stepIndex: 0 },
  CONFIRMED: { stepIndex: 1 },
  WAITING: { stepIndex: 2 },
  IN_PROGRESS: { stepIndex: 3 },
  COMPLETED: { stepIndex: 4 },
  CANCELED: { stepIndex: -1 },
  NO_SHOW: { stepIndex: -1 },
};

export const AppointmentStatusCard: React.FC<AppointmentStatusCardProps> = ({ 
  appointment, 
  onNextStatus, 
  loading 
}) => {
  const currentStatus = statusConfig[appointment.status] || statusConfig.PENDING;
  const isCanceled = ["CANCELED", "NO_SHOW"].includes(appointment.status);

  // Logic for the single dynamic button
  const getNextAction = () => {
    switch (appointment.status) {
      case "PENDING":
        return { label: "Confirmar Agendamento", icon: <CheckCircleOutlined />, type: "primary" as const, targetStatus: "CONFIRMED" };
      case "CONFIRMED":
        return { label: "Cliente Chegou", icon: <EnvironmentOutlined />, type: "default" as const, targetStatus: "WAITING" };
      case "WAITING":
        return { label: "Iniciar Serviço", icon: <PlayCircleOutlined />, type: "primary" as const, targetStatus: "IN_PROGRESS" };
      case "IN_PROGRESS":
        return { label: "Finalizar Serviço", icon: <CheckCircleOutlined />, type: "primary" as const, targetStatus: "COMPLETED" };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <div className="space-y-8">
      <Card className="shadow-sm border-slate-200 dark:border-zinc-800 rounded-2xl dark:bg-zinc-900" bordered={false}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Status Atual</span>
            <StatusBadge status={appointment.status} className="px-3 py-1.5 text-sm w-fit rounded-lg" />
          </div>
          
          {/* Dynamic Action Button */}
          {!isCanceled && nextAction && (
            <Button 
              type={nextAction.type} 
              icon={nextAction.icon} 
              size="large" 
              onClick={() => onNextStatus(nextAction.targetStatus)}
              loading={loading}
              className={nextAction.type === 'primary' ? "bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:text-black dark:hover:bg-slate-200 border-0" : "dark:bg-zinc-800 dark:text-slate-200 dark:border-zinc-700"}
            >
              {nextAction.label}
            </Button>
          )}
        </div>

        {!isCanceled ? (
          <Steps
            size="small"
            current={currentStatus.stepIndex}
            className="mb-4 dark:text-slate-400"
            items={[
              { title: "Pendente" },
              { title: "Confirmado" },
              { title: "No Local" },
              { title: "Em Execução" },
              { title: "Concluído" },
            ]}
          />
        ) : (
          <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30 flex gap-4">
            <CloseCircleOutlined className="text-2xl text-red-500 dark:text-red-400 mt-1" />
            <div>
              <h4 className="font-bold text-red-700 dark:text-red-400 m-0">Agendamento Cancelado</h4>
              {appointment.cancellationReason && (
                <p className="text-red-600 dark:text-red-300 m-0 mt-1 text-sm">
                  Motivo: {appointment.cancellationReason}
                </p>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
