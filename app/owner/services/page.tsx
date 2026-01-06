"use client";

import React, { useState } from "react";
import { Card, message, Popconfirm } from "antd";
import {
  ServicesHeader,
  ServicesList,
  ServiceFormModal,
  type Service,
} from "@/components/owner/services";

// Mock data
const mockServices: Service[] = [
  {
    id: "1",
    name: "Lavagem Simples",
    description: "Lavagem externa básica com água e sabão",
    price: 40.0,
    duration: 30,
    category: "lavagem",
    isActive: true,
  },
  {
    id: "2",
    name: "Lavagem Completa",
    description: "Lavagem externa e interna, incluindo aspiração e limpeza de vidros",
    price: 80.0,
    duration: 60,
    category: "lavagem",
    isActive: true,
  },
  {
    id: "3",
    name: "Lavagem Completa + Cera",
    description: "Lavagem completa com aplicação de cera protetora",
    price: 120.0,
    duration: 90,
    category: "lavagem",
    isActive: true,
  },
  {
    id: "4",
    name: "Polimento",
    description: "Polimento completo da lataria para remover riscos leves",
    price: 150.0,
    duration: 120,
    category: "polimento",
    isActive: true,
  },
  {
    id: "5",
    name: "Higienização de Bancos",
    description: "Limpeza profunda dos bancos com produtos especializados",
    price: 100.0,
    duration: 90,
    category: "higienizacao",
    isActive: true,
  },
  {
    id: "6",
    name: "Cristalização de Vidros",
    description: "Aplicação de produto repelente de água nos vidros",
    price: 80.0,
    duration: 45,
    category: "protecao",
    isActive: false,
  },
];

export default function OwnerServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    message.success("Serviço excluído com sucesso");
  };

  const handleDuplicate = (service: Service) => {
    const newService: Service = {
      ...service,
      id: `${Date.now()}`,
      name: `${service.name} (Cópia)`,
    };
    setServices((prev) => [...prev, newService]);
    message.success("Serviço duplicado com sucesso");
  };

  const handleToggleActive = (id: string, active: boolean) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: active } : s))
    );
    message.success(active ? "Serviço ativado" : "Serviço desativado");
  };

  const handleSubmit = (values: Omit<Service, "id">) => {
    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id ? { ...s, ...values } : s
        )
      );
      message.success("Serviço atualizado com sucesso");
    } else {
      const newService: Service = {
        ...values,
        id: `${Date.now()}`,
      };
      setServices((prev) => [...prev, newService]);
      message.success("Serviço criado com sucesso");
    }
    setIsModalOpen(false);
    setEditingService(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ServicesHeader onAddNew={handleAddNew} onSearch={setSearchTerm} />

      <Card className="border-base-200">
        <ServicesList
          services={filteredServices}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onToggleActive={handleToggleActive}
          onAddNew={handleAddNew}
        />
      </Card>

      <ServiceFormModal
        open={isModalOpen}
        service={editingService}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
      />
    </div>
  );
}
