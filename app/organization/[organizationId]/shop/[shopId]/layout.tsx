"use client";

import React from "react";
import { ShopAdminProvider, useShopAdmin } from "@/contexts/ShopAdminContext";
import { ShopLayout } from "@/components/layout/ShopLayout";
import { ShopAccessDenied } from "@/components/layout/ShopAccessDenied";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { Spin, Result, Button } from "antd";
import axios from "axios";

function ShopAdminGuard({ children }: { children: React.ReactNode }) {
  const { shop, isLoading: shopLoading, error: shopError } = useShopAdmin();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const organizationId = params?.organizationId as string | undefined;

  const isLoading = authLoading || shopLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Verificando permissões..." />
      </div>
    );
  }

  if (!isAuthenticated) {
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
    const is403 = axios.isAxiosError(shopError) && shopError.response?.status === 403;

    if (is403) {
      return <ShopAccessDenied organizationId={organizationId} />;
    }

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

  // Check access using auth context data (already loaded from /me — no extra API call)
  const orgId = shop.organizationId;
  const isDirectOwner = shop.ownerId === user?.id;
  const isOrgOwner = user?.organizations?.some((org) => org.id === orgId);
  const isOrgMember = user?.organizationMembers?.some((m) => m.organizationId === orgId);

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
