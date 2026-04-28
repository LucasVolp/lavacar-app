"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Button, Popconfirm, Table, Tabs, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useOrganizationMembers } from "@/hooks/useOrganizations";
import { useOrganization } from "@/hooks/useOrganizations";
import { useOrganizationShops } from "@/hooks/useShops";
import { useAuth } from "@/contexts/AuthContext";
import { useListInvites, useRevokeInvite } from "@/hooks/useOrganizationInvites";
import { MembersHeader } from "@/components/organization/members/MembersHeader";
import { MembersList, ExtendedMember } from "@/components/organization/members/MembersList";
import { MemberStatsCards } from "@/components/organization/members/MemberStatsCards";
import { InviteEmployeeModal } from "@/components/admin/shop/employees";
import { StatusBadge } from "@/components/ui/StatusBadge";

const OrgInvitesTab = ({ organizationId }: { organizationId: string }) => {
  const { data: invites = [], isLoading } = useListInvites(organizationId);
  const { mutateAsync: revokeInvite, isPending } = useRevokeInvite();

  const handleRevoke = async (inviteId: string) => {
    try {
      await revokeInvite({ organizationId, inviteId });
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
      width: 240,
      render: (email: string) => (
        <span className="block truncate max-w-[220px] text-zinc-800 dark:text-zinc-200" title={email}>
          {email}
        </span>
      ),
    },
    {
      title: "Função",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) => {
        const labels: Record<string, string> = { EMPLOYEE: "Funcionário", MANAGER: "Gerente" };
        return <span className="whitespace-nowrap">{labels[role] || role}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string, record: { expiresAt: string | Date; status: string }) => {
        const isExpired = new Date(record.expiresAt) < new Date();
        const resolvedStatus = isExpired && status === "PENDING" ? "EXPIRED" : status;
        return <StatusBadge status={resolvedStatus} />;
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: 80,
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
            <Button danger type="text" icon={<DeleteOutlined />} loading={isPending} className="min-h-[44px] w-11" />
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden w-full overflow-x-auto">
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

export default function OrganizationMembersPage() {
  const params = useParams();
  const organizationId = params?.organizationId as string;
  const { user: currentUser } = useAuth();
  const { data: organization } = useOrganization(organizationId);
  const { data: members = [], isLoading: isLoadingMembers } = useOrganizationMembers(organizationId);
  const { data: shopsData } = useOrganizationShops(organizationId);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);

  const isCurrentUserOwner =
    organization?.ownerId === currentUser?.id ||
    currentUser?.role === "ADMIN";

  const managerCount = members.filter((m) => m.role === "MANAGER").length;
  const employeeCount = members.filter((m) => m.role === "EMPLOYEE").length;
  const shopCount = Array.isArray(shopsData) ? shopsData.length : (shopsData as { data?: unknown[] } | undefined)?.data?.length ?? 0;

  const currentMembership = currentUser?.organizationMembers?.find(
    (m) => m.organizationId === organizationId,
  );
  const canInvite = isCurrentUserOwner || currentMembership?.role === "MANAGER";

  const extendedMembers = React.useMemo(() => {
    return members.map((member) => ({
      ...member,
      user: member.user
        ? {
            name: `${member.user.firstName} ${member.user.lastName || ""}`.trim(),
            email: member.user.email,
            avatarUrl: member.user.picture,
          }
        : undefined,
    })) as ExtendedMember[];
  }, [members]);

  const filteredMembers = extendedMembers.filter((member) => {
    const name = member.user?.name || "Membro";
    const email = member.user?.email || member.userId;
    const search = searchTerm.toLowerCase();
    return name.toLowerCase().includes(search) || email.toLowerCase().includes(search);
  });

  if (isLoadingMembers) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-12 bg-zinc-800/50 rounded-lg w-full sm:w-1/2 md:w-1/3" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-zinc-800/50 rounded-2xl" />)}
        </div>
        <div className="h-96 bg-zinc-800/50 rounded-2xl" />
      </div>
    );
  }

  const tabItems = [
    {
      key: "members",
      label: "Membros",
      children: (
        <MembersList
          members={filteredMembers}
          currentUserId={currentUser?.id}
          isCurrentUserOwner={isCurrentUserOwner}
          organizationId={organizationId}
        />
      ),
    },
    ...(canInvite ? [{
      key: "invites",
      label: "Convites",
      children: <OrgInvitesTab organizationId={organizationId} />,
    }] : []),
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <MembersHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onInvite={canInvite ? () => setIsInviteOpen(true) : undefined}
      />
      <MemberStatsCards
        totalMembers={members.length}
        managerCount={managerCount}
        employeeCount={employeeCount}
        shopCount={shopCount}
      />
      <Tabs
        items={tabItems}
        defaultActiveKey="members"
        className="[&_.ant-tabs-nav]:mb-6"
      />
      <InviteEmployeeModal
        open={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        organizationId={organizationId}
        canInviteManager={isCurrentUserOwner}
      />
    </div>
  );
}
