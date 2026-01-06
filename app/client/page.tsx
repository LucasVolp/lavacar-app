"use client";

import React from "react";
import { Row, Col } from "antd";
import {
  WelcomeHeader,
  ClientStats,
  ClientAppointmentsList,
  VehiclesList,
  RecentHistory,
  type ClientAppointment,
  type Vehicle,
  type HistoryItem,
} from "@/components/client/dashboard";

// Mock data - Dados do cliente
const clientData = {
  name: "João Silva",
  vehiclesCount: 2,
  appointmentsCount: 5,
  upcomingAppointments: 1,
};

// Veículos do cliente
const myVehicles: Vehicle[] = [
  {
    id: "1",
    plate: "ABC-1234",
    brand: "Fiat",
    model: "Uno",
    color: "Branco",
    year: 2020,
  },
  {
    id: "2",
    plate: "XYZ-5678",
    brand: "VW",
    model: "Gol",
    color: "Prata",
    year: 2022,
  },
];

// Próximos agendamentos
const upcomingAppointments: ClientAppointment[] = [
  {
    id: "1",
    shop: "Auto Lavagem Central",
    service: "Lavagem Completa",
    vehicle: "Fiat Uno - ABC-1234",
    date: "05/01/2026",
    time: "14:30",
    status: "CONFIRMED",
  },
];

// Histórico recente
const recentHistory: HistoryItem[] = [
  {
    id: "1",
    shop: "Auto Lavagem Central",
    service: "Polimento",
    date: "28/12/2025",
    status: "COMPLETED",
  },
  {
    id: "2",
    shop: "Auto Lavagem Central",
    service: "Lavagem Simples",
    date: "20/12/2025",
    status: "COMPLETED",
  },
];

export default function ClientDashboard() {
  return (
    <div className="max-w-5xl mx-auto">
      <WelcomeHeader clientName={clientData.name} />

      <ClientStats
        vehiclesCount={clientData.vehiclesCount}
        upcomingAppointments={clientData.upcomingAppointments}
        totalVisits={clientData.appointmentsCount}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <ClientAppointmentsList appointments={upcomingAppointments} />
        </Col>

        <Col xs={24} lg={10}>
          <VehiclesList vehicles={myVehicles} />
        </Col>
      </Row>

      <RecentHistory history={recentHistory} />
    </div>
  );
}
