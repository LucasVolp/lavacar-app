"use client";

import React from "react";
import { Button } from "antd";
import { 
  ShopOutlined, 
  InboxOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Shop } from "@/types/shop";

interface RecentShopsProps {
  shops: Shop[];
  organizationId: string;
}

export const RecentShops: React.FC<RecentShopsProps> = ({ shops, organizationId }) => {
  const router = useRouter();

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Lojas da Organização</h2>
      </div>

      {shops.length === 0 ? (
        // Empty State
        <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mb-6 text-zinc-400 dark:text-zinc-600">
            <InboxOutlined style={{ fontSize: "48px" }} />
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
            Nenhum estabelecimento encontrado
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-8">
            Você ainda não tem lojas cadastradas nesta organização. Comece
            adicionando sua primeira unidade para gerenciar agendamentos.
          </p>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => router.push(`/organization/${organizationId}/shops?create=true`)}
          >
            Adicionar Primeiro Shop
          </Button>
        </div>
      ) : (
        // Shops Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300 flex flex-col h-full hover:shadow-xl shadow-sm dark:shadow-none hover:shadow-black/5 dark:hover:shadow-black/20"
            >
              {/* Visual Header / Cover */}
              <div className="h-40 bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                {/* If shop has image, show it. Otherwise pattern */}
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700 opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center text-zinc-300 dark:text-zinc-600">
                  <ShopOutlined style={{ fontSize: "48px", opacity: 0.2 }} />
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 rounded bg-white/60 dark:bg-black/40 backdrop-blur text-xs font-semibold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/10">
                    ATIVO
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
                    <span className="line-clamp-2">{shop.street ? `${shop.street}, ${shop.number} - ${shop.neighborhood}, ${shop.city}/${shop.state}` : "Endereço não informado"}</span>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push(`/admin/shop/${shop.id}/settings`)}
                    className="flex items-center justify-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm font-medium"
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
          ))}
        </div>
      )}
    </section>
  );
};
