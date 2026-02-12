"use client";

import React from "react";
import { Card, Button, Empty } from "antd";
import { CarOutlined } from "@ant-design/icons";
import Link from "next/link";
import { VehicleCard } from "@/components/client/VehicleCard";
import type { VehicleCardData } from "@/components/client/VehicleCard";

export type Vehicle = VehicleCardData;

interface VehiclesListProps {
  vehicles: Vehicle[];
}

export const VehiclesList: React.FC<VehiclesListProps> = ({ vehicles }) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <CarOutlined className="text-cyan-500 text-lg" />
          <span className="font-semibold text-base">Meus Veículos</span>
        </div>
      }
      extra={
        <Link href="/client/vehicles">
          <Button type="link" size="small" className="font-medium">
            Gerenciar
          </Button>
        </Link>
      }
      className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900"
    >
      {vehicles.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className="text-zinc-500 dark:text-zinc-400">
              Nenhum veículo cadastrado
            </span>
          }
          className="my-4"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </Card>
  );
};
