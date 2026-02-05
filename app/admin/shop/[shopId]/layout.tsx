"use client";

import React from "react";
import { ShopAdminProvider, useShopAdmin } from "@/contexts/ShopAdminContext";
import { ShopLayout } from "@/components/layout/ShopLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganization } from "@/hooks/useOrganizations";
import { useRouter } from "next/navigation";
import { Spin, Result, Button } from "antd";

function ShopAdminGuard({ children }: { children: React.ReactNode }) {
  const { shop, isLoading: shopLoading, error: shopError } = useShopAdmin();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Fetch organization to verify hierarchy permissions
  const { data: organization, isLoading: orgLoading } = useOrganization(shop?.organizationId);

  const isLoading = authLoading || shopLoading || (!!shop && orgLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Verificando permissões..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    if (typeof window !== "undefined") {
       router.push(`/auth/login?redirect=${window.location.pathname}`);
    }
    return (
        <div className="min-h-screen flex items-center justify-center">
          <Spin size="large" />
        </div>
    );
  }

  if (shopError || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <Result 
          status="404" 
          title="Loja não encontrada" 
          subTitle="Não foi possível carregar os dados desta loja."
          extra={<Button type="primary" onClick={() => router.push("/")}>Voltar</Button>}
        />
      </div>
    );
  }

  // Permission Logic
  const isDirectOwner = shop.ownerId === user?.id;
  const isOrgOwner = organization?.ownerId === user?.id;
  const isOrgMember = organization?.members?.some((m: { userId: string }) => m.userId === user?.id);

  const hasAccess = isDirectOwner || isOrgOwner || isOrgMember;

  if (!hasAccess) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
            <Result
            status="403"
            title="Acesso Negado"
            subTitle="Você não tem permissão para administrar esta loja."
            extra={
                <div className="flex gap-4 justify-center">
                    <Button onClick={() => router.push("/")}>Voltar</Button>
                    <Button type="primary" onClick={() => router.push("/auth/login")}>Trocar de Conta</Button>
                </div>
            }
            />
        </div>
     );
  }

  return <ShopLayout>{children}</ShopLayout>;
}

export default function ShopAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShopAdminProvider>
      <ShopAdminGuard>{children}</ShopAdminGuard>
    </ShopAdminProvider>
  );
}
