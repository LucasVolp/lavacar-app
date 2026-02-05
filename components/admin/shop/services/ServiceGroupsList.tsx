"use client";

import React from "react";
import {
  Collapse,
  Button,
  Badge,
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
import { CustomTooltip, CustomPopconfirm } from "@/components/ui";

const { Text } = Typography;

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
    locale={{ emptyText: <Text type="secondary" className="text-sm dark:text-zinc-500">Nenhum serviço neste grupo</Text> }}
    renderItem={(service) => (
      <List.Item
        actions={[
          <CustomTooltip key="toggle" title={service.isActive !== false ? "Desativar" : "Ativar"}>
            <Switch
              size="small"
              checked={service.isActive !== false}
              onChange={() => onToggleActive(service)}
              loading={isUpdating}
            />
          </CustomTooltip>,
          <CustomTooltip key="edit" title="Editar">
            <Button 
              type="text" 
              size="small"
              icon={<EditOutlined />} 
              onClick={() => onEdit(service)}
            />
          </CustomTooltip>,
          <CustomPopconfirm
            key="delete"
            title="Excluir serviço?"
            onConfirm={() => onDelete(service.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="text" size="small" icon={<DeleteOutlined />} danger />
          </CustomPopconfirm>,
        ]}
      >
        <List.Item.Meta
          title={
            <Space>
              <Text className={service.isActive === false ? "text-zinc-400 line-through dark:text-zinc-500" : "dark:text-zinc-100"}>
                {service.name}
              </Text>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                service.isActive !== false
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}>
                {service.isActive !== false ? "Ativo" : "Inativo"}
              </span>
            </Space>
          }
          description={
            <Space size="middle" className="text-xs dark:text-zinc-400">
              <span><ClockCircleOutlined /> {service.duration} min</span>
              <span className="text-green-600 dark:text-green-400 font-medium">R$ {parseFloat(service.price).toFixed(2)}</span>
            </Space>
          }
        />
      </List.Item>
    )}
  />
);

interface ServiceGroupsListProps {
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

export const ServiceGroupsList: React.FC<ServiceGroupsListProps> = ({
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
                  className="[&_.ant-badge-count]:bg-zinc-600 [&_.ant-badge-count]:dark:bg-zinc-500"
                  size="small"
                />
                {group.isActive === false && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    Inativo
                  </span>
                )}
              </Space>
              <Space onClick={(e) => e.stopPropagation()}>
                <CustomTooltip title="Editar grupo">
                  <Button 
                    type="text" 
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => onEditGroup(group)}
                  />
                </CustomTooltip>
                <CustomPopconfirm
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
                </CustomPopconfirm>
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
                <FolderOutlined className="text-zinc-400 dark:text-zinc-500" />
                <Text type="secondary">Sem grupo</Text>
                <Badge
                  count={ungroupedServices.length}
                  className="[&_.ant-badge-count]:bg-zinc-500 [&_.ant-badge-count]:dark:bg-zinc-600"
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
