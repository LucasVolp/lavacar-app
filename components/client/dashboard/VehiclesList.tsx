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
          <CarOutlined className="text-info" />
          <span>Meus Veículos</span>
        </div>
      }
      extra={
        <Link href="/client/vehicles">
          <Button type="link" size="small">
            Gerenciar
          </Button>
        </Link>
      }
      className="border-base-200"
    >
      <Space direction="vertical" className="w-full" size="small">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg hover:bg-base-200 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
              <CarOutlined className="text-info" />
            </div>
            <div className="flex-grow">
              <Text strong className="block text-sm">
                {vehicle.brand} {vehicle.model}
              </Text>
              <Text type="secondary" className="text-xs">
                {vehicle.plate} • {vehicle.color} • {vehicle.year}
              </Text>
            </div>
            <RightOutlined className="text-base-content/30" />
          </div>
        ))}
        <Link href="/client/vehicles/new" className="block">
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            className="mt-2"
          >
            Adicionar Veículo
          </Button>
        </Link>
      </Space>
    </Card>
  );
};

export default VehiclesList;
