"use client";

import { useMemo } from "react";
import { EnvironmentOutlined, PhoneOutlined } from "@ant-design/icons";
import { Card } from "antd";

interface ShopInfo {
  name: string;
  phone: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface TrackingShopInfoProps {
  shop: ShopInfo;
}

export function TrackingShopInfo({ shop }: TrackingShopInfoProps) {
  const fullAddress = useMemo(
    () => `${shop.street}, ${shop.number} - ${shop.neighborhood}, ${shop.city}/${shop.state}`,
    [shop.street, shop.number, shop.neighborhood, shop.city, shop.state]
  );

  return (
    <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-[#18181b]">
      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-4">
        Local do Serviço
      </p>
      <div className="space-y-3">
        <div className="flex items-center gap-3 min-h-[44px]">
          <div className="w-11 h-11 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <EnvironmentOutlined className="text-lg" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
              {shop.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {fullAddress}
            </p>
          </div>
        </div>
        <a
          href={`tel:${shop.phone}`}
          className="flex items-center gap-3 min-h-[44px] active:opacity-70 transition-opacity"
        >
          <div className="w-11 h-11 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <PhoneOutlined className="text-lg" />
          </div>
          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            {shop.phone}
          </span>
        </a>
      </div>
    </Card>
  );
}
