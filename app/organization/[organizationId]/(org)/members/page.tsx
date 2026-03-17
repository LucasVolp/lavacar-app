"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useOrganizationMembers } from "@/hooks/useOrganizations";
import { useAuth } from "@/contexts/AuthContext";
import { MembersHeader } from "@/components/organization/members/MembersHeader";
import { MembersList, ExtendedMember } from "@/components/organization/members/MembersList";

export default function OrganizationMembersPage() {
  const params = useParams();
  const organizationId = params?.organizationId as string;
  const { user: currentUser } = useAuth();
  const { data: members = [], isLoading: isLoadingMembers } = useOrganizationMembers(organizationId);
  const [searchTerm, setSearchTerm] = React.useState("");

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
        <div className="h-12 bg-zinc-800/50 rounded-lg w-1/3" />
        <div className="h-96 bg-zinc-800/50 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <MembersHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <MembersList members={filteredMembers} currentUserId={currentUser?.id} />
    </div>
  );
}
