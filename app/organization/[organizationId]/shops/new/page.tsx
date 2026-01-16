"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useOrganization } from "@/hooks/useOrganizations";
import { CreateShopForm } from "@/components/organization/shops/CreateShopForm";

export default function CreateShopPage() {
  const params = useParams();
  const organizationId = params?.organizationId as string;
  const { data: organization, isLoading } = useOrganization(organizationId);

  if (isLoading) {
    return <div className="p-8 text-center text-zinc-500">Carregando...</div>;
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-20">
      <CreateShopForm 
        organizationId={organizationId} 
        ownerId={organization?.ownerId} 
      />
    </div>
  );
}
