"use client";

import React from "react";
import { Card, Row, Col, Tag, Tooltip, Popconfirm, Switch, Typography, Empty, Button } from "antd";
import { EditOutlined, DeleteOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Services } from "@/types/services";

const { Text } = Typography;

interface ServiceGridProps {
  services: Services[];
  onEdit: (service: Services) => void;
  onDelete: (id: string) => void;
  onToggleActive: (service: Services) => void;
  isUpdating: boolean;
  onAddService: () => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  services,
  onEdit,
  onDelete,
  onToggleActive,
  isUpdating,
  onAddService,
}) => {
  if (services.length === 0) {
    return (
      <Card>
        <Empty
          description="Nenhum serviço encontrado"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={onAddService}>
            Cadastrar primeiro serviço
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <Card>
      <Row gutter={[16, 16]}>
        {services.map((service) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={service.id}>
            <Card
              hoverable
              className={`h-full transition-all duration-200 hover:shadow-lg ${
                service.isActive === false ? "opacity-70 grayscale-[30%]" : ""
              }`}
              style={{
                borderTop: `4px solid ${service.isActive !== false ? "#52c41a" : "#d9d9d9"}`,
              }}
              actions={[
                <Tooltip title={service.isActive !== false ? "Desativar" : "Ativar"} key="toggle">
                  <Switch
                    size="small"
                    checked={service.isActive !== false}
                    onChange={() => onToggleActive(service)}
                    loading={isUpdating}
                  />
                </Tooltip>,
                <Tooltip title="Editar" key="edit">
                  <EditOutlined
                    onClick={() => onEdit(service)}
                    className="text-blue-500"
                  />
                </Tooltip>,
                <Popconfirm
                  key="delete"
                  title="Excluir serviço"
                  description="Tem certeza que deseja excluir?"
                  onConfirm={() => onDelete(service.id)}
                  okText="Sim"
                  cancelText="Não"
                  okButtonProps={{ danger: true }}
                >
                  <Tooltip title="Excluir">
                    <DeleteOutlined className="text-red-500" />
                  </Tooltip>
                </Popconfirm>,
              ]}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Text strong className="text-lg block">
                      {service.name}
                    </Text>
                    {service.description && (
                      <Text type="secondary" className="text-sm line-clamp-2">
                        {service.description}
                      </Text>
                    )}
                  </div>
                  <Tag
                    color={service.isActive !== false ? "success" : "default"}
                    className="ml-2 shrink-0"
                  >
                    {service.isActive !== false ? "Ativo" : "Inativo"}
                  </Tag>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex items-center gap-1 text-gray-500">
                    <ClockCircleOutlined />
                    <span>{service.duration} min</span>
                  </div>
                  <Text strong className="text-xl text-green-600">
                    R$ {parseFloat(service.price).toFixed(2)}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};
