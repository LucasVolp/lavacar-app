"use client";

import React, { useState } from "react";
import { Typography, Spin, Button, Badge, Tabs, Form, message } from "antd";
import { ToolOutlined, PlusOutlined, FolderOutlined } from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { 
  useServicesByShop, 
  useCreateService, 
  useUpdateService, 
  useDeleteService 
} from "@/hooks/useServices";
import { 
  useServiceGroupsByShop,
  useCreateServiceGroup,
  useUpdateServiceGroup,
  useDeleteServiceGroup,
} from "@/hooks/useServiceGroups";
import { Services, CreateServicePayload, UpdateServicePayload } from "@/types/services";
import { ServiceGroup, CreateServiceGroupPayload, UpdateServiceGroupPayload } from "@/types/serviceGroup";

import { 
  ServiceModal, 
  GroupModal,
  ServiceStats,
  ServiceFilters,
  ServiceGrid,
  ServiceGroupsView,
  ServiceTable,
} from "@/components/owner/services";

const { Title, Text } = Typography;

export default function ServicesPage() {
  const { shopId } = useShopAdmin();
  
  // Hooks de dados
  const { data: services = [], isLoading } = useServicesByShop(shopId);
  const { data: serviceGroups = [], isLoading: isLoadingGroups } = useServiceGroupsByShop(shopId);
  
  // Mutations
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const createGroup = useCreateServiceGroup();
  const updateGroup = useUpdateServiceGroup();
  const deleteGroup = useDeleteServiceGroup();

  // Estados UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Services | null>(null);
  const [searchText, setSearchText] = useState("");
  const [viewType, setViewType] = useState<"table" | "grid">("grid");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [activeTab, setActiveTab] = useState<string>("services");
  
  // Estados para grupos
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ServiceGroup | null>(null);
  
  // Forms
  const [form] = Form.useForm();
  const [groupForm] = Form.useForm();

  // Estatísticas
  const stats = {
    total: services.length,
    active: services.filter(s => s.isActive !== false).length,
    inactive: services.filter(s => s.isActive === false).length,
    avgPrice: services.length > 0 
      ? services.reduce((acc, s) => acc + parseFloat(s.price), 0) / services.length 
      : 0,
  };

  // Filtros
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchText.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchText.toLowerCase());
    
    if (statusFilter === "active") return matchesSearch && service.isActive !== false;
    if (statusFilter === "inactive") return matchesSearch && service.isActive === false;
    return matchesSearch;
  });

  // Handlers - Serviços
  const handleToggleActive = async (service: Services) => {
    try {
      await updateService.mutateAsync({
        id: service.id,
        payload: { isActive: service.isActive === false },
      });
      message.success(service.isActive === false ? "Serviço ativado!" : "Serviço desativado!");
    } catch {
      message.error("Erro ao alterar status do serviço.");
    }
  };

  const handleOpenModal = (service?: Services) => {
    if (service) {
      setEditingService(service);
      form.setFieldsValue({
        name: service.name,
        description: service.description,
        price: parseFloat(service.price),
        duration: service.duration,
        isActive: service.isActive !== false,
        groupId: service.groupId || undefined,
      });
    } else {
      setEditingService(null);
      form.resetFields();
      form.setFieldsValue({ isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    form.resetFields();
  };

  const handleSubmit = async (values: { 
    name: string; 
    description?: string; 
    price: number; 
    duration: number; 
    isActive: boolean;
    groupId?: string;
  }) => {
    try {
      if (editingService) {
        const payload: UpdateServicePayload = { ...values, groupId: values.groupId || undefined };
        await updateService.mutateAsync({ id: editingService.id, payload });
        message.success("Serviço atualizado com sucesso!");
      } else {
        const payload: CreateServicePayload = { ...values, shopId, groupId: values.groupId || undefined };
        await createService.mutateAsync(payload);
        message.success("Serviço criado com sucesso!");
      }
      handleCloseModal();
    } catch {
      message.error("Erro ao salvar serviço.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService.mutateAsync(id);
      message.success("Serviço excluído com sucesso!");
    } catch {
      message.error("Erro ao excluir serviço.");
    }
  };

  // Handlers - Grupos
  const handleOpenGroupModal = (group?: ServiceGroup) => {
    if (group) {
      setEditingGroup(group);
      groupForm.setFieldsValue({
        name: group.name,
        description: group.description,
        isActive: group.isActive !== false,
      });
    } else {
      setEditingGroup(null);
      groupForm.resetFields();
      groupForm.setFieldsValue({ isActive: true });
    }
    setIsGroupModalOpen(true);
  };

  const handleCloseGroupModal = () => {
    setIsGroupModalOpen(false);
    setEditingGroup(null);
    groupForm.resetFields();
  };

  const handleSubmitGroup = async (values: { name: string; description?: string; isActive: boolean }) => {
    try {
      if (editingGroup) {
        const payload: UpdateServiceGroupPayload = values;
        await updateGroup.mutateAsync({ id: editingGroup.id, payload });
        message.success("Grupo atualizado com sucesso!");
      } else {
        const payload: CreateServiceGroupPayload = { ...values, shopId };
        await createGroup.mutateAsync(payload);
        message.success("Grupo criado com sucesso!");
      }
      handleCloseGroupModal();
    } catch {
      message.error("Erro ao salvar grupo.");
    }
  };

  const handleDeleteGroup = async (id: string) => {
    try {
      await deleteGroup.mutateAsync(id);
      message.success("Grupo excluído com sucesso!");
    } catch {
      message.error("Erro ao excluir grupo.");
    }
  };

  const handleAddServiceToGroup = (groupId: string) => {
    setEditingService(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true, groupId });
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando serviços..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title level={3} className="!mb-1 flex items-center gap-2">
          <ToolOutlined className="text-blue-500" />
          Serviços & Grupos
        </Title>
        <Text type="secondary">
          Gerencie os serviços e grupos do estabelecimento
        </Text>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        items={[
          {
            key: "services",
            label: (
              <span className="flex items-center gap-2">
                <ToolOutlined />
                Serviços
                <Badge count={stats.total} size="small" />
              </span>
            ),
            children: (
              <div className="space-y-6">
                <ServiceFilters
                  searchText={searchText}
                  onSearchChange={setSearchText}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  viewType={viewType}
                  onViewTypeChange={setViewType}
                  onAddService={() => handleOpenModal()}
                />

                <ServiceStats {...stats} />

                {viewType === "grid" ? (
                  <ServiceGrid
                    services={filteredServices}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    onToggleActive={handleToggleActive}
                    isUpdating={updateService.isPending}
                    onAddService={() => handleOpenModal()}
                  />
                ) : (
                  <ServiceTable
                    services={filteredServices}
                    loading={isLoading}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    onToggleActive={handleToggleActive}
                    updatingServiceId={updateService.isPending ? editingService?.id || null : null}
                  />
                )}
              </div>
            ),
          },
          {
            key: "groups",
            label: (
              <span className="flex items-center gap-2">
                <FolderOutlined />
                Grupos
                <Badge count={serviceGroups.length} size="small" />
              </span>
            ),
            children: (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Text type="secondary">
                    Organize seus serviços em grupos para melhor visualização
                  </Text>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenGroupModal()}
                  >
                    Novo Grupo
                  </Button>
                </div>

                <ServiceGroupsView
                  groups={serviceGroups}
                  services={services}
                  onEditGroup={handleOpenGroupModal}
                  onDeleteGroup={handleDeleteGroup}
                  onAddGroup={() => handleOpenGroupModal()}
                  onEditService={handleOpenModal}
                  onDeleteService={handleDelete}
                  onToggleServiceActive={handleToggleActive}
                  onAddServiceToGroup={handleAddServiceToGroup}
                  isUpdating={updateService.isPending}
                />
              </div>
            ),
          },
        ]}
      />

      {/* Modals */}
      <ServiceModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingService={editingService}
        serviceGroups={serviceGroups}
        isLoadingGroups={isLoadingGroups}
        isSubmitting={createService.isPending || updateService.isPending}
        form={form}
      />

      <GroupModal
        open={isGroupModalOpen}
        onClose={handleCloseGroupModal}
        onSubmit={handleSubmitGroup}
        editingGroup={editingGroup}
        isSubmitting={createGroup.isPending || updateGroup.isPending}
        form={groupForm}
      />
    </div>
  );
}
