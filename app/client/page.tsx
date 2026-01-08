"use client";

import React, { useMemo } from "react";
import { Row, Col, Spin } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { useUserVehicles } from "@/hooks/useVehicles";
import { useAppointments } from "@/hooks/useAppointments";
import {
  WelcomeHeader,
  ClientStats,
  ClientAppointmentsList,
  VehiclesList,
  RecentHistory,
} from "@/components/client/dashboard";
import dayjs from "dayjs";
import { Vehicle as UserVehicle } from "@/types/vehicle";

export default function ClientDashboard() {
  const { user } = useAuth();
  
  const { data: vehicles = [], isLoading: vehiclesLoading } = useUserVehicles(
    user?.id || null, 
    !!user?.id
  );

  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments(
    { userId: user?.id },
    !!user?.id
  );

  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter(a => ['PENDING', 'CONFIRMED'].includes(a.status))
      .filter(a => dayjs(a.scheduledAt).isAfter(dayjs()))
      .sort((a, b) => dayjs(a.scheduledAt).valueOf() - dayjs(b.scheduledAt).valueOf())
      .slice(0, 5)
      .map(app => ({
        id: app.id,
        shop: app.shop?.name || "Loja desconhecida",
        service: app.services.map(s => s.serviceName).join(', '),
        vehicle: app.vehicle
          ? `${app.vehicle.brand} ${app.vehicle.model} - ${app.vehicle.plate}`
          : "Veículo não disponível",
        date: dayjs(app.scheduledAt).format('DD/MM/YYYY'),
        time: dayjs(app.scheduledAt).format('HH:mm'),
        status: app.status,
      }));
  }, [appointments]);

  const history = useMemo(() => {
    return appointments
      .filter(a => ['COMPLETED', 'CANCELED'].includes(a.status))
      .sort((a, b) => dayjs(b.scheduledAt).valueOf() - dayjs(a.scheduledAt).valueOf())
      .slice(0, 5)
      .map(app => ({
        id: app.id,
        shop: app.shop?.name || "Loja desconhecida",
        service: app.services.map(s => s.serviceName).join(', '),
        date: dayjs(app.scheduledAt).format('DD/MM/YYYY'),
        status: app.status,
      }));
  }, [appointments]);

  // Normalize vehicles to UI shape (VehiclesList requires color/year as strings)
  const vehiclesNormalized = useMemo(() => {
    return (vehicles as UserVehicle[]).map((v) => ({
      id: v.id,
      plate: v.plate,
      brand: v.brand,
      model: v.model,
      color: v.color || "-",
      year: v.year || 0,
    }));
  }, [vehicles]);

  if (!user) {
     return (
       <div className="h-[60vh] flex flex-col items-center justify-center">
         <Spin size="large" />
         <span className="mt-4 text-slate-500">Preparando sua área...</span>
       </div>
     );
  }

  if (vehiclesLoading || appointmentsLoading) {
      return (
        <div className="h-[60vh] flex flex-col items-center justify-center">
          <Spin size="large" />
          <span className="mt-4 text-slate-500">Carregando informações...</span>
        </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <WelcomeHeader clientName={user.firstName} />

      <ClientStats
        vehiclesCount={vehicles.length}
        upcomingAppointments={appointments.filter(a => ['PENDING', 'CONFIRMED'].includes(a.status)).length}
        totalVisits={appointments.filter(a => a.status === 'COMPLETED').length}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14} xl={16}>
          <div className="h-full">
            <ClientAppointmentsList appointments={upcomingAppointments} />
          </div>
        </Col>
        <Col xs={24} lg={10} xl={8}>
           <div className="flex flex-col gap-6 h-full">
             <VehiclesList vehicles={vehiclesNormalized} />
             {/* <RecentHistory history={history} /> */}
           </div>
        </Col>
      </Row>
    </div>
  );
}
