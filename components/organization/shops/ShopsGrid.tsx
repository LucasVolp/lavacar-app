"use client";

import React from "react";
import { 
  ShopOutlined, 
  PlusOutlined, 
  EnvironmentOutlined,
  SettingOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shop, SHOP_STATUS_MAP } from "@/types/shop";

interface ShopsGridProps {
  shops: Shop[];
  onCreateShop?: () => void;
  createHref?: string;
  searchTerm?: string;
}

export const ShopsGrid: React.FC<ShopsGridProps> = ({
  shops,
  onCreateShop,
  createHref,
  searchTerm,
}) => {
  const router = useRouter();

  if (shops.length === 0) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mb-4 text-zinc-400 dark:text-zinc-600">
          <ShopOutlined style={{ fontSize: "32px" }} />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-200 mb-2">
          {searchTerm ? "Nenhum shop encontrado" : "Nenhum shop cadastrado"}
        </h3>
        <p className="text-zinc-500 max-w-sm mb-8">
          {searchTerm
            ? "Tente buscar por outro termo."
            : "Adicione seu primeiro estabelecimento para começar."}
        </p>
        {!searchTerm && (
          createHref ? (
            <Link href={createHref}>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
              >
                Adicionar Primeiro Shop
              </Button>
            </Link>
          ) : (
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={onCreateShop}
            >
              Adicionar Primeiro Shop
            </Button>
          )
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shops.map((shop) => {
        const statusInfo = SHOP_STATUS_MAP[shop.status];

        return (
          <div
            key={shop.id}
            className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300 flex flex-col h-full hover:shadow-xl shadow-sm dark:shadow-none hover:shadow-black/5 dark:hover:shadow-black/20"
          >
            {/* Visual Header / Cover */}
            <div className="h-40 bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden group-hover:opacity-90 transition-opacity">
              <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700 opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center text-zinc-300 dark:text-zinc-600">
                <ShopOutlined style={{ fontSize: "48px", opacity: 0.2 }} />
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-2 py-1 rounded bg-white/60 dark:bg-black/40 backdrop-blur text-xs font-semibold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/10">
                  {statusInfo.label}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors line-clamp-1">
                  {shop.name}
                </h3>
              </div>

              <div className="flex items-start gap-2 text-sm text-zinc-500 dark:text-zinc-500 mb-6 min-h-[40px]">
                <EnvironmentOutlined className="mt-1" />
                <span className="line-clamp-2">
                  {shop.street
                    ? `${shop.street}, ${shop.number} - ${shop.neighborhood}, ${shop.city}/${shop.state}`
                    : `${shop.city}, ${shop.state}`}
                </span>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm font-medium"
                  onClick={() => router.push(`/admin/shop/${shop.id}/settings`)}
                >
                  <SettingOutlined /> Configurar
                </button>
                <button
                  onClick={() => router.push(`/admin/shop/${shop.id}`)}
                  className="flex items-center justify-center gap-2 p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors text-sm font-medium shadow-lg shadow-indigo-900/20"
                >
                  Gerenciar <ArrowRightOutlined />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
