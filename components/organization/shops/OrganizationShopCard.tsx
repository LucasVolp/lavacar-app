"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, Badge, Button, Popconfirm } from "antd";
import {
  ArrowRightOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  ShopOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { OrganizationShopOverview } from "@/types/organization";

interface OrganizationShopCardProps {
  shop: OrganizationShopOverview;
  canDelete?: boolean;
  onDelete?: (shopId: string) => void;
}

export function OrganizationShopCard({ shop, canDelete, onDelete }: OrganizationShopCardProps) {
  const router = useRouter();

  return (
    <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-md">
      <div className="relative h-32 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        {shop.bannerUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${shop.bannerUrl})` }}
            aria-label={`Banner ${shop.name}`}
            role="img"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700" />
        )}

        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute top-3 right-3">
          <Badge
            status={shop.isOpenNow ? "success" : "default"}
            text={shop.isOpenNow ? "Aberto" : "Fechado"}
            className="px-2 py-1 rounded-md bg-white/90 dark:bg-zinc-950/80 backdrop-blur text-xs font-semibold"
          />
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden flex items-center justify-center shrink-0">
            {shop.logoUrl ? (
              <Avatar
                src={shop.logoUrl}
                alt={`Logo ${shop.name}`}
                size={44}
                shape="square"
                className="!rounded-none object-cover w-full h-full"
              />
            ) : (
              <ShopOutlined className="text-zinc-400" />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">{shop.name}</h3>
            <div className="flex items-start gap-1 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              <EnvironmentOutlined className="mt-0.5 shrink-0" />
              <span className="line-clamp-1">{shop.city}/{shop.state}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <CalendarOutlined className="text-blue-500 dark:text-blue-400 text-xs" />
              <span className="text-[11px] font-medium text-blue-600/80 dark:text-blue-400/80 uppercase tracking-wider">Hoje</span>
            </div>
            <p className="m-0 text-lg font-bold text-blue-700 dark:text-blue-300 leading-tight">
              {shop.appointmentsToday}
            </p>
            <p className="m-0 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              {shop.appointmentsToday === 1 ? "agendamento" : "agendamentos"}
            </p>
          </div>

          <div className={`rounded-xl border p-3 ${
            shop.inProgressNow > 0
              ? "border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-emerald-950/20"
              : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/30"
          }`}>
            <div className="flex items-center gap-1.5 mb-1">
              <ThunderboltOutlined className={`text-xs ${
                shop.inProgressNow > 0
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-zinc-400 dark:text-zinc-500"
              }`} />
              <span className={`text-[11px] font-medium uppercase tracking-wider ${
                shop.inProgressNow > 0
                  ? "text-emerald-600/80 dark:text-emerald-400/80"
                  : "text-zinc-500 dark:text-zinc-500"
              }`}>Agora</span>
            </div>
            <p className={`m-0 text-lg font-bold leading-tight ${
              shop.inProgressNow > 0
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-zinc-400 dark:text-zinc-500"
            }`}>
              {shop.inProgressNow}
            </p>
            <p className="m-0 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              {shop.inProgressNow === 1 ? "em andamento" : "em andamento"}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <Button
            icon={<SettingOutlined />}
            onClick={() => router.push(`/organization/${shop.organizationId}/shop/${shop.id}/settings`)}
            className="flex-1 min-w-0 min-h-[40px]"
          >
            <span className="truncate">Configurar</span>
          </Button>
          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={() => router.push(`/organization/${shop.organizationId}/shop/${shop.id}`)}
            className="flex-1 min-w-0 min-h-[40px]"
          >
            <span className="truncate">Gerenciar</span>
          </Button>
          {canDelete && onDelete && (
            <Popconfirm
              title="Excluir estabelecimento"
              description="Tem certeza? Isso apagará todos os agendamentos e dados desta loja permanentemente."
              onConfirm={() => onDelete(shop.id)}
              okText="Excluir"
              cancelText="Cancelar"
              okButtonProps={{ danger: true }}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                title="Excluir"
                className="flex-shrink-0 min-h-[40px]"
              />
            </Popconfirm>
          )}
        </div>
      </div>
    </div>
  );
}
