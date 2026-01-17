"use client";

import React from "react";
import { Typography, Spin, Card, Input } from "antd";
import { TeamOutlined, SearchOutlined } from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useOrganizationMembers } from "@/hooks/useOrganizations";
import { useUsers } from "@/hooks/useUsers";
import { MembersList, ExtendedMember } from "@/components/organization/members/MembersList";

const { Title, Text } = Typography;

export default function ShopEmployeesPage() {
  const { shop, isLoading: isLoadingShop } = useShopAdmin();
  const [searchTerm, setSearchTerm] = React.useState("");
  
  // Fetch members of the organization that owns this shop
  const { data: members = [], isLoading: isLoadingMembers } = useOrganizationMembers(shop?.organizationId);
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();

  const isLoading = isLoadingShop || isLoadingMembers || isLoadingUsers;

  const extendedMembers = React.useMemo(() => {
    return members.map(member => {
      const user = users.find(u => u.id === member.userId);
      return {
        ...member,
        user: user ? {
          name: `${user.firstName} ${user.lastName || ''}`.trim(),
          email: user.email,
          avatarUrl: user.picture
        } : undefined
      };
    }) as ExtendedMember[];
  }, [members, users]);

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
      {/* Header Section */}
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
             Gerencie a equipe que tem acesso a este estabelecimento. Os membros são herdados da organização.
           </Text>
        </div>
      </div>

      <div className="space-y-4">
      <Card bordered={false} className="!rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
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
            
            <div className="flex gap-2">
               {/* Future: Add Invite Button specific for Shop? Or redirect to Org Members? */}
               {/* For now, just show the list, maybe a button to go to Org settings */}
            </div>
         </div>
      </Card>
      </div>
      
      <MembersList members={filteredMembers} />
    </div>
  );
}