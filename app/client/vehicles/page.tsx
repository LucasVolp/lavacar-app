"use client";

import React, { useState } from "react";
import { Spin, message } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { useUserVehicles, useDeleteVehicle } from "@/hooks/useVehicles";
import { AddVehicleModal } from "@/components/booking/AddVehicleModal";
import { Vehicle } from "@/types/vehicle";
import {
  VehiclesHeader,
  VehiclesEmptyState,
  VehiclesGrid,
} from "@/components/client/vehicles";

export default function VehiclesPage() {
  const { user } = useAuth();
  const { data: vehicles = [], isLoading } = useUserVehicles(user?.id || null, !!user?.id);
  const deleteVehicle = useDeleteVehicle();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteVehicle.mutateAsync(id);
      message.success("Veículo removido com sucesso");
    } catch {
      message.error("Erro ao remover veículo");
    } finally {
      setDeletingId(null);
    }
  };

  const openCreateModal = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Spin size="large" />
        <span className="mt-4 text-zinc-500 dark:text-zinc-400">Carregando veículos...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <VehiclesHeader onAdd={openCreateModal} />

      {vehicles.length === 0 ? (
        <VehiclesEmptyState onAdd={openCreateModal} />
      ) : (
        <VehiclesGrid
          vehicles={vehicles}
          onDelete={handleDelete}
          onEdit={openEditModal}
          deletingId={deletingId}
        />
      )}

      <AddVehicleModal
        open={isModalOpen}
        onClose={closeModal}
        vehicle={editingVehicle}
      />
    </div>
  );
}
