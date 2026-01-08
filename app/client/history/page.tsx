"use client";

import React from "react";
import { Spin, Empty, Card, Badge, Button } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/hooks/useAppointments";
import dayjs from "dayjs";
import { Appointment } from "@/types/appointment";

export default function HistoryPage() {
  const { user } = useAuth();
  const { data: appointments = [], isLoading } = useAppointments(
    { userId: user?.id, status: 'COMPLETED' },
    !!user?.id
  );

  // Filter mainly on client side if API doesn't support multiple status strictly
  // Note: hooks/types define status as single string, but here we want history (COMPLETED, CANCELED)
  const historyAppointments = appointments
    .filter(a => ['COMPLETED', 'CANCELED'].includes(a.status))
    .sort((a, b) => dayjs(b.scheduledAt).valueOf() - dayjs(a.scheduledAt).valueOf());

  if (isLoading) {
    return <div className="p-12 text-center"><Spin size="large" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
            <CalendarOutlined className="text-slate-500 text-xl" />
        </div>
        <div>
           <h1 className="text-2xl font-bold">Histórico</h1>
           <p className="text-slate-500">Seus serviços anteriores</p>
        </div>
      </div>

      {historyAppointments.length === 0 ? (
         <Empty description="Nenhum histórico encontrado" />
      ) : (
         <div className="space-y-4">
            {historyAppointments.map(app => (
                <HistoryItem key={app.id} appointment={app} />
            ))}
         </div>
      )}
    </div>
  );
}

function HistoryItem({ appointment }: { appointment: Appointment }) {
    const isCompleted = appointment.status === 'COMPLETED';
    
    // Todo: Check if evaluated. For now, we assume if it's completed, we can evaluate if not done.
    // Since we don't have isEvaluated in Appointment type, we might need a separate check or assume UI logic.
    // For this task, I will add a placeholder "Avaliar" button if completed.
    
    return (
        <Card className="overflow-hidden border-slate-200 dark:border-[#27272a]">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div>
                   <div className="flex items-center gap-2 mb-2">
                      <Badge status={isCompleted ? 'success' : 'error'} text={isCompleted ? 'Concluído' : 'Cancelado'} />
                      <span className="text-slate-400 text-sm">{dayjs(appointment.scheduledAt).format('DD/MM/YYYY HH:mm')}</span>
                   </div>
                   <h3 className="font-bold text-lg">{appointment.shop?.name}</h3>
                   <p className="text-slate-500">{appointment.services.map((s) => s.serviceName).join(', ')}</p>
                   {appointment.vehicle && (
                     <p className="font-medium mt-1">{appointment.vehicle.brand} {appointment.vehicle.model} - {appointment.vehicle.plate}</p>
                   )}
                </div>
                
                <div className="flex flex-col items-end justify-center gap-2">
                    <span className="font-bold text-lg">R$ {parseFloat(appointment.totalPrice).toFixed(2)}</span>
                    {isCompleted && (
                        <Button type="default" size="small">Avaliar Serviço</Button>
                    )}
                </div>
            </div>
        </Card>
    )
}
