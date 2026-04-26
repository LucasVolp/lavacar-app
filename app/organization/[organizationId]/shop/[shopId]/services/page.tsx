"use client";

import React, { useState } from "react";
import { Spin, Button, Form, message, Typography, Pagination } from "antd";
import { ToolOutlined, PlusOutlined, FolderOutlined } from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import {
  serviceKeys,
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
import { serviceVariantService } from "@/services/serviceVariant";
import { Services, CreateServicePayload, UpdateServicePayload, ServiceVariant } from "@/types/services";
import { ServiceGroup, CreateServiceGroupPayload, UpdateServiceGroupPayload } from "@/types/serviceGroup";
import { useDebouncedValue } from "@/hooks";

import { ServicesHeader } from "@/components/admin/shop/services/ServicesHeader";
import { ServicesStats } from "@/components/admin/shop/services/ServicesStats";
import { ServicesFilters } from "@/components/admin/shop/services/ServicesFilters";
import { ServicesGrid } from "@/components/admin/shop/services/ServicesGrid";
import { ServicesTable } from "@/components/admin/shop/services/ServicesTable";
import { ServiceGroupsList } from "@/components/admin/shop/services/ServiceGroupsList";
import { ServiceFormModal, GroupFormModal, ServiceFormValues } from "@/components/admin/shop/services/ServiceModals";
import { ServiceVariantFormValue } from "@/components/admin/shop/services/ServiceVariantsEditor";

const { Text } = Typography;

export default function ServicesPage() {
  const { shopId, organizationId, shop } = useShopAdmin();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const canManage = (() => {
    if (!user || !organizationId) return false;
    if (user.id === shop?.ownerId) return true;
    if (user.role === "ADMIN") return true;
    if (user.organizations?.some((org: { id: string }) => org.id === organizationId)) return true;
    const membership = user.organizationMembers?.find((m: { organizationId: string; role: string }) => m.organizationId === organizationId);
    return membership?.role !== "EMPLOYEE";
  })();

  const [searchText, setSearchText] = useState("");
  const [viewType, setViewType] = useState<"table" | "grid">("grid");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [activeTab, setActiveTab] = useState<"services" | "groups">("services");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [isSyncingVariants, setIsSyncingVariants] = useState(false);

  const debouncedSearch = useDebouncedValue(searchText, 300);

  const filters = {
    search: debouncedSearch || undefined,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
    page,
    perPage,
  };

  const { data: servicesData, isLoading } = useServicesByShop(shopId, filters);
  const { data: serviceGroupsData, isLoading: isLoadingGroups } = useServiceGroupsByShop(shopId);

  const services = servicesData?.data ?? [];
  const meta = servicesData?.meta;
  const serviceGroups = serviceGroupsData?.data ?? [];

  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const createGroup = useCreateServiceGroup();
  const updateGroup = useUpdateServiceGroup();
  const deleteGroup = useDeleteServiceGroup();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Services | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ServiceGroup | null>(null);

  const [form] = Form.useForm<ServiceFormValues>();
  const [groupForm] = Form.useForm();

  const stats = {
    total: meta?.total ?? services.length,
    active: services.filter((s) => s.isActive !== false).length,
    inactive: services.filter((s) => s.isActive === false).length,
    avgPrice:
      services.length > 0
        ? services.reduce((acc, s) => acc + parseFloat(s.price || "0"), 0) / services.length
        : 0,
    budgetOnly: services.filter((s) => s.isBudgetOnly).length,
    withVariants: services.filter((s) => s.hasVariants).length,
  };

  const normalizeVariants = (variants?: ServiceVariantFormValue[]): ServiceVariantFormValue[] => {
    const clean = (variants || [])
      .filter((v): v is ServiceVariantFormValue => Boolean(v?.size) && Number(v?.duration) > 0 && Number(v?.price) >= 0)
      .map((v) => ({
        size: v.size,
        duration: Number(v.duration),
        price: Number(v.price),
      }));

    const uniqueBySize = new Map(clean.map((v) => [v.size, v]));
    return Array.from(uniqueBySize.values());
  };

  const syncVariants = async (
    serviceId: string,
    existing: ServiceVariant[],
    incoming: ServiceVariantFormValue[],
  ) => {
    const existingBySize = new Map(existing.map((variant) => [variant.size, variant]));
    const incomingBySize = new Map(incoming.map((variant) => [variant.size, variant]));

    const operations: Promise<unknown>[] = [];

    for (const variant of incoming) {
      const current = existingBySize.get(variant.size);
      if (!current) {
        operations.push(
          serviceVariantService.create({
            serviceId,
            size: variant.size,
            price: variant.price,
            duration: variant.duration,
          }),
        );
        continue;
      }

      if (Number(current.price) !== variant.price || current.duration !== variant.duration) {
        operations.push(
          serviceVariantService.update(current.id, {
            price: variant.price,
            duration: variant.duration,
            size: variant.size,
          }),
        );
      }
    }

    for (const current of existing) {
      if (!incomingBySize.has(current.size)) {
        operations.push(serviceVariantService.remove(current.id));
      }
    }

    if (operations.length > 0) {
      await Promise.all(operations);
    }
  };

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
        photoUrl: service.photoUrl || undefined,
        price: parseFloat(service.price),
        duration: service.duration,
        isActive: service.isActive !== false,
        groupId: service.groupId || undefined,
        hasVariants: Boolean(service.hasVariants),
        isBudgetOnly: Boolean(service.isBudgetOnly),
        variants: (service.variants || []).map((variant) => ({
          size: variant.size,
          price: Number(variant.price),
          duration: variant.duration,
        })),
      });
    } else {
      setEditingService(null);
      form.resetFields();
      form.setFieldsValue({
        isActive: true,
        isBudgetOnly: false,
        hasVariants: false,
        duration: 30,
        price: 0,
        variants: [],
      });
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    form.resetFields();
  };

  const handleSubmit = async (values: ServiceFormValues) => {
    const variants = normalizeVariants(values.variants);

    if (values.hasVariants && variants.length === 0) {
      message.warning("Adicione ao menos uma variação por porte.");
      return;
    }

    const minVariantPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : 0;
    const minVariantDuration = variants.length > 0 ? Math.min(...variants.map((v) => v.duration)) : values.duration;

    const basePayload: Omit<CreateServicePayload, "shopId"> = {
      name: values.name,
      description: values.description || undefined,
      photoUrl: values.photoUrl || undefined,
      groupId: values.groupId || undefined,
      isActive: values.isActive,
      isBudgetOnly: values.isBudgetOnly,
      hasVariants: values.hasVariants,
      price: values.isBudgetOnly ? 0 : values.hasVariants ? minVariantPrice : values.price,
      duration: values.hasVariants ? minVariantDuration : values.duration,
    };

    try {
      setIsSyncingVariants(true);

      if (editingService) {
        const payload: UpdateServicePayload = { ...basePayload };
        const updated = await updateService.mutateAsync({ id: editingService.id, payload });

        if (values.hasVariants) {
          await syncVariants(updated.id, editingService.variants || [], variants);
        } else if ((editingService.variants || []).length > 0) {
          await Promise.all((editingService.variants || []).map((variant) => serviceVariantService.remove(variant.id)));
        }

        message.success("Serviço atualizado com sucesso!");
      } else {
        const payload: CreateServicePayload = { ...basePayload, shopId };
        const created = await createService.mutateAsync(payload);

        if (values.hasVariants && variants.length > 0) {
          await Promise.all(
            variants.map((variant) =>
              serviceVariantService.create({
                serviceId: created.id,
                size: variant.size,
                price: variant.price,
                duration: variant.duration,
              }),
            ),
          );
        }

        message.success("Serviço criado com sucesso!");
      }

      await queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      handleCloseModal();
    } catch {
      message.error("Erro ao salvar serviço. Verifique os dados e tente novamente.");
    } finally {
      setIsSyncingVariants(false);
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

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: "all" | "active" | "inactive") => {
    setStatusFilter(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPageSize && newPageSize !== perPage) {
      setPerPage(newPageSize);
    }
  };

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
    form.setFieldsValue({
      isActive: true,
      isBudgetOnly: false,
      hasVariants: false,
      groupId,
      price: 0,
      duration: 30,
      variants: [],
    });
    setIsModalOpen(true);
  };

  if (isLoading && !servicesData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando serviços..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <ServicesHeader />

      <div className="flex flex-col gap-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("services")}
              className={`pb-4 px-2 text-sm font-medium transition-all relative ${
                activeTab === "services"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <ToolOutlined />
                Serviços
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === "services"
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {stats.total}
                </span>
              </div>
              {activeTab === "services" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("groups")}
              className={`pb-4 px-2 text-sm font-medium transition-all relative ${
                activeTab === "groups"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <FolderOutlined />
                Grupos
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === "groups"
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {serviceGroups.length}
                </span>
              </div>
              {activeTab === "groups" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
              )}
            </button>
          </div>
        </div>

        <div className="transition-all duration-300">
          {activeTab === "services" ? (
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <ServicesStats {...stats} />
              </div>

              <ServicesFilters
                searchText={searchText}
                onSearchChange={handleSearchChange}
                statusFilter={statusFilter}
                onStatusFilterChange={handleStatusFilterChange}
                viewType={viewType}
                onViewTypeChange={setViewType}
                onAddService={canManage ? () => handleOpenModal() : undefined}
              />

              {viewType === "grid" ? (
                <ServicesGrid
                  services={services}
                  onEdit={canManage ? handleOpenModal : undefined}
                  onDelete={canManage ? handleDelete : undefined}
                  onToggleActive={handleToggleActive}
                  isUpdating={updateService.isPending}
                  onAddService={canManage ? () => handleOpenModal() : undefined}
                />
              ) : (
                <ServicesTable
                  services={services}
                  loading={isLoading}
                  onEdit={canManage ? handleOpenModal : undefined}
                  onDelete={canManage ? handleDelete : undefined}
                  onToggleActive={handleToggleActive}
                  updatingServiceId={updateService.isPending ? editingService?.id || null : null}
                />
              )}

              {meta && meta.totalPages > 1 && (
                <div className="flex justify-center pt-4">
                  <Pagination
                    current={page}
                    pageSize={perPage}
                    total={meta.total}
                    onChange={handlePageChange}
                    showSizeChanger
                    showTotal={(total, range) => `${range[0]}-${range[1]} de ${total} serviços`}
                    pageSizeOptions={["12", "24", "48", "96"]}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-indigo-50/50 dark:bg-indigo-900/10 p-4 sm:p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Gerenciamento de Grupos</h3>
                  <Text className="text-zinc-500 dark:text-zinc-400 block text-sm">
                    Organize seus serviços em grupos para facilitar a navegação e o agendamento.
                  </Text>
                </div>
                {canManage && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => handleOpenGroupModal()}
                    className="shadow-lg shadow-indigo-500/20 min-h-[44px] w-full sm:w-auto shrink-0"
                  >
                    Novo Grupo
                  </Button>
                )}
              </div>

              <ServiceGroupsList
                groups={serviceGroups}
                services={services}
                onEditGroup={canManage ? handleOpenGroupModal : undefined}
                onDeleteGroup={canManage ? handleDeleteGroup : undefined}
                onAddGroup={canManage ? () => handleOpenGroupModal() : undefined}
                onEditService={canManage ? handleOpenModal : undefined}
                onDeleteService={canManage ? handleDelete : undefined}
                onToggleServiceActive={handleToggleActive}
                onAddServiceToGroup={canManage ? handleAddServiceToGroup : undefined}
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
        isSubmitting={createService.isPending || updateService.isPending || isSyncingVariants}
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
