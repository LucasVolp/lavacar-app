"use client";

import React from "react";
import { Card, Empty, Typography } from "antd";
import {
  CarOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";
import type { Vehicle } from "@/types/vehicle";
import { formatPhone } from "@/utils/formatters";
import { formatVehiclePlate } from "@/utils/vehiclePlate";

const { Title, Text } = Typography;

interface ClientQuickInfoCardProps {
  phone: string;
  email?: string;
  vehicles: Vehicle[];
}

const vehicleTypeLabel: Record<string, string> = {
  CAR: "Carro",
  MOTORCYCLE: "Moto",
  TRUCK: "Caminhão",
  SUV: "SUV",
  VAN: "Van",
  PICKUP: "Picape",
};

export const ClientQuickInfoCard: React.FC<ClientQuickInfoCardProps> = ({
  phone,
  email,
  vehicles,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <Card className="!rounded-2xl !shadow-sm hover:!shadow-md transition-shadow">
          <Title level={5} className="!mb-4 dark:!text-zinc-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
              <PhoneOutlined className="text-indigo-500" />
            </span>
            Contato
          </Title>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <PhoneOutlined className="text-blue-500" />
              </div>
              <div>
                <Text type="secondary" className="!text-xs">Telefone</Text>
                <p className="!m-0 font-semibold text-sm dark:text-zinc-100">
                  {phone ? formatPhone(phone) : "Não informado"}
                </p>
              </div>
            </div>
            {email && (
              <div className="flex items-center gap-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                  <MailOutlined className="text-purple-500" />
                </div>
                <div>
                  <Text type="secondary" className="!text-xs">E-mail</Text>
                  <p className="!m-0 font-semibold text-sm dark:text-zinc-100 truncate max-w-[200px]">
                    {email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      <div className="space-y-4">
        <Card className="!rounded-2xl !shadow-sm hover:!shadow-md transition-shadow">
          <Title level={5} className="!mb-4 dark:!text-zinc-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              <CarOutlined className="text-emerald-500" />
            </span>
            Veículos
            {vehicles.length > 0 && (
              <span className="ml-auto text-xs font-normal bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full">
                {vehicles.length}
              </span>
            )}
          </Title>
          {vehicles.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Nenhum veículo cadastrado"
              className="!my-2"
            />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center gap-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-4 border border-zinc-100 dark:border-zinc-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                    <CarOutlined className="text-white text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-sm bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md">
                        {formatVehiclePlate(vehicle.plate)}
                      </span>
                      <span className="text-sm font-medium dark:text-zinc-200">
                        {vehicle.brand} {vehicle.model}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      {vehicle.year && (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                          <CalendarOutlined /> {vehicle.year}
                        </span>
                      )}
                      {vehicle.color && (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                          <BgColorsOutlined /> {vehicle.color}
                        </span>
                      )}
                      {vehicle.type && (
                        <span className="text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded-full">
                          {vehicleTypeLabel[vehicle.type] || vehicle.type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

    </div>
  );
};
