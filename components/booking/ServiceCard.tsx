"use client";

import { Card, Typography, Tag, Button } from "antd";
import { ClockCircleOutlined, DollarOutlined } from "@ant-design/icons";
import { Services } from "@/types/services";

const { Text, Title } = Typography;

interface ServiceCardProps {
  service: Services;
  selected?: boolean;
  onSelect?: (service: Services) => void;
  showSelectButton?: boolean;
}

export function ServiceCard({
  service,
  selected = false,
  onSelect,
  showSelectButton = true,
}: ServiceCardProps) {
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return numPrice.toLocaleString("pt-BR", {
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

  return (
    <Card
      className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
        selected ? "border-primary border-2 shadow-md" : "border-gray-200"
      }`}
      onClick={() => onSelect?.(service)}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Title level={5} className="!mb-1 !text-base">
              {service.name}
            </Title>
            {service.description && (
              <Text type="secondary" className="text-sm line-clamp-2">
                {service.description}
              </Text>
            )}
          </div>
          {selected && (
            <Tag color="blue" className="ml-2">
              Selecionado
            </Tag>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-600">
              <ClockCircleOutlined />
              <Text type="secondary">{formatDuration(service.duration)}</Text>
            </div>
            <div className="flex items-center gap-1 text-green-600 font-medium">
              <DollarOutlined />
              <Text className="text-green-600 font-semibold">
                {formatPrice(service.price)}
              </Text>
            </div>
          </div>

          {showSelectButton && (
            <Button
              type={selected ? "primary" : "default"}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(service);
              }}
            >
              {selected ? "Selecionado" : "Selecionar"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ServiceCard;
