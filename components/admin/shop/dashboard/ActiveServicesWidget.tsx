"use client";

import React from "react";
import { Card, Button, Tag } from "antd";
import { 
  CheckCircleOutlined, 
  UserOutlined, 
  CarOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { Appointment } from "@/types/appointment";
import dayjs from "dayjs";
import { formatVehiclePlate } from "@/utils/vehiclePlate";

interface ActiveServicesWidgetProps {
  appointments: Appointment[];
  onComplete: (id: string) => void;
  isLoading?: boolean;
}

export const ActiveServicesWidget: React.FC<ActiveServicesWidgetProps> = ({
  appointments,
  onComplete,
  isLoading
}) => {
  if (!appointments || appointments.length === 0) return null;

  return (
    <div className="space-y-4">
      <Card 
        className="border-indigo-100 dark:border-indigo-900/30 shadow-sm mb-6 overflow-hidden"
        title={
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <SyncOutlined spin />
            <span className="font-semibold">Serviços em Andamento ({appointments.length})</span>
          </div>
        }
        styles={{ body: { padding: '16px' } }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {appointments.map((apt) => (
            <div 
              key={apt.id} 
              className="flex flex-col justify-between p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10 transition-all hover:shadow-md"
            >
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm text-indigo-500">
                      <CarOutlined className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-800 dark:text-zinc-100 leading-tight m-0">
                        {apt.vehicle?.model || "Veículo"}
                      </h4>
                      <Tag className="m-0 mt-1 border-0 bg-white/60 dark:bg-zinc-800/50 text-zinc-500 font-mono text-xs px-1.5 rounded">
                        {formatVehiclePlate(apt.vehicle?.plate)}
                      </Tag>
                    </div>
                  </div>
                  <Tag color="processing" className="m-0 border-0 font-medium">
                    {dayjs(apt.scheduledAt).format("HH:mm")}
                  </Tag>
                </div>

                <div className="pl-1 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <UserOutlined className="text-xs" />
                    <span className="truncate max-w-[150px]">{apt.user?.firstName} {apt.user?.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                    <span className="truncate">{apt.services?.map(s => s.serviceName).join(", ")}</span>
                  </div>
                </div>
              </div>

              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => onComplete(apt.id)}
                loading={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 border-0 h-10 shadow-emerald-500/20 shadow-lg font-medium rounded-xl"
              >
                Concluir Serviço
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>

  );
};
