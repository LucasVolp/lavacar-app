import React from "react";
import { Card, Typography, Divider, Button } from "antd";
import { CalendarOutlined, ClockCircleOutlined, StopOutlined, CheckCircleOutlined, PrinterOutlined } from "@ant-design/icons";
import { Appointment } from "@/types/appointment";
import dayjs from "dayjs";

const { Title } = Typography;

interface AppointmentFinancialSummaryProps {
  appointment: Appointment;
  onPrint: () => void;
}

export const AppointmentFinancialSummary: React.FC<AppointmentFinancialSummaryProps> = ({ appointment, onPrint }) => {
  return (
    <Card 
      className="shadow-md border-slate-200 bg-white rounded-2xl overflow-hidden h-full flex flex-col"
      styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column' } }}
    >
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
        <Title level={5} className="m-0 text-slate-700">Resumo do Agendamento</Title>
      </div>

      <div className="p-6 flex flex-col h-full">
        <div className="space-y-6 flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-500">
              <CalendarOutlined />
              <span>Data</span>
            </div>
            <span className="font-bold text-slate-800">{dayjs(appointment.scheduledAt).format("DD/MM/YYYY")}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-500">
              <ClockCircleOutlined />
              <span>Horário</span>
            </div>
            <span className="font-bold text-slate-800">{dayjs(appointment.scheduledAt).format("HH:mm")}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-500">
              <StopOutlined rotate={45} />
              <span>Término Previsto</span>
            </div>
            <span className="font-bold text-slate-800">{dayjs(appointment.endTime).format("HH:mm")}</span>
          </div>

          <Divider className="my-2 border-slate-100" />

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Duração Total</span>
            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md">{appointment.totalDuration} min</span>
          </div>

          <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 mt-4 text-center">
            <div className="text-emerald-600 text-xs uppercase font-bold tracking-wider mb-1">Valor Total</div>
            <div className="text-4xl font-bold text-emerald-700">
              R$ {parseFloat(appointment.totalPrice).toFixed(2)}
            </div>
            <div className="text-xs text-emerald-600 mt-2 flex items-center justify-center gap-1 font-medium bg-white/50 py-1 rounded-full w-fit mx-auto px-3">
              <CheckCircleOutlined /> Pagamento pendente
            </div>
          </div>
        </div>

        <Button block size="large" icon={<PrinterOutlined />} onClick={onPrint} className="h-12 rounded-xl font-medium border-slate-300 mt-6">
          Imprimir Recibo
        </Button>
      </div>
    </Card>
  );
};
