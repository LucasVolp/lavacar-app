"use client";

import React from "react";
import { Row, Col, Empty, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ServiceCard, type Service } from "./ServiceCard";

interface ServicesListProps {
  services: Service[];
  onEdit?: (service: Service) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (service: Service) => void;
  onToggleActive?: (id: string, active: boolean) => void;
  onAddNew?: () => void;
}

export const ServicesList: React.FC<ServicesListProps> = ({
  services,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleActive,
  onAddNew,
}) => {
  if (services.length === 0) {
    return (
      <Empty
        description="Nenhum serviço cadastrado"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        className="py-12"
      >
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
          Adicionar Primeiro Serviço
        </Button>
      </Empty>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {services.map((service) => (
        <Col xs={24} sm={12} lg={8} key={service.id}>
          <ServiceCard
            service={service}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onToggleActive={onToggleActive}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ServicesList;
