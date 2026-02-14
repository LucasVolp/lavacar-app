"use client";

import React from "react";
import { Row, Col, Card, Empty, Button, Tag, Typography } from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  ClockCircleOutlined,
  StopOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  PlusOutlined,
  PictureOutlined
} from "@ant-design/icons";
import { Services } from "@/types/services";
import { CustomTooltip } from "@/components/ui";

const { Text, Title } = Typography;

interface ServicesGridProps {
  services: Services[];
  onEdit: (service: Services) => void;
  onDelete: (id: string) => void;
  onToggleActive: (service: Services) => void;
  isUpdating?: boolean;
  onAddService: () => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  services,
  onEdit,
  onDelete,
  onToggleActive,
  onAddService,
}) => {
  if (services.length === 0) {
    return (
      <Empty
        description="Nenhum serviço encontrado"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddService}>
          Criar Serviço
        </Button>
      </Empty>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {services.map((service) => (
        <Col key={service.id} xs={24} sm={12} lg={8} xl={6}>
          <Card
            hoverable
            className={`h-full flex flex-col ${service.isActive === false ? 'opacity-60 grayscale' : ''}`}
            cover={
              service.photoUrl ? (
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={service.photoUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="h-24 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center">
                  <PictureOutlined className="text-2xl text-zinc-300 dark:text-zinc-600" />
                </div>
              )
            }
            actions={[
              <CustomTooltip title="Editar" key="edit">
                <EditOutlined onClick={() => onEdit(service)} />
              </CustomTooltip>,
              <CustomTooltip title={service.isActive === false ? "Ativar" : "Desativar"} key="toggle">
                {service.isActive === false ? (
                  <CheckCircleOutlined onClick={() => onToggleActive(service)} className="text-green-500" />
                ) : (
                  <StopOutlined onClick={() => onToggleActive(service)} className="text-orange-500" />
                )}
              </CustomTooltip>,
              <CustomTooltip title="Excluir" key="delete">
                <DeleteOutlined onClick={() => onDelete(service.id)} className="text-red-500" />
              </CustomTooltip>,
            ]}
          >
            <div className="flex justify-between items-start mb-2">
              <Title level={5} className="!m-0 line-clamp-1 dark:text-zinc-100" title={service.name}>
                {service.name}
              </Title>
              {service.isActive === false && <Tag color="red">Inativo</Tag>}
            </div>
            
            <Text type="secondary" className="block min-h-[44px] mb-4 line-clamp-2 dark:text-zinc-400">
              {service.description || "Sem descrição"}
            </Text>
            
            <div className="flex justify-between items-center mt-auto">
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold text-lg">
                <DollarOutlined />
                {parseFloat(service.price).toFixed(2)}
              </div>
              <div className="flex items-center gap-1 text-gray-500 dark:text-zinc-400">
                <ClockCircleOutlined />
                {service.duration} min
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
