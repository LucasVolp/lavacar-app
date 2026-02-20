"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { useOrganization } from "@/hooks/useOrganizations";
import { ShopWizard } from "@/components/organization/shops/ShopWizard";

function CreateShopContent() {
  const params = useParams();
  const organizationId = params?.organizationId as string;
  const { data: organization, isLoading } = useOrganization(organizationId);

  if (isLoading) {
    return <div className="p-8 text-center text-zinc-500">Carregando...</div>;
  }

  return (
    <div className="animate-fade-in">
      <ShopWizard
        organizationId={organizationId}
        ownerId={organization?.ownerId}
      />
    </div>
  );
}

export default function CreateShopPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500">Carregando...</div>}>
      <CreateShopContent />
    </Suspense>
  );
}
