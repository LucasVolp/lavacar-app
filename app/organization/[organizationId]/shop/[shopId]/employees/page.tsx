"use client";

import React, { useState } from "react";
import { Typography, Spin, Card, Input, Button } from "antd";
import { TeamOutlined, SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useOrganizationMembersByShop } from "@/hooks/useOrganizations";
import { useAuth } from "@/contexts/AuthContext";
import { MembersList, ExtendedMember } from "@/components/organization/members/MembersList";
import { InviteEmployeeModal } from "@/components/admin/shop/employees";

const { Title, Text } = Typography;

export default function ShopEmployeesPage() {
  const { shop, isLoading: isLoadingShop } = useShopAdmin();
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { data: members = [], isLoading: isLoadingMembers } = useOrganizationMembersByShop(shop?.id);

  const isLoading = isLoadingShop || isLoadingMembers;

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando funcionários..." />
      </div>
    );
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
        <Button
          type="primary"
          size="large"
          icon={<UserAddOutlined />}
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 border-none shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 h-11 px-6 font-medium rounded-xl"
        >
          Convidar Funcionário
        </Button>
      </div>

      <div className="space-y-4">
      <Card variant={"outlined"} className="!rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
         <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <Input
              placeholder="Buscar por nome ou email..."
              prefix={<SearchOutlined className="text-zinc-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-96"
              size="large"
              allowClear
            />

            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {filteredMembers.length} {filteredMembers.length === 1 ? "membro" : "membros"} encontrado{filteredMembers.length !== 1 && "s"}
            </div>
         </div>
      </Card>
      </div>

      <MembersList
        members={filteredMembers}
        currentUserId={currentUser?.id}
        isCurrentUserOwner={currentUser?.id === shop?.ownerId}
      />

      <InviteEmployeeModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        shopName={shop?.name}
      />
    </div>
  );
}