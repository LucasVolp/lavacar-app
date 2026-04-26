"use client";

import Link from "next/link";
import { Button } from "antd";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import type { OrganizationShopOverview } from "@/types/organization";
import { OrganizationShopCard } from "./OrganizationShopCard";

interface OrganizationShopsCardsGridProps {
  shops: OrganizationShopOverview[];
  searchTerm?: string;
  createHref?: string;
  onCreateShop?: () => void;
  canDelete?: boolean;
  onDelete?: (shopId: string) => void;
}

export function OrganizationShopsCardsGrid({
  shops,
  searchTerm,
  createHref,
  onCreateShop,
  canDelete,
  onDelete,
}: OrganizationShopsCardsGridProps) {
  if (shops.length === 0) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-3xl p-8 sm:p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mb-4 text-zinc-400 dark:text-zinc-600">
          <InboxOutlined style={{ fontSize: "32px" }} />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-200 mb-2">
          {searchTerm ? "Nenhum estabelecimento encontrado" : "Nenhum estabelecimento cadastrado"}
        </h3>
        <p className="text-zinc-500 max-w-sm mb-8">
          {searchTerm
            ? "Tente buscar por outro termo."
            : "Adicione seu primeiro estabelecimento para começar."}
        </p>
        {!searchTerm &&
          (createHref ? (
            <Link href={createHref}>
              <Button type="primary" size="large" icon={<PlusOutlined />}>
                Adicionar Primeiro Shop
              </Button>
            </Link>
          ) : (
            <Button type="primary" size="large" icon={<PlusOutlined />} onClick={onCreateShop}>
              Adicionar Primeiro Shop
            </Button>
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shops.map((shop) => (
        <OrganizationShopCard
          key={shop.id}
          shop={shop}
          canDelete={canDelete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
