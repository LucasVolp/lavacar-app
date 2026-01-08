"use client";

import React from "react";
import { Typography, Card, Space, Button } from "antd";
import { CarOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  color: string;
  year: number;
}

interface VehiclesListProps {
  vehicles: Vehicle[];
}

export const VehiclesList: React.FC<VehiclesListProps> = ({ vehicles }) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <CarOutlined className="text-indigo-500 text-lg" />
          <span className="font-semibold text-lg">Meus Veículos</span>
        </div>
      }
      extra={
        <Link href="/client/vehicles">
          <Button type="text" size="small" className="text-slate-500 hover:text-indigo-500 font-medium">
            Gerenciar
          </Button>
        </Link>
      }
      className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden"
    >
      <Space direction="vertical" className="w-full" size="middle">
        {vehicles.length === 0 ? (
           <div className="text-center py-6 text-slate-500">
             Nenhum veículo cadastrado.
           </div>
        ) : (
          vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-[#27272a] rounded-xl hover:bg-slate-100 dark:hover:bg-[#3f3f46] transition-all duration-300 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
                <CarOutlined className="text-indigo-500 text-xl" />
              </div>
              <div className="flex-grow min-w-0">
                <Text strong className="block text-base mb-1 truncate">
                  {vehicle.brand} {vehicle.model}
                </Text>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="bg-white dark:bg-[#18181b] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono">
                        {vehicle.plate}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{vehicle.color}</span>
                </div>
              </div>
              <RightOutlined className="text-slate-400" />
            </div>
          ))
        )}
      </Space>
    </Card>
  );
};
