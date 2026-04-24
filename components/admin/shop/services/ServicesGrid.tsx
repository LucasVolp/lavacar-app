"use client";

import React from "react";
import NextImage from "next/image";
import { Row, Col, Card, Empty, Button, Typography } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  StopOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { Services } from "@/types/services";
import { CustomTooltip } from "@/components/ui";
import { ServiceMetaBadges } from "./ServiceMetaBadges";
import { ServicePricingSummary } from "./ServicePricingSummary";
import { formatCurrency } from "./serviceUi";
import { DEFAULT_SERVICE_IMAGE } from "@/lib/assets";

const { Text, Title } = Typography;

interface ServicesGridProps {
  services: Services[];
  onEdit?: (service: Services) => void;
  onDelete?: (id: string) => void;
  onToggleActive: (service: Services) => void;
  isUpdating?: boolean;
  onAddService?: () => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  services,
  onEdit,
  onDelete,
  onToggleActive,
  onAddService,
}) => {
  const [failedImages, setFailedImages] = React.useState<Record<string, boolean>>({});

  if (services.length === 0) {
    return (
      <Empty description="Nenhum serviço encontrado" image={Empty.PRESENTED_IMAGE_SIMPLE}>
        {onAddService && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddService}>
            Criar Serviço
          </Button>
        )}
      </Empty>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {services.map((service) => (
        (() => {
          const fallbackKey = `default:${service.id}`;
          const src = service.photoUrl || DEFAULT_SERVICE_IMAGE;
          const hasSrc = Boolean(src);
          const failed = failedImages[service.id] || (!service.photoUrl && failedImages[fallbackKey]);

          return (
        <Col key={service.id} xs={24} sm={12} lg={8} xl={6}>
          <Card
            hoverable
            className={`h-full flex flex-col border-zinc-200 dark:border-zinc-800 ${
              service.isActive === false ? "opacity-70" : ""
            }`}
            cover={
              hasSrc && !failed ? (
                <div className="relative h-40 overflow-hidden">
                  <NextImage
                    src={src}
                    alt={service.name}
                    fill
                    unoptimized
                    onError={() =>
                      setFailedImages((prev) => ({
                        ...prev,
                        [service.photoUrl ? service.id : fallbackKey]: true,
                      }))
                    }
                    className={service.photoUrl ? "object-cover" : "object-contain p-6 opacity-40 dark:opacity-20"}
                  />
                </div>
              ) : (
                <div className="h-40 bg-zinc-50 dark:bg-zinc-800/50 flex flex-col items-center justify-center gap-1">
                  <PictureOutlined className="text-lg text-zinc-400 dark:text-zinc-500" />
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Sem imagem de capa</span>
                </div>
              )
            }
            actions={[
              ...(onEdit ? [
                <CustomTooltip title="Editar" key="edit">
                  <EditOutlined onClick={() => onEdit(service)} />
                </CustomTooltip>,
              ] : []),
              <CustomTooltip title={service.isActive === false ? "Ativar" : "Desativar"} key="toggle">
                {service.isActive === false ? (
                  <CheckCircleOutlined onClick={() => onToggleActive(service)} className="text-emerald-500" />
                ) : (
                  <StopOutlined onClick={() => onToggleActive(service)} className="text-amber-500" />
                )}
              </CustomTooltip>,
              ...(onDelete ? [
                <CustomTooltip title="Excluir" key="delete">
                  <DeleteOutlined onClick={() => onDelete(service.id)} className="text-red-500" />
                </CustomTooltip>,
              ] : []),
            ]}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Title level={5} className="!m-0 line-clamp-2 dark:text-zinc-100" title={service.name}>
                  {service.name}
                </Title>
              </div>

              <ServiceMetaBadges service={service} />

              <Text type="secondary" className="block min-h-[40px] line-clamp-2 dark:text-zinc-400">
                {service.description || "Sem descrição"}
              </Text>

              <div className="pt-1 space-y-1">
                <div className="inline-flex items-center gap-1.5">
                  <DollarCircleOutlined className="text-base text-emerald-600 dark:text-emerald-400" />
                  <span className="text-lg font-bold">
                    <ServicePricingSummary service={service} compact />
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <ClockCircleOutlined />
                    {service.hasVariants && service.variants?.length
                      ? `${Math.min(...service.variants.map((v) => v.duration))} a ${Math.max(...service.variants.map((v) => v.duration))} min`
                      : `${service.duration} min`}
                  </span>
                  {service.hasVariants && service.variants?.length ? (
                    <span>{service.variants.length} portes</span>
                  ) : (
                    <span>{formatCurrency(service.price)}</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Col>
          );
        })()
      ))}
    </Row>
  );
};
