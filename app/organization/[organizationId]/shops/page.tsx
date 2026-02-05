"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useOrganization } from "@/hooks/useOrganizations";
import { ShopsHeader } from "@/components/organization/shops/ShopsHeader";
import { ShopsGrid } from "@/components/organization/shops/ShopsGrid";

export default function OrganizationShopsPage() {
  const params = useParams();
  const organizationId = params?.organizationId as string;

  const { data: organization, isLoading } = useOrganization(organizationId);
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-12 bg-zinc-800/50 rounded-lg w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
           {[1, 2, 3].map(i => (
             <div key={i} className="h-64 bg-zinc-800/50 rounded-2xl"></div>
           ))}
        </div>
      </div>
    );
  }

  if (!organization) return null;

  const shops = organization.shops || [];
  const filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-8">
      <ShopsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        createHref={`/organization/${organizationId}/shops/new`}
      />

      <ShopsGrid 
        shops={filteredShops} 
        searchTerm={searchTerm}
        createHref={`/organization/${organizationId}/shops/new`}
      />
    </div>
  );
}
