"use client";

import React from "react";
import { OrganizationLayout } from "@/components/layout/OrganizationLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganization } from "@/hooks/useOrganizations";
import { useParams, useRouter } from "next/navigation";
import { Spin, Result, Button } from "antd";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const organizationId = params?.organizationId as string;
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: organization, isLoading: orgLoading, isError } = useOrganization(organizationId);
  const router = useRouter();

  if (authLoading || orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Verificando permissões..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to login
    // We use setTimeout to avoid render interruption issues during redirect
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

  // Check ownership (ownerId) or membership
  const isOwner = organization.ownerId === user?.id;
  // Use 'any' for member temporarily if type definition is partial, but usually Organization includes members
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
