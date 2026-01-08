"use client";

import React, { useState, useMemo } from "react";
import { message, Spin } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/hooks/useAppointments";
import {
  ClientAppointmentsHeader,
  ClientAppointmentsListFull,
  type ClientAppointmentFull,
} from "@/components/client/appointments";
import dayjs from "dayjs";

export default function ClientAppointmentsPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  
  const { data: appointmentsRaw = [], isLoading } = useAppointments(
    { userId: user?.id },
    !!user?.id
  );

  const appointments: ClientAppointmentFull[] = useMemo(() => {
    return appointmentsRaw.map(app => ({
        id: app.id,
        shop: app.shop?.name || 'Loja desconhecida',
        shopAddress: app.shop ? `${app.shop.street}, ${app.shop.neighborhood}` : '',
        service: app.services.map(s => s.serviceName).join(', '),
        vehicle: app.vehicle ? `${app.vehicle.brand} ${app.vehicle.model}` : 'Veículo removido',
        vehiclePlate: app.vehicle?.plate || '',
        date: dayjs(app.scheduledAt).format('DD/MM/YYYY'),
        time: dayjs(app.scheduledAt).format('HH:mm'),
        duration: app.totalDuration,
        price: parseFloat(app.totalPrice),
        status: app.status,
        createdAt: dayjs(app.createdAt).format('DD/MM/YYYY'),
    }));
  }, [appointmentsRaw]);

  const filteredAppointments = useMemo(() => {
     if (!statusFilter) return appointments;
     return appointments.filter((a) => a.status === statusFilter);
  }, [appointments, statusFilter]);

  const handleCancel = (id: string) => {
    // Implement cancel logic using mutation
    message.warning(`Funcionalidade de cancelar a ser implementada para ID: ${id}`);
  };

  const handleEdit = (id: string) => {
    message.info(`Funcionalidade de editar a ser implementada para ID: ${id}`);
  };

  if (isLoading) {
      return <div className="p-12 text-center"><Spin size="large" /></div>;
  }

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
