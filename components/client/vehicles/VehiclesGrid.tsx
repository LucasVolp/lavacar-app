"use client";

import React from "react";
import { Vehicle } from "@/types/vehicle";
import { VehicleListCard } from "./VehicleListCard";

interface VehiclesGridProps {
  vehicles: Vehicle[];
  onDelete: (id: string) => void;
  onEdit?: (vehicle: Vehicle) => void;
  deletingId?: string | null;
}

export const VehiclesGrid: React.FC<VehiclesGridProps> = ({
  vehicles,
  onDelete,
  onEdit,
  deletingId,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {vehicles.map((vehicle) => (
        <VehicleListCard
          key={vehicle.id}
          vehicle={vehicle}
          onDelete={onDelete}
          onEdit={onEdit}
          isDeleting={deletingId === vehicle.id}
        />
      ))}
    </div>
  );
};
