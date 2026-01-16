"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useOrganization } from "@/hooks/useOrganizations";
import { useUsers } from "@/hooks/useUsers";
import { MembersHeader } from "@/components/organization/members/MembersHeader";
import { MembersList, ExtendedMember } from "@/components/organization/members/MembersList";

export default function OrganizationMembersPage() {
  const params = useParams();
  const organizationId = params?.organizationId as string;
  const { data: organization, isLoading: isLoadingOrg } = useOrganization(organizationId);
  const { data: users, isLoading: isLoadingUsers } = useUsers();
  const [searchTerm, setSearchTerm] = React.useState("");

  const members = React.useMemo(() => {
    return (organization?.members || []).map(member => {
      const user = users?.find(u => u.id === member.userId);
      return {
        ...member,
        user: user ? {
          name: `${user.firstName} ${user.lastName || ''}`.trim(),
          email: user.email,
          avatarUrl: user.picture
        } : undefined
      };
    }) as ExtendedMember[];
  }, [organization?.members, users]);

  const filteredMembers = members.filter(member => {
    const name = member.user?.name || "Membro";
    const email = member.user?.email || member.userId;
    const search = searchTerm.toLowerCase();
    return name.toLowerCase().includes(search) || email.toLowerCase().includes(search);
  });

  if (isLoadingOrg || isLoadingUsers) {
    return (
       <div className="flex flex-col gap-4 animate-pulse">
         <div className="h-12 bg-zinc-800/50 rounded-lg w-1/3"></div>
         <div className="h-96 bg-zinc-800/50 rounded-2xl"></div>
       </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <MembersHeader 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />
      <MembersList members={filteredMembers} />
    </div>
  );
}