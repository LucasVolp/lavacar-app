"use client";

import React, { useEffect } from "react";
import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  ShopOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  TeamOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { NexoLogo } from "@/components/ui/NexoLogo";

type OrgEntry = {
  id: string;
  name: string;
  slug: string;
  role: "OWNER" | "MEMBER";
  shopId?: string;
  shopName?: string;
};

export default function OrganizationSelectPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login?redirect=/organization/select");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <Spin size="large" />
      </div>
    );
  }

  const orgs: OrgEntry[] = [];

  // Orgs owned
  for (const org of user.organizations ?? []) {
    orgs.push({ id: org.id, name: org.name, slug: org.slug, role: "OWNER" });
  }

  // Orgs as member — avoid duplicating orgs already listed as owner
  const ownedIds = new Set(orgs.map((o) => o.id));
  for (const membership of user.organizationMembers ?? []) {
    if (ownedIds.has(membership.organizationId)) continue;
    const firstShop = membership.managedShops?.[0];
    orgs.push({
      id: membership.organizationId,
      name: membership.organization.name,
      slug: membership.organization.slug,
      role: "MEMBER",
      shopId: firstShop?.shopId,
      shopName: firstShop?.shop?.name,
    });
  }

  const handleSelectOrg = (entry: OrgEntry) => {
    if (entry.role === "MEMBER" && entry.shopId) {
      router.push(`/organization/${entry.id}/shop/${entry.shopId}`);
    } else {
      router.push(`/organization/${entry.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Top bar */}
      <div className="border-b border-base-content/10 px-6 h-16 flex items-center gap-3">
        <NexoLogo size={40} />
        <span className="text-base-content font-semibold text-lg tracking-tight">NexoCar</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-base-content mb-3 tracking-tight">
              Selecione um estabelecimento
            </h1>
            <p className="text-base-content/60 text-base">
              Escolha para qual negócio deseja acessar o painel.
            </p>
          </div>

          {orgs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-base-content/50 text-sm mb-6">
                Você ainda não possui nenhum estabelecimento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {orgs.map((entry) => (
                <OrgCard
                  key={entry.id}
                  entry={entry}
                  onClick={() => handleSelectOrg(entry)}
                />
              ))}
            </div>
          )}

          {/* Add org card */}
          <div
            onClick={() => router.push("/billing/checkout")}
            className="group cursor-pointer mt-2"
          >
            <div className="w-full p-6 rounded-2xl border-2 border-dashed border-base-content/20 hover:border-blue-600/60 hover:bg-blue-600/5 transition-all duration-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-base-200 border border-base-content/10 group-hover:bg-blue-600/10 group-hover:border-blue-600/20 flex items-center justify-center text-base-content/40 group-hover:text-blue-600 transition-colors flex-shrink-0">
                <PlusOutlined className="text-xl" />
              </div>
              <div>
                <p className="font-semibold text-base-content/70 group-hover:text-base-content text-sm transition-colors">
                  Adicionar novo estabelecimento
                </p>
                <p className="text-xs text-base-content/40 mt-0.5">
                  Criar uma nova organização no NexoCar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrgCard({ entry, onClick }: { entry: OrgEntry; onClick: () => void }) {
  const isOwner = entry.role === "OWNER";

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer p-6 rounded-2xl bg-base-200 border border-base-content/10 hover:border-blue-600/40 hover:bg-base-200 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-500 flex-shrink-0">
          <ShopOutlined className="text-xl" />
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${
            isOwner
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50"
          }`}
        >
          {isOwner ? <CrownOutlined /> : <TeamOutlined />}
          {isOwner ? "Proprietário" : "Membro"}
        </span>
      </div>

      <div className="flex-1 mb-4">
        <p className="font-bold text-base-content text-lg leading-tight mb-1">{entry.name}</p>
        {!isOwner && entry.shopName && (
          <p className="text-xs text-base-content/50 flex items-center gap-1">
            <ShopOutlined /> {entry.shopName}
          </p>
        )}
        {!isOwner && !entry.shopName && (
          <p className="text-xs text-base-content/50">Acesso à organização</p>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-500 group-hover:translate-x-1 transition-transform">
        Acessar <ArrowRightOutlined />
      </div>
    </div>
  );
}
