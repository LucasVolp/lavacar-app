"use client";

import React, { useState } from "react";
import { Card, message } from "antd";
import {
  AppointmentsHeader,
  AppointmentsTable,
  AppointmentsStats,
  type AppointmentRecord,
} from "@/components/owner/appointments";

// Mock data
const mockAppointments: AppointmentRecord[] = [
  {
    id: "1",
    customer: "João Silva",
    customerPhone: "(11) 99999-1234",
    vehicle: "Fiat Uno",
    vehiclePlate: "ABC-1234",
    service: "Lavagem Completa",
    date: "01/01/2026",
    time: "14:30",
    duration: 60,
    price: 80.0,
    status: "CONFIRMED",
  },
  {
    id: "2",
    customer: "Maria Santos",
    customerPhone: "(11) 98888-5678",
    vehicle: "VW Gol",
    vehiclePlate: "XYZ-5678",
    service: "Polimento",
    date: "01/01/2026",
    time: "15:00",
    duration: 120,
    price: 150.0,
    status: "PENDING",
  },
  {
    id: "3",
    customer: "Pedro Oliveira",
    customerPhone: "(11) 97777-9012",
    vehicle: "Honda Civic",
    vehiclePlate: "DEF-9012",
    service: "Lavagem Simples",
    date: "01/01/2026",
    time: "15:30",
    duration: 30,
    price: 40.0,
    status: "WAITING",
  },
  {
    id: "4",
    customer: "Ana Costa",
    customerPhone: "(11) 96666-3456",
    vehicle: "Toyota Corolla",
    vehiclePlate: "GHI-3456",
    service: "Lavagem Completa + Cera",
    date: "01/01/2026",
    time: "16:00",
    duration: 90,
    price: 120.0,
    status: "COMPLETED",
  },
  {
    id: "5",
    customer: "Carlos Lima",
    customerPhone: "(11) 95555-7890",
    vehicle: "Chevrolet Onix",
    vehiclePlate: "JKL-7890",
    service: "Lavagem Simples",
    date: "01/01/2026",
    time: "09:00",
    duration: 30,
    price: 40.0,
    status: "CANCELED",
  },
];

export default function OwnerAppointmentsPage() {
  const [appointments] = useState<AppointmentRecord[]>(mockAppointments);

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "PENDING").length,
    confirmed: appointments.filter((a) => a.status === "CONFIRMED" || a.status === "WAITING").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
    canceled: appointments.filter((a) => a.status === "CANCELED").length,
  };

  const handleView = (record: AppointmentRecord) => {
    message.info(`Ver detalhes de: ${record.customer}`);
  };

  const handleEdit = (record: AppointmentRecord) => {
    message.info(`Editar agendamento de: ${record.customer}`);
  };

  const handleConfirm = (record: AppointmentRecord) => {
    message.success(`Agendamento de ${record.customer} confirmado!`);
  };

  const handleCancel = (record: AppointmentRecord) => {
    message.warning(`Agendamento de ${record.customer} cancelado`);
  };

  const handleComplete = (record: AppointmentRecord) => {
    message.success(`Agendamento de ${record.customer} concluído!`);
  };

  const handleAddNew = () => {
    message.info("Abrir modal para novo agendamento");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <AppointmentsHeader onAddNew={handleAddNew} />

      <AppointmentsStats {...stats} />

      <Card className="border-base-200">
        <AppointmentsTable
          appointments={appointments}
          onView={handleView}
          onEdit={handleEdit}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onComplete={handleComplete}
        />
      </Card>
    </div>
  );
}
