"use client";

import React, { useState } from "react";
import { Input, Spin, Empty, Typography, Segmented, Badge, Pagination } from "antd";
import { SearchOutlined, AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useShopClientsByShop } from "@/hooks/useShopClients";
import { ClientsHeader } from "@/components/admin/shop/clients/ClientsHeader";
import { ClientCard } from "@/components/admin/shop/clients/ClientCard";
import { ClientsTable } from "@/components/admin/shop/clients/ClientsTable";
import { ClientDetailDrawer } from "@/components/admin/shop/clients/ClientDetailDrawer";
import { ShopClient } from "@/types/shopClient";
import { useDebouncedValue } from "@/hooks";

const { Text } = Typography;

export default function ClientsPage() {
  const { shopId, isLoading: isLoadingShop } = useShopAdmin();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selectedClient, setSelectedClient] = useState<ShopClient | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(searchTerm, 300);
  
  const { data: clientsData, isLoading: isLoadingClients } = useShopClientsByShop(shopId, {
    page,
    perPage,
    search: debouncedSearch || undefined,
  });

  const isLoading = isLoadingShop || isLoadingClients;
  const clients = clientsData?.data ?? [];
  const meta = clientsData?.meta;

  const handleViewClient = (client: ShopClient) => {
    setSelectedClient(client);
    setDrawerOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPageSize && newPageSize !== perPage) {
      setPerPage(newPageSize);
    }
  };

  if (isLoading && !clientsData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando clientes..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <ClientsHeader totalClients={meta?.total ?? 0} />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Input
          placeholder="Buscar por nome, email ou telefone..."
          prefix={<SearchOutlined className="text-zinc-400" />}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-md"
          size="large"
          allowClear
        />
        
        <div className="flex items-center gap-4">
          <Text type="secondary" className="text-sm whitespace-nowrap">
            <Badge 
              count={meta?.total ?? 0} 
              showZero 
              style={{ backgroundColor: '#6366f1' }}
              className="mr-2"
            />
            <span className="ml-1">{meta?.total === 1 ? "cliente encontrado" : "clientes encontrados"}</span>
          </Text>
          
          <Segmented
            value={viewMode}
            onChange={(value) => setViewMode(value as "cards" | "table")}
            options={[
              { value: "cards", icon: <AppstoreOutlined /> },
              { value: "table", icon: <BarsOutlined /> },
            ]}
          />
        </div>
      </div>

      {clients.length === 0 ? (
        <Empty
          description={
            searchTerm 
              ? "Nenhum cliente encontrado com esses critérios" 
              : "Nenhum cliente cadastrado ainda"
          }
          className="py-20"
        />
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {clients.map((client) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              onClick={() => handleViewClient(client)}
            />
          ))}
        </div>
      ) : (
        <ClientsTable 
          clients={clients} 
          onViewClient={handleViewClient}
        />
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            current={page}
            pageSize={perPage}
            total={meta.total}
            onChange={handlePageChange}
            showSizeChanger
            showTotal={(total, range) => `${range[0]}-${range[1]} de ${total} clientes`}
            pageSizeOptions={["12", "24", "48", "96"]}
          />
        </div>
      )}

      <ClientDetailDrawer
        client={selectedClient}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedClient(null);
        }}
        shopId={shopId}
      />
    </div>
  );
}
