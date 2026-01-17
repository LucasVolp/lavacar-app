"use client";

import React, { useState } from "react";
import { Spin, Button, Form, message, Typography } from "antd";
import { ToolOutlined, PlusOutlined, FolderOutlined } from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import {
  useServicesByShop,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "@/hooks/useServices";
import {
  useServiceGroupsByShop,
  useCreateServiceGroup,
  useUpdateServiceGroup,
  useDeleteServiceGroup,
} from "@/hooks/useServiceGroups";
import { Services, CreateServicePayload, UpdateServicePayload } from "@/types/services";
import { ServiceGroup, CreateServiceGroupPayload, UpdateServiceGroupPayload } from "@/types/serviceGroup";

import { ServicesHeader } from "@/components/admin/shop/services/ServicesHeader";
import { ServicesStats } from "@/components/admin/shop/services/ServicesStats";
import { ServicesFilters } from "@/components/admin/shop/services/ServicesFilters";
import { ServicesGrid } from "@/components/admin/shop/services/ServicesGrid";
import { ServicesTable } from "@/components/admin/shop/services/ServicesTable";
import { ServiceGroupsList } from "@/components/admin/shop/services/ServiceGroupsList";
import { ServiceFormModal, GroupFormModal } from "@/components/admin/shop/services/ServiceModals";

const { Text } = Typography;

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
  const [activeTab, setActiveTab] = useState<"services" | "groups">("services");

  // Estados para grupos
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ServiceGroup | null>(null);

  // Forms
  const [form] = Form.useForm();
  const [groupForm] = Form.useForm();

  // Estatísticas
  const stats = {
    total: services.length,
    active: services.filter((s) => s.isActive !== false).length,
    inactive: services.filter((s) => s.isActive === false).length,
    avgPrice:
      services.length > 0
        ? services.reduce((acc, s) => acc + parseFloat(s.price), 0) / services.length
        : 0,
  };

  // Filtros
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchText.toLowerCase()) ||
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

  const handleSubmitGroup = async (values: {
    name: string;
    description?: string;
    isActive: boolean;
  }) => {
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
    <div className="space-y-8 animate-fade-in">
      <ServicesHeader />

      {/* Custom Tabs */}
      <div className="flex flex-col gap-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("services")}
              className={`pb-4 px-2 text-sm font-medium transition-all relative ${
                activeTab === "services"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <ToolOutlined />
                Serviços
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === "services" 
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                }`}>
                  {stats.total}
                </span>
              </div>
              {activeTab === "services" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("groups")}
              className={`pb-4 px-2 text-sm font-medium transition-all relative ${
                activeTab === "groups"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <FolderOutlined />
                Grupos
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === "groups" 
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                }`}>
                  {serviceGroups.length}
                </span>
              </div>
              {activeTab === "groups" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === "services" ? (
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <ServicesStats {...stats} />
              </div>

              <ServicesFilters
                searchText={searchText}
                onSearchChange={setSearchText}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                viewType={viewType}
                onViewTypeChange={setViewType}
                onAddService={() => handleOpenModal()}
              />

              {viewType === "grid" ? (
                <ServicesGrid
                  services={filteredServices}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  isUpdating={updateService.isPending}
                  onAddService={() => handleOpenModal()}
                />
              ) : (
                <ServicesTable
                  services={filteredServices}
                  loading={isLoading}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  updatingServiceId={updateService.isPending ? editingService?.id || null : null}
                />
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-800/30">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    Gerenciamento de Grupos
                  </h3>
                  <Text className="text-zinc-500 dark:text-zinc-400 block">
                    Organize seus serviços em grupos para facilitar a navegação e o agendamento.
                  </Text>
                </div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={() => handleOpenGroupModal()}
                  className="shadow-lg shadow-blue-500/20"
                >
                  Novo Grupo
                </Button>
              </div>

              <ServiceGroupsList
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
          )}
        </div>
      </div>

      <ServiceFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingService={editingService}
        serviceGroups={serviceGroups}
        isLoadingGroups={isLoadingGroups}
        isSubmitting={createService.isPending || updateService.isPending}
        form={form}
      />

      <GroupFormModal
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
