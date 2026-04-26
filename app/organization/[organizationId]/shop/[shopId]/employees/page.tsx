"use client";

import React, { useState } from "react";
import { Typography, Spin, Card, Input, Button, Tabs, Table, Popconfirm, message } from "antd";
import { TeamOutlined, SearchOutlined, UserAddOutlined, DeleteOutlined } from "@ant-design/icons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useOrganizationMembersByShop } from "@/hooks/useOrganizations";
import { useAuth } from "@/contexts/AuthContext";
import { MembersList, ExtendedMember } from "@/components/organization/members/MembersList";
import { MemberStatsCards } from "@/components/organization/members/MemberStatsCards";
import { InviteEmployeeModal } from "@/components/admin/shop/employees";
import { useListInvites, useRevokeInvite } from "@/hooks/useOrganizationInvites";

const { Title, Text } = Typography;

const InvitesTab = ({ organizationId, shopId }: { organizationId: string, shopId: string }) => {
  const { data: invites = [], isLoading } = useListInvites(organizationId, shopId);
  const { mutateAsync: revokeInvite, isPending } = useRevokeInvite();

  const handleRevoke = async (inviteId: string) => {
    try {
      await revokeInvite({ organizationId, inviteId, shopId });
      message.success("Convite revogado com sucesso!");
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || "Erro ao revogar convite");
    }
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Função",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const labels: Record<string, string> = {
          EMPLOYEE: "Funcionário",
          MANAGER: "Gerente",
        };
        return labels[role] || role;
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: { expiresAt: string | Date; status: string }) => {
        const isExpired = new Date(record.expiresAt) < new Date();
        const resolvedStatus = isExpired && status === "PENDING" ? "EXPIRED" : status;
        return <StatusBadge status={resolvedStatus} />;
      }
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: unknown, record: { id: string; expiresAt: string | Date; status: string }) => {
        const isExpired = new Date(record.expiresAt) < new Date();
        if (record.status !== "PENDING" || isExpired) return null;
        return (
          <Popconfirm
            title="Revogar convite"
            description="Tem certeza que deseja revogar este convite?"
            onConfirm={() => handleRevoke(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button danger type="text" icon={<DeleteOutlined />} loading={isPending} />
          </Popconfirm>
        );
      }
    }
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <Table
        dataSource={invites}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 500 }}
        className="[&_.ant-table]:!bg-transparent [&_.ant-table-cell]:!bg-transparent"
      />
    </div>
  );
};

export default function ShopEmployeesPage() {
  const { shop, isLoading: isLoadingShop } = useShopAdmin();
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { data: members = [], isLoading: isLoadingMembers } = useOrganizationMembersByShop(shop?.id);

  const isLoading = isLoadingShop || isLoadingMembers;
  const isCurrentUserOwner = currentUser?.id === shop?.ownerId || currentUser?.role === "ADMIN";

  const orgMembership = currentUser?.organizationMembers?.find(
    (m) => m.organizationId === shop?.organizationId,
  );
  const canInvite = isCurrentUserOwner || orgMembership?.role === "MANAGER";

  const extendedMembers = React.useMemo(() => {
    if (!Array.isArray(members)) return [];

    return members.map(member => ({
      ...member,
      user: member.user ? {
        name: `${member.user.firstName} ${member.user.lastName || ''}`.trim(),
        email: member.user.email,
        avatarUrl: member.user.picture
      } : undefined
    })) as ExtendedMember[];
  }, [members]);

  const filteredMembers = extendedMembers.filter(member => {
    const name = member.user?.name || "Membro";
    const email = member.user?.email || member.userId;
    const search = searchTerm.toLowerCase();
    return name.toLowerCase().includes(search) || email.toLowerCase().includes(search);
  });

  const managerCount = Array.isArray(members) ? members.filter((m) => m.role === "MANAGER").length : 0;
  const employeeCount = Array.isArray(members) ? members.filter((m) => m.role === "EMPLOYEE").length : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando funcionários..." />
      </div>
    );
  }

  const items = [
    {
      key: "members",
      label: "Membros",
      children: (
        <div className="space-y-4">
          <Card variant={"outlined"} className="!rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
             <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <Input
                  placeholder="Buscar por nome ou email..."
                  prefix={<SearchOutlined className="text-zinc-400" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:max-w-sm"
                  size="large"
                  allowClear
                />

                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {filteredMembers.length} {filteredMembers.length === 1 ? "membro" : "membros"} encontrado{filteredMembers.length !== 1 && "s"}
                </div>
             </div>
          </Card>
          <div className="mt-8 space-y-4">
            <MembersList
            members={filteredMembers}
            currentUserId={currentUser?.id}
            isCurrentUserOwner={isCurrentUserOwner}
            organizationId={shop?.organizationId ?? ""}
            currentShopId={shop?.id}
            />
          </div>
        </div>
      ),
    },
  ];

  if (canInvite && shop?.organizationId && shop?.id) {
    items.push({
      key: "invites",
      label: "Convites",
      children: <InvitesTab organizationId={shop.organizationId} shopId={shop.id} />,
    });
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-lg text-rose-600 dark:text-rose-400">
                <TeamOutlined className="text-xl" />
             </div>
             <Title level={2} className="!m-0 !font-bold dark:!text-white">
               Funcionários
             </Title>
           </div>
           <Text className="text-zinc-500 dark:text-zinc-400 max-w-2xl block mt-2">
             Gerencie a equipe que tem acesso a este estabelecimento. Convide novos membros ou gerencie as permissões existentes.
           </Text>
        </div>
        {canInvite && (
          <Button
            type="primary"
            size="large"
            icon={<UserAddOutlined />}
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 border-none shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 min-h-[44px] px-6 font-medium rounded-xl w-full md:w-auto"
          >
            Convidar Funcionário
          </Button>
        )}
      </div>

      <MemberStatsCards
        totalMembers={Array.isArray(members) ? members.length : 0}
        managerCount={managerCount}
        employeeCount={employeeCount}
      />

      <Tabs items={items} defaultActiveKey="members" className="[&_.ant-tabs-nav]:mb-6" />

      <InviteEmployeeModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        shopName={shop?.name}
        shopId={shop?.id}
        organizationId={shop?.organizationId}
        canInviteManager={isCurrentUserOwner}
      />
    </div>
  );
}