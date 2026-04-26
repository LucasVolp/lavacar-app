"use client";

import React, { useState } from "react";
import { App, Table, Avatar, Button, Modal, Form, Select, Tag } from "antd";
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  ShopOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { OrganizationMember } from "@/types/organization";
import {
  useUpdateOrganizationMember,
  useDeleteOrganizationMember,
  useAssignMemberToShop,
  useRemoveMemberFromShop,
} from "@/hooks/useOrganizations";
import { useOrganizationShops } from "@/hooks/useShops";
import { CustomTooltip, CustomPopconfirm } from "@/components/ui";

export type ExtendedMember = Omit<OrganizationMember, "user"> & {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
};

interface MembersListProps {
  members: ExtendedMember[];
  currentUserId?: string;
  isCurrentUserOwner?: boolean;
  organizationId: string;
  currentShopId?: string;
}

const ROLE_MAP: Record<string, string> = {
  OWNER: "Proprietário",
  ADMIN: "Administrador",
  MANAGER: "Gerente",
  EMPLOYEE: "Funcionário",
  USER: "Usuário",
};

const EDITABLE_ROLES: Record<string, string> = {
  MANAGER: "Gerente",
  EMPLOYEE: "Funcionário",
};

export const MembersList: React.FC<MembersListProps> = ({
  members,
  currentUserId,
  isCurrentUserOwner = false,
  organizationId,
  currentShopId,
}) => {
  const { message } = App.useApp();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ExtendedMember | null>(null);
  const [form] = Form.useForm();

  const updateMember = useUpdateOrganizationMember();
  const deleteMember = useDeleteOrganizationMember();
  const assignToShop = useAssignMemberToShop();
  const removeFromShop = useRemoveMemberFromShop();

  const { data: orgShops = [] } = useOrganizationShops(organizationId, isShopModalOpen || false);

  // Keep editingMember in sync when the members list refreshes after mutations
  React.useEffect(() => {
    if (!editingMember || !isShopModalOpen) return;
    const fresh = members.find((m) => m.id === editingMember.id);
    if (fresh) setEditingMember(fresh);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members, editingMember?.id, isShopModalOpen]);

  const handleEditRole = (member: ExtendedMember) => {
    setEditingMember(member);
    form.setFieldsValue({ role: member.role });
    setIsRoleModalOpen(true);
  };

  const handleManageShops = (member: ExtendedMember) => {
    setEditingMember(member);
    setIsShopModalOpen(true);
  };

  const handleUpdateRole = async (values: { role: string }) => {
    if (!editingMember) return;
    try {
      await updateMember.mutateAsync({ id: editingMember.id, payload: { role: values.role } });
      message.success("Permissões atualizadas com sucesso!");
      setIsRoleModalOpen(false);
      setEditingMember(null);
    } catch {
      message.error("Erro ao atualizar permissões.");
    }
  };

  const handleDelete = async (memberId: string) => {
    try {
      await deleteMember.mutateAsync(memberId);
      message.success("Membro removido com sucesso!");
    } catch {
      message.error("Erro ao remover membro.");
    }
  };

  const handleAssignShop = async (shopId: string) => {
    if (!editingMember) return;
    const alreadyAssigned = editingMember.managedShops?.some((sm) => sm.shopId === shopId);
    if (alreadyAssigned) return;
    try {
      await assignToShop.mutateAsync({ memberId: editingMember.id, shopId });
      message.success("Membro vinculado ao estabelecimento!");
    } catch {
      message.error("Erro ao vincular membro ao estabelecimento.");
    }
  };

  const handleRemoveShop = async (shopManagerId: string) => {
    try {
      await removeFromShop.mutateAsync(shopManagerId);
      message.success("Vínculo removido!");
    } catch {
      message.error("Erro ao remover vínculo.");
    }
  };

  const columns = [
    {
      title: "Membro",
      key: "user",
      render: (_: unknown, record: ExtendedMember) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.user?.avatarUrl}
            icon={<UserOutlined />}
            className="bg-indigo-600"
          />
          <div className="flex flex-col">
            <span className="font-medium text-zinc-900 dark:text-zinc-200">
              {record.user?.name || `Usuário ${record.userId.substring(0, 8)}...`}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-500">
              {record.user?.email || "Email não disponível"}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Função",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const roleStyles: Record<string, string> = {
          OWNER: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
          ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
          MANAGER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          EMPLOYEE: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
          USER: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${roleStyles[role] || roleStyles.USER}`}>
            {ROLE_MAP[role] || role}
          </span>
        );
      },
    },
    {
      title: "Estabelecimentos",
      key: "shops",
      render: (_: unknown, record: ExtendedMember) => {
        const shops = record.managedShops ?? [];
        if (record.role === "OWNER") {
          return (
            <span className="text-xs text-zinc-400 dark:text-zinc-500 italic">Acesso total</span>
          );
        }
        if (shops.length === 0) {
          return (
            <span className="text-xs text-zinc-400 dark:text-zinc-500">Nenhum</span>
          );
        }
        return (
          <div className="flex flex-wrap gap-1">
            {shops.map((sm) => (
              <Tag
                key={sm.id}
                className="text-xs rounded-md border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
              >
                {sm.shop?.name ?? sm.shopId.substring(0, 8)}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (isActive: boolean) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
          isActive
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          {isActive ? "Ativo" : "Inativo"}
        </span>
      ),
    },
    {
      title: "Data de Entrada",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-zinc-500 dark:text-zinc-400">
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: unknown, record: ExtendedMember) => {
        const isMemberOwner = record.role === "OWNER";
        const isCurrentUser = record.userId === currentUserId;
        const canManage = isCurrentUserOwner && !isCurrentUser;

        if (isCurrentUser) {
          return (
            <div className="flex gap-2 items-center">
              <span className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide">
                Você
              </span>
            </div>
          );
        }

        if (!canManage) return null;

        return (
          <div className="flex gap-2">
            {!isMemberOwner && !currentShopId && (
              <CustomTooltip title="Vincular a Estabelecimento">
                <Button
                  type="text"
                  icon={<ShopOutlined />}
                  className="text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
                  onClick={() => handleManageShops(record)}
                />
              </CustomTooltip>
            )}
            <CustomTooltip title="Editar Permissões">
              <Button
                type="text"
                icon={<EditOutlined />}
                className="text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
                onClick={() => handleEditRole(record)}
              />
            </CustomTooltip>
            {!isMemberOwner && (
              <CustomPopconfirm
                title="Remover membro"
                description="Tem certeza que deseja remover este membro da organização?"
                onConfirm={() => handleDelete(record.id)}
                okText="Sim"
                cancelText="Não"
                okButtonProps={{ loading: deleteMember.isPending }}
              >
                <CustomTooltip title="Remover Membro">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    className="text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
                  />
                </CustomTooltip>
              </CustomPopconfirm>
            )}
            {isMemberOwner && (
              <CustomTooltip title="Não é possível remover o proprietário">
                <Button
                  type="text"
                  disabled
                  icon={<DeleteOutlined />}
                  className="text-zinc-300 dark:text-zinc-700 opacity-50 cursor-not-allowed"
                />
              </CustomTooltip>
            )}
          </div>
        );
      },
    },
  ];

  const assignedShopIds = new Set(editingMember?.managedShops?.map((sm) => sm.shopId) ?? []);
  const availableShops = orgShops.filter((s) => !assignedShopIds.has(s.id));

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
        <Table
          dataSource={members}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 700 }}
          className="custom-table"
          locale={{
            emptyText: (
              <div className="py-8 text-zinc-500">Nenhum membro encontrado</div>
            ),
          }}
        />
      </div>

      {/* Role edit modal */}
      <Modal
        title="Editar Permissões"
        open={isRoleModalOpen}
        onCancel={() => { setIsRoleModalOpen(false); setEditingMember(null); }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateRole}
          initialValues={{ role: editingMember?.role }}
        >
          <Form.Item
            name="role"
            label="Função"
            rules={[{ required: true, message: "Selecione uma função" }]}
          >
            <Select>
              {Object.entries(EDITABLE_ROLES).map(([value, label]) => (
                <Select.Option key={value} value={value}>{label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div className="flex justify-end gap-2 mt-6">
            <Button htmlType="button" onClick={() => setIsRoleModalOpen(false)}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={updateMember.isPending}>
              Salvar Alterações
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Shop assignment modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ShopOutlined />
            <span>
              Estabelecimentos — {editingMember?.user?.name ?? "Membro"}
            </span>
          </div>
        }
        open={isShopModalOpen}
        onCancel={() => { setIsShopModalOpen(false); setEditingMember(null); }}
        footer={null}
        width={520}
      >
        <div className="space-y-5 pt-2">
          {/* Already assigned shops */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
              Vinculado a
            </p>
            {(editingMember?.managedShops?.length ?? 0) === 0 ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">
                Nenhum estabelecimento vinculado
              </p>
            ) : (
              <div className="space-y-2">
                {editingMember?.managedShops?.map((sm) => (
                  <div
                    key={sm.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      <ShopOutlined className="text-blue-600 dark:text-blue-500" />
                      {sm.shop?.name ?? sm.shopId.substring(0, 8)}
                    </span>
                    <CustomTooltip title="Remover vínculo">
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<CloseOutlined />}
                        loading={removeFromShop.isPending}
                        onClick={() => handleRemoveShop(sm.id)}
                        className="text-zinc-400 hover:text-red-500"
                      />
                    </CustomTooltip>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add to shop */}
          {availableShops.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
                Vincular a outro estabelecimento
              </p>
              <div className="space-y-2">
                {availableShops.map((shop) => (
                  <div
                    key={shop.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      <ShopOutlined className="text-zinc-400" />
                      {shop.name}
                    </span>
                    <Button
                      type="text"
                      size="small"
                      icon={<PlusOutlined />}
                      loading={assignToShop.isPending}
                      onClick={() => handleAssignShop(shop.id)}
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      Vincular
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {availableShops.length === 0 && (editingMember?.managedShops?.length ?? 0) > 0 && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">
              Este membro já está vinculado a todos os estabelecimentos disponíveis.
            </p>
          )}

          {orgShops.length === 0 && (
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Nenhum estabelecimento cadastrado nesta organização.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};
