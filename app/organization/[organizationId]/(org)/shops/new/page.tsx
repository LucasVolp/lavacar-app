"use client";

import React, { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrganization } from "@/hooks/useOrganizations";
import { useAuth } from "@/contexts/AuthContext";
import { ShopWizard } from "@/components/organization/shops/ShopWizard";
import { Result, Button } from "antd";

function CreateShopContent() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params?.organizationId as string;
  const { user } = useAuth();
  const { data: organization, isLoading } = useOrganization(organizationId);

  if (isLoading) {
    return <div className="p-8 text-center text-zinc-500">Carregando...</div>;
  }

  const canCreate = user && organization && (user.id === organization.ownerId || user.role === "ADMIN");

  if (!canCreate) {
    return (
      <Result
        status="403"
        title="Acesso negado"
        subTitle="Somente o proprietário da organização pode criar novos estabelecimentos."
        extra={
          <Button type="primary" onClick={() => router.push(`/organization/${organizationId}/shops`)}>
            Voltar para Shops
          </Button>
        }
      />
    );
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
