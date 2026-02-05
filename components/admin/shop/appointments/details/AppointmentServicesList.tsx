import React from "react";
import { Card } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { AppointmentService } from "@/types/appointment";

interface AppointmentServicesListProps {
  services: AppointmentService[];
}

export const AppointmentServicesList: React.FC<AppointmentServicesListProps> = ({ services }) => {
  return (
    <Card title="Serviços Contratados" className="shadow-sm border-slate-200 rounded-2xl" headStyle={{ borderBottom: '1px solid #f1f5f9' }}>
      <div className="divide-y divide-slate-50">
        {services.map((service) => (
          <div key={service.id} className="py-5 flex justify-between items-center first:pt-2 last:pb-2 hover:bg-slate-50/50 transition-colors px-2 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                <CheckCircleOutlined />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base m-0">{service.serviceName}</h4>
                <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block">{service.duration} min</span>
              </div>
            </div>
            <span className="font-bold text-slate-700 text-lg">
              R$ {parseFloat(service.servicePrice).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
