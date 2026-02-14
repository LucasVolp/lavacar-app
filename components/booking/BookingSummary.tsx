"use client";

import { Card, Typography, Divider, List, Tag, Button } from "antd";
import {
  CarOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Services } from "@/types/services";
import { Vehicle } from "@/types/vehicle";
import { formatDateInTimezone } from "@/utils/dateUtils";
import { formatVehiclePlate } from "@/utils/vehiclePlate";

const { Title, Text } = Typography;

interface BookingSummaryProps {
  selectedServices: Services[];
  selectedVehicle: Vehicle | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  totalPrice: number;
  totalDuration: number;
  onConfirm: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function BookingSummary({
  selectedServices,
  selectedVehicle,
  selectedDate,
  selectedTime,
  totalPrice,
  totalDuration,
  onConfirm,
  loading = false,
  disabled = false,
}: BookingSummaryProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const isComplete =
    selectedServices.length > 0 &&
    selectedVehicle &&
    selectedDate &&
    selectedTime;

  return (
    <Card className="sticky top-4">
      <Title level={4} className="!mb-4">
        Resumo do Agendamento
      </Title>

      {/* Veículo */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <CarOutlined />
          <Text type="secondary">Veículo</Text>
        </div>
        {selectedVehicle ? (
          <div className="pl-6">
            <Text strong>
              {selectedVehicle.brand} {selectedVehicle.model}
            </Text>
            <br />
            <Text type="secondary">Placa: {formatVehiclePlate(selectedVehicle.plate)}</Text>
          </div>
        ) : (
          <div className="pl-6">
            <Tag color="warning">Selecione um veículo</Tag>
          </div>
        )}
      </div>

      <Divider className="my-3" />

      {/* Serviços */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <CheckCircleOutlined />
          <Text type="secondary">Serviços ({selectedServices.length})</Text>
        </div>
        {selectedServices.length > 0 ? (
          <List
            size="small"
            dataSource={selectedServices}
            renderItem={(service) => (
              <List.Item className="!px-0 !py-1">
                <div className="flex justify-between w-full pl-6">
                  <Text>{service.name}</Text>
                  <Text type="secondary">
                    {formatPrice(parseFloat(service.price))}
                  </Text>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <div className="pl-6">
            <Tag color="warning">Selecione ao menos um serviço</Tag>
          </div>
        )}
      </div>

      <Divider className="my-3" />

      {/* Data e Horário */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <CalendarOutlined />
          <Text type="secondary">Data e Horário</Text>
        </div>
        {selectedDate && selectedTime ? (
          <div className="pl-6">
            <Text strong>{formatDateInTimezone(selectedDate, "EEEE, dd 'de' MMMM")}</Text>
            <br />
            <Text type="secondary">às {selectedTime}</Text>
          </div>
        ) : (
          <div className="pl-6">
            <Tag color="warning">Selecione data e horário</Tag>
          </div>
        )}
      </div>

      <Divider className="my-3" />

      {/* Totais */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-500">
            <ClockCircleOutlined />
            <Text type="secondary">Duração total</Text>
          </div>
          <Text strong>{formatDuration(totalDuration)}</Text>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-500">
            <DollarOutlined />
            <Text type="secondary">Valor total</Text>
          </div>
          <Text strong className="text-lg text-green-600">
            {formatPrice(totalPrice)}
          </Text>
        </div>
      </div>

      {/* Botão de confirmação */}
      <Button
        type="primary"
        size="large"
        block
        onClick={onConfirm}
        loading={loading}
        disabled={disabled || !isComplete}
      >
        {isComplete ? "Confirmar Agendamento" : "Complete todas as etapas"}
      </Button>

      {!isComplete && (
        <Text type="secondary" className="text-xs mt-2 block text-center">
          Preencha todos os campos para continuar
        </Text>
      )}
    </Card>
  );
}

export default BookingSummary;
