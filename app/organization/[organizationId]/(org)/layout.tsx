"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Spin, Result, Button } from "antd";
import { OrganizationLayout } from "@/components/layout/OrganizationLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganization } from "@/hooks/useOrganizations";

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const organizationId = params?.organizationId as string;
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: organization, isLoading: orgLoading, isError } = useOrganization(organizationId);

  if (authLoading || orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Verificando permissões..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    setTimeout(() => router.push(`/auth/login?redirect=/organization/${organizationId}`), 0);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !organization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <Result
          status="404"
          title="Organização não encontrada"
          subTitle="A organização que você está tentando acessar não existe ou foi removida."
          extra={<Button type="primary" onClick={() => router.push("/")}>Voltar ao Início</Button>}
        />
      </div>
    );
  }

  const isOwner = organization.ownerId === user?.id;
  const isMember = organization.members?.some((m: { userId: string }) => m.userId === user?.id);

  if (!isOwner && !isMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <Result
          status="403"
          title="Acesso Negado"
          subTitle="Você não tem permissão para gerenciar esta organização."
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

  return (
    <OrganizationLayout>
      {children}
    </OrganizationLayout>
  );
}
