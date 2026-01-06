"use client";

import { Card, Typography, Tag, Button, Empty } from "antd";
import { CarOutlined, PlusOutlined } from "@ant-design/icons";
import { Vehicle } from "@/types/vehicle";

const { Text, Title } = Typography;

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelect: (vehicleId: string) => void;
  onAddVehicle?: () => void;
  loading?: boolean;
}

export function VehicleSelector({
  vehicles,
  selectedVehicleId,
  onSelect,
  onAddVehicle,
  loading = false,
}: VehicleSelectorProps) {
  const getVehicleTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      CAR: "Carro",
      MOTORCYCLE: "Moto",
      TRUCK: "Caminhão",
      SUV: "SUV",
      VAN: "Van",
      OTHER: "Outro",
    };
    return types[type] || type;
  };

  if (vehicles.length === 0 && !loading) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Você ainda não tem veículos cadastrados"
      >
        {onAddVehicle && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddVehicle}>
            Adicionar Veículo
          </Button>
        )}
      </Empty>
    );
  }

  return (
    <div className="space-y-3">
      {vehicles.map((vehicle) => {
        const isSelected = selectedVehicleId === vehicle.id;

        return (
          <Card
            key={vehicle.id}
            className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
              isSelected ? "border-primary border-2 shadow-md" : "border-gray-200"
            }`}
            onClick={() => onSelect(vehicle.id)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <CarOutlined className="text-xl text-gray-500" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Title level={5} className="!mb-0 !text-base">
                    {vehicle.brand} {vehicle.model}
                  </Title>
                  <Tag>{getVehicleTypeLabel(vehicle.type)}</Tag>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <Text type="secondary" className="text-sm">
                    Placa: <strong>{vehicle.plate}</strong>
                  </Text>
                  {vehicle.year && (
                    <Text type="secondary" className="text-sm">
                      Ano: {vehicle.year}
                    </Text>
                  )}
                  {vehicle.color && (
                    <Text type="secondary" className="text-sm">
                      Cor: {vehicle.color}
                    </Text>
                  )}
                </div>
              </div>

              <Button type={isSelected ? "primary" : "default"} size="small">
                {isSelected ? "Selecionado" : "Selecionar"}
              </Button>
            </div>
          </Card>
        );
      })}

      {onAddVehicle && (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={onAddVehicle}
          block
          className="h-14"
        >
          Adicionar Novo Veículo
        </Button>
      )}
    </div>
  );
}

export default VehicleSelector;
