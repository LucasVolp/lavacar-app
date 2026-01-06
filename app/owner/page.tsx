"use client";

import React from "react";
import { Row, Col } from "antd";
import {
  ShopHeader,
  StatsCards,
  UpcomingAppointmentsList,
  QuickActions,
  PerformanceCard,
  ReviewsCard,
  type Appointment,
} from "@/components/owner/dashboard";

// Mock data - Shop do dono
const myShop = {
  id: "shop_1",
  name: "Auto Lavagem Central",
  status: "ACTIVE",
  todayAppointments: 8,
  pendingAppointments: 3,
  completedToday: 5,
  averageRating: 4.8,
};

// Próximos agendamentos
const upcomingAppointments: Appointment[] = [
  {
    id: "1",
    customer: "João Silva",
    vehicle: "Fiat Uno - ABC-1234",
    service: "Lavagem Completa",
    time: "14:30",
    status: "CONFIRMED",
  },
  {
    id: "2",
    customer: "Maria Santos",
    vehicle: "VW Gol - XYZ-5678",
    service: "Polimento",
    time: "15:00",
    status: "PENDING",
  },
  {
    id: "3",
    customer: "Pedro Oliveira",
    vehicle: "Honda Civic - DEF-9012",
    service: "Lavagem Simples",
    time: "15:30",
    status: "WAITING",
  },
];

// Avaliações recentes
const recentReviews = [
  { id: "1", customerName: "João Silva", rating: 5, date: "Hoje" },
  { id: "2", customerName: "Maria Santos", rating: 4, date: "Ontem" },
];

export default function OwnerDashboard() {
  const handleConfirmAppointment = (id: string) => {
    console.log("Confirming appointment:", id);
    // TODO: Implement confirmation logic
  };

  const completionRate = myShop.todayAppointments > 0
    ? Number(((myShop.completedToday / myShop.todayAppointments) * 100).toFixed(1))
    : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <ShopHeader 
        shopName={myShop.name} 
        isActive={myShop.status === "ACTIVE"} 
      />

      <StatsCards
        todayAppointments={myShop.todayAppointments}
        pendingAppointments={myShop.pendingAppointments}
        completedToday={myShop.completedToday}
        averageRating={myShop.averageRating}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <UpcomingAppointmentsList
            appointments={upcomingAppointments}
            onConfirm={handleConfirmAppointment}
          />
        </Col>

        <Col xs={24} lg={8}>
          <QuickActions />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} md={12}>
          <PerformanceCard
            completionRate={completionRate}
            occupancyRate={80}
          />
        </Col>

        <Col xs={24} md={12}>
          <ReviewsCard reviews={recentReviews} />
        </Col>
      </Row>
    </div>
  );
}
