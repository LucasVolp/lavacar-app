import React from "react";
import { Card, Avatar, Tag, Row, Col } from "antd";
import { UserOutlined, CarOutlined, PhoneOutlined } from "@ant-design/icons";
import { Appointment } from "@/types/appointment";

interface AppointmentClientVehicleProps {
  appointment: Appointment;
}

export const AppointmentClientVehicle: React.FC<AppointmentClientVehicleProps> = ({ appointment }) => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <Card title="Dados do Cliente" className="h-full shadow-sm border-slate-200 rounded-2xl" headStyle={{ borderBottom: '1px solid #f1f5f9' }}>
          <div className="flex items-start gap-4 pt-2">
            <Avatar size={56} icon={<UserOutlined />} className="bg-blue-50 text-blue-500" />
            <div>
              <h3 className="text-lg font-bold text-slate-800 m-0">
                {appointment.user ? `${appointment.user.firstName} ${appointment.user.lastName || ''}` : "Cliente Visitante"}
              </h3>
              {appointment.user?.phone && (
                <div className="flex items-center gap-2 text-slate-500 mt-2 text-sm bg-slate-50 px-2 py-1 rounded">
                  <PhoneOutlined /> {appointment.user.phone}
                </div>
              )}
              <div className="mt-4">
                <Tag className="rounded-full bg-slate-100 border-slate-200 text-slate-500">Cliente Recorrente</Tag>
              </div>
            </div>
          </div>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Dados do Veículo" className="h-full shadow-sm border-slate-200 rounded-2xl" headStyle={{ borderBottom: '1px solid #f1f5f9' }}>
          <div className="flex items-start gap-4 pt-2">
            <Avatar size={56} icon={<CarOutlined />} className="bg-purple-50 text-purple-500" />
            <div>
              {appointment.vehicle ? (
                <>
                  <h3 className="text-lg font-bold text-slate-800 m-0">
                    {appointment.vehicle.brand} {appointment.vehicle.model}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Tag color="purple" className="rounded-full border-0">{appointment.vehicle.plate || "SEM PLACA"}</Tag>
                    <Tag className="rounded-full bg-slate-100 border-slate-200 text-slate-500">{appointment.vehicle.color || "Cor não inf."}</Tag>
                  </div>
                </>
              ) : (
                <h3 className="text-lg font-bold text-slate-800 m-0">Veículo não identificado</h3>
              )}
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};
