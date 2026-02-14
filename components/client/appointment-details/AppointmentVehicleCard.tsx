import React from "react";
import Link from "next/link";
import { Card, Tag } from "antd";
import { CarOutlined, RightOutlined } from "@ant-design/icons";
import type { Vehicle } from "@/types/vehicle";
import { formatVehiclePlate } from "@/utils/vehiclePlate";

interface AppointmentVehicleCardProps {
  vehicle?: Vehicle;
}

export function AppointmentVehicleCard({ vehicle }: AppointmentVehicleCardProps) {
  const href = vehicle ? `/client/vehicles/${vehicle.id}` : "#";

  return (
    <Link href={href} className={!vehicle ? "pointer-events-none" : ""}>
      <Card
        title={
          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
            <CarOutlined className="text-cyan-500" />
            <span>Veículo</span>
          </div>
        }
        extra={vehicle && <RightOutlined className="text-zinc-400" />}
        className="border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm rounded-2xl hover:border-cyan-300 dark:hover:border-cyan-700 transition-colors cursor-pointer group"
      >
        {vehicle ? (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/20 transition-colors">
              <CarOutlined className="text-3xl text-zinc-400 group-hover:text-cyan-500 transition-colors" />
            </div>
            <div>
              <h4 className="font-bold text-lg m-0 text-zinc-800 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {vehicle.brand} {vehicle.model}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Tag className="font-mono m-0 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                  {formatVehiclePlate(vehicle.plate)}
                </Tag>
                <span className="text-zinc-400 text-sm">
                  {vehicle.color && vehicle.year ? `${vehicle.color} • ${vehicle.year}` : ""}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-zinc-500 italic">Veículo não disponível</p>
        )}
      </Card>
    </Link>
  );
}
