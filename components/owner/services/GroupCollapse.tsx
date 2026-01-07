"use client";

import React from "react";
import { Collapse, Tag, Popconfirm, Switch, Button, Tooltip, Empty, Spin } from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  ClockCircleOutlined, 
  DollarOutlined,
  FolderOutlined,
  ToolOutlined 
} from "@ant-design/icons";
import { ServiceGroup } from "@/types/serviceGroup";
import { Services } from "@/types/services";

interface ServiceListInGroupProps {
  services: Services[];
  onEdit: (service: Services) => void;
  onDelete: (serviceId: string) => void;
  onToggleActive: (service: Services) => void;
  updatingServiceId: string | null;
}

const ServiceListInGroup: React.FC<ServiceListInGroupProps> = ({
  services,
  onEdit,
  onDelete,
  onToggleActive,
  updatingServiceId,
}) => {
  if (services.length === 0) {
    return (
      <div className="text-center py-4 text-slate-500">
        Nenhum serviço neste grupo
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {services.map((service) => (
        <div
          key={service.id}
          className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
        >
          <div className="flex-1">
            <div className="font-medium text-slate-800">{service.name}</div>
            {service.description && (
              <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                {service.description}
              </div>
            )}
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <DollarOutlined className="text-xs" />
                R$ {Number(service.price).toFixed(2)}
              </span>
              <span className="flex items-center gap-1 text-slate-500 text-sm">
                <ClockCircleOutlined className="text-xs" />
                {service.duration} min
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={service.isActive}
              onChange={() => onToggleActive(service)}
              loading={updatingServiceId === service.id}
              size="small"
            />
            <Tooltip title="Editar">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(service)}
              />
            </Tooltip>
            <Popconfirm
              title="Excluir serviço"
              description="Tem certeza que deseja excluir?"
              onConfirm={() => onDelete(service.id)}
              okText="Excluir"
              cancelText="Cancelar"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </div>
        </div>
      ))}
    </div>
  );
};

interface GroupCollapseProps {
  groups: ServiceGroup[];
  services: Services[];
  loading: boolean;
  onEditGroup: (group: ServiceGroup) => void;
  onDeleteGroup: (groupId: string) => void;
  onEditService: (service: Services) => void;
  onDeleteService: (serviceId: string) => void;
  onToggleServiceActive: (service: Services) => void;
  updatingServiceId: string | null;
}

export const GroupCollapse: React.FC<GroupCollapseProps> = ({
  groups,
  services,
  loading,
  onEditGroup,
  onDeleteGroup,
  onEditService,
  onDeleteService,
  onToggleServiceActive,
  updatingServiceId,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  // Serviços sem grupo
  const ungroupedServices = services.filter((s) => !s.groupId);

  if (groups.length === 0 && ungroupedServices.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Nenhum grupo ou serviço cadastrado"
      />
    );
  }

  const items = groups.map((group) => {
    const groupServices = services.filter((s) => s.groupId === group.id);
    
    return {
      key: group.id,
      label: (
        <div className="flex items-center justify-between flex-1 mr-4">
          <div className="flex items-center gap-2">
            <FolderOutlined className="text-blue-500" />
            <span className="font-medium">{group.name}</span>
            <Tag color={group.isActive ? "green" : "default"} className="ml-2">
              {group.isActive ? "Ativo" : "Inativo"}
            </Tag>
            <Tag color="blue">{groupServices.length} serviço(s)</Tag>
          </div>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Tooltip title="Editar grupo">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEditGroup(group)}
              />
            </Tooltip>
            <Popconfirm
              title="Excluir grupo"
              description="Isso não exclui os serviços, apenas o grupo."
              onConfirm={() => onDeleteGroup(group.id)}
              okText="Excluir"
              cancelText="Cancelar"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </div>
        </div>
      ),
      children: (
        <ServiceListInGroup
          services={groupServices}
          onEdit={onEditService}
          onDelete={onDeleteService}
          onToggleActive={onToggleServiceActive}
          updatingServiceId={updatingServiceId}
        />
      ),
    };
  });

  // Adiciona item para serviços sem grupo
  if (ungroupedServices.length > 0) {
    items.push({
      key: "ungrouped",
      label: (
        <div className="flex items-center gap-2">
          <ToolOutlined className="text-slate-400" />
          <span className="font-medium text-slate-600">Sem Grupo</span>
          <Tag color="default">{ungroupedServices.length} serviço(s)</Tag>
        </div>
      ),
      children: (
        <ServiceListInGroup
          services={ungroupedServices}
          onEdit={onEditService}
          onDelete={onDeleteService}
          onToggleActive={onToggleServiceActive}
          updatingServiceId={updatingServiceId}
        />
      ),
    });
  }

  return (
    <Collapse
      items={items}
      defaultActiveKey={groups[0]?.id}
      className="bg-white"
      expandIconPosition="start"
    />
  );
};

export default GroupCollapse;
