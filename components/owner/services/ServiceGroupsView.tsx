"use client";

import React from "react";
import { 
  Collapse, 
  Button, 
  Tooltip, 
  Popconfirm, 
  Badge, 
  Tag, 
  Space, 
  Typography, 
  List,
  Switch,
  Empty,
  Card,
  Divider,
} from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  FolderOutlined, 
  FolderOpenOutlined,
  CaretRightOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Services } from "@/types/services";
import { ServiceGroup } from "@/types/serviceGroup";

const { Text } = Typography;

// Sub-componente para lista de serviços dentro de um grupo
interface ServiceListProps {
  services: Services[];
  onToggleActive: (service: Services) => void;
  onEdit: (service: Services) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
}

const ServiceListInGroup: React.FC<ServiceListProps> = ({
  services,
  onToggleActive,
  onEdit,
  onDelete,
  isUpdating,
}) => (
  <List
    size="small"
    dataSource={services}
    locale={{ emptyText: <Text type="secondary" className="text-sm">Nenhum serviço neste grupo</Text> }}
    renderItem={(service) => (
      <List.Item
        actions={[
          <Tooltip key="toggle" title={service.isActive !== false ? "Desativar" : "Ativar"}>
            <Switch
              size="small"
              checked={service.isActive !== false}
              onChange={() => onToggleActive(service)}
              loading={isUpdating}
            />
          </Tooltip>,
          <Tooltip key="edit" title="Editar">
            <Button 
              type="text" 
              size="small"
              icon={<EditOutlined />} 
              onClick={() => onEdit(service)}
            />
          </Tooltip>,
          <Popconfirm
            key="delete"
            title="Excluir serviço?"
            onConfirm={() => onDelete(service.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="text" size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>,
        ]}
      >
        <List.Item.Meta
          title={
            <Space>
              <Text className={service.isActive === false ? "text-gray-400 line-through" : ""}>
                {service.name}
              </Text>
              <Tag color={service.isActive !== false ? "success" : "default"} className="text-xs">
                {service.isActive !== false ? "Ativo" : "Inativo"}
              </Tag>
            </Space>
          }
          description={
            <Space size="middle" className="text-xs">
              <span><ClockCircleOutlined /> {service.duration} min</span>
              <span className="text-green-600 font-medium">R$ {parseFloat(service.price).toFixed(2)}</span>
            </Space>
          }
        />
      </List.Item>
    )}
  />
);

// Props do componente principal
interface ServiceGroupsViewProps {
  groups: ServiceGroup[];
  services: Services[];
  onEditGroup: (group: ServiceGroup) => void;
  onDeleteGroup: (id: string) => void;
  onAddGroup: () => void;
  onEditService: (service: Services) => void;
  onDeleteService: (id: string) => void;
  onToggleServiceActive: (service: Services) => void;
  onAddServiceToGroup: (groupId: string) => void;
  isUpdating: boolean;
}

export const ServiceGroupsView: React.FC<ServiceGroupsViewProps> = ({
  groups,
  services,
  onEditGroup,
  onDeleteGroup,
  onAddGroup,
  onEditService,
  onDeleteService,
  onToggleServiceActive,
  onAddServiceToGroup,
  isUpdating,
}) => {
  const getServicesByGroup = (groupId: string | null) => {
    return services.filter(s => s.groupId === groupId);
  };

  const ungroupedServices = services.filter(s => !s.groupId);

  if (groups.length === 0 && ungroupedServices.length === 0) {
    return (
      <Card>
        <Empty
          description="Nenhum grupo cadastrado"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={onAddGroup}>
            Criar primeiro grupo
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <Collapse
      accordion
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      items={[
        ...groups.map(group => ({
          key: group.id,
          label: (
            <div className="flex items-center justify-between w-full pr-4">
              <Space>
                <FolderOpenOutlined className="text-blue-500" />
                <Text strong>{group.name}</Text>
                <Badge 
                  count={getServicesByGroup(group.id).length} 
                  style={{ backgroundColor: "#1890ff" }}
                  size="small"
                />
                {group.isActive === false && (
                  <Tag color="default">Inativo</Tag>
                )}
              </Space>
              <Space onClick={(e) => e.stopPropagation()}>
                <Tooltip title="Editar grupo">
                  <Button 
                    type="text" 
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => onEditGroup(group)}
                  />
                </Tooltip>
                <Popconfirm
                  title="Excluir grupo?"
                  description="Os serviços serão desvinculados, mas não excluídos."
                  onConfirm={() => onDeleteGroup(group.id)}
                  okText="Sim"
                  cancelText="Não"
                >
                  <Button 
                    type="text" 
                    size="small"
                    icon={<DeleteOutlined />}
                    danger
                  />
                </Popconfirm>
              </Space>
            </div>
          ),
          children: (
            <div>
              {group.description && (
                <Text type="secondary" className="block mb-3 text-sm">
                  {group.description}
                </Text>
              )}
              <ServiceListInGroup
                services={getServicesByGroup(group.id)}
                onToggleActive={onToggleServiceActive}
                onEdit={onEditService}
                onDelete={onDeleteService}
                isUpdating={isUpdating}
              />
              <Divider className="my-3" />
              <Button 
                type="dashed" 
                size="small"
                icon={<PlusOutlined />}
                onClick={() => onAddServiceToGroup(group.id)}
              >
                Adicionar serviço ao grupo
              </Button>
            </div>
          ),
        })),
        ...(ungroupedServices.length > 0 ? [{
          key: "ungrouped",
          label: (
            <div className="flex items-center justify-between w-full pr-4">
              <Space>
                <FolderOutlined className="text-gray-400" />
                <Text type="secondary">Sem grupo</Text>
                <Badge 
                  count={ungroupedServices.length} 
                  style={{ backgroundColor: "#8c8c8c" }}
                  size="small"
                />
              </Space>
            </div>
          ),
          children: (
            <ServiceListInGroup
              services={ungroupedServices}
              onToggleActive={onToggleServiceActive}
              onEdit={onEditService}
              onDelete={onDeleteService}
              isUpdating={isUpdating}
            />
          ),
        }] : []),
      ]}
    />
  );
};
