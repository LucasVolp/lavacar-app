"use client";

import React from "react";
import { Typography, Spin } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useOrganizationMembers } from "@/hooks/useOrganizations";
import { useUsers } from "@/hooks/useUsers";
import { MembersList, ExtendedMember } from "@/components/organization/members/MembersList";

const { Title, Text } = Typography;

export default function ShopEmployeesPage() {
  const { shop, shopId, isLoading: isLoadingShop } = useShopAdmin();
  
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando funcionários..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title level={3} className="!mb-1 flex items-center gap-2">
          <TeamOutlined className="text-blue-500" />
          Funcionários
        </Title>
        <Text type="secondary">
          Visualize os membros da organização disponíveis para este estabelecimento.
        </Text>
      </div>

      {/* List */}
      <MembersList members={extendedMembers} />
    </div>
  );
}
