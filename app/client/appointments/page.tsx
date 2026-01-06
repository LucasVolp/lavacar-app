"use client";

import React, { useState } from "react";
import { message } from "antd";
import {
  ClientAppointmentsHeader,
  ClientAppointmentsListFull,
  type ClientAppointmentFull,
} from "@/components/client/appointments";

// Mock data
const mockAppointments: ClientAppointmentFull[] = [
  {
    id: "1",
    shop: "Auto Lavagem Central",
    shopAddress: "Rua das Flores, 123 - Centro",
    service: "Lavagem Completa",
    vehicle: "Fiat Uno",
    vehiclePlate: "ABC-1234",
    date: "05/01/2026",
    time: "14:30",
    duration: 60,
    price: 80.0,
    status: "CONFIRMED",
    createdAt: "28/12/2025",
  },
  {
    id: "2",
    shop: "Auto Lavagem Central",
    shopAddress: "Rua das Flores, 123 - Centro",
    service: "Polimento",
    vehicle: "VW Gol",
    vehiclePlate: "XYZ-5678",
    date: "10/01/2026",
    time: "10:00",
    duration: 120,
    price: 150.0,
    status: "PENDING",
    createdAt: "01/01/2026",
  },
];

export default function ClientAppointmentsPage() {
  const [appointments] = useState<ClientAppointmentFull[]>(mockAppointments);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const filteredAppointments = statusFilter
    ? appointments.filter((a) => a.status === statusFilter)
    : appointments;

  const handleCancel = (id: string) => {
    message.warning(`Agendamento ${id} cancelado`);
  };

  const handleEdit = (id: string) => {
    message.info(`Editar agendamento ${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ClientAppointmentsHeader onFilterChange={setStatusFilter} />

      <ClientAppointmentsListFull
        appointments={filteredAppointments}
        onCancel={handleCancel}
        onEdit={handleEdit}
      />
    </div>
  );
}
