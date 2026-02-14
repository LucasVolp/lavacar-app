"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, Badge, Button, Tooltip } from "antd";
import {
  ArrowRightOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import type { OrganizationShopOverview } from "@/types/organization";

interface OrganizationShopCardProps {
  shop: OrganizationShopOverview;
}

export function OrganizationShopCard({ shop }: OrganizationShopCardProps) {
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

        <div className="grid grid-cols-2 gap-2 text-xs">
          <Tooltip title="Agendamentos no dia atual">
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 p-2.5">
              <p className="m-0 text-zinc-500 dark:text-zinc-400">Hoje</p>
              <p className="m-0 font-semibold text-zinc-900 dark:text-zinc-100">{shop.appointmentsToday} ag.</p>
            </div>
          </Tooltip>

          <Tooltip title="Serviços em andamento agora">
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 p-2.5">
              <p className="m-0 text-zinc-500 dark:text-zinc-400">Agora</p>
              <p className="m-0 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                <ClockCircleOutlined /> {shop.inProgressNow} em andamento
              </p>
            </div>
          </Tooltip>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <Button
            icon={<SettingOutlined />}
            onClick={() => router.push(`/admin/shop/${shop.id}/settings`)}
          >
            Configurar
          </Button>
          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={() => router.push(`/admin/shop/${shop.id}`)}
          >
            Gerenciar
          </Button>
        </div>
      </div>
    </div>
  );
}
