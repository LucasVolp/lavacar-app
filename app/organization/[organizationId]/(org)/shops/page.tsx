"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { message } from "antd";
import { useOrganizationDashboardMetrics, useOrganization } from "@/hooks/useOrganizations";
import { useAuth } from "@/contexts";
import { useDeleteShop } from "@/hooks/shop/useDeleteShop";
import { ShopsHeader } from "@/components/organization/shops/ShopsHeader";
import { ShopsGrid } from "@/components/organization/shops/ShopsGrid";

export default function OrganizationShopsPage() {
  const params = useParams();
  const organizationId = params?.organizationId as string;
  const { user } = useAuth();

  const { data: dashboardMetrics, isLoading } = useOrganizationDashboardMetrics(organizationId, {
    period: "30d",
  });
  const { data: organization } = useOrganization(organizationId);
  const deleteShop = useDeleteShop();
  const [searchTerm, setSearchTerm] = useState("");

  const canCreate = !!(user && organization && (user.id === organization.ownerId || user.role === "ADMIN"));
  const canDelete = !!(user && organization && (user.id === organization.ownerId || user.role === "ADMIN"));

  const handleDeleteShop = async (shopId: string) => {
    try {
      await deleteShop.mutateAsync(shopId);
      message.success("Estabelecimento excluído com sucesso.");
    } catch {
      message.error("Erro ao excluir estabelecimento. Tente novamente.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-12 bg-zinc-800/50 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-64 bg-zinc-800/50 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardMetrics) return null;

  const shops = (dashboardMetrics.shops || []).map((shop) => ({ ...shop, organizationId }));
  const filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="animate-fade-in space-y-8">
      <ShopsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        createHref={canCreate ? `/organization/${organizationId}/shops/new` : undefined}
      />

      <ShopsGrid
        shops={filteredShops}
        searchTerm={searchTerm}
        createHref={canCreate ? `/organization/${organizationId}/shops/new` : undefined}
        canDelete={canDelete}
        onDelete={handleDeleteShop}
      />
    </div>
  );
}
