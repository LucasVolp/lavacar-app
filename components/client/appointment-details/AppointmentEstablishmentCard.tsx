import React from "react";
import Link from "next/link";
import { Button, Card } from "antd";
import { EnvironmentOutlined, ShopOutlined } from "@ant-design/icons";
import type { Shop } from "@/types/shop";
import { formatAddress } from "./formatters";

interface AppointmentEstablishmentCardProps {
  shop?: Shop;
}

export function AppointmentEstablishmentCard({ shop }: AppointmentEstablishmentCardProps) {
  const address = formatAddress(shop);
  const shopHref = shop?.slug ? `/shop/${shop.slug}` : null;
  const bookingHref = shop?.slug ? `/shop/${shop.slug}/booking` : null;

  return (
    <Card
      title={
        <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
          <ShopOutlined className="text-cyan-500" />
          <span>Estabelecimento</span>
        </div>
      }
      className="border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm rounded-2xl"
    >
      {shop ? (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <EnvironmentOutlined className="text-xl text-zinc-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold m-0 text-zinc-800 dark:text-zinc-100">{shop.name}</h4>
              <div className="text-zinc-500 dark:text-zinc-400 mt-2 space-y-1">
                {address.line1 && <p className="m-0">{address.line1}</p>}
                {address.line2 && <p className="m-0">{address.line2}</p>}
                {address.line3 && <p className="m-0">{address.line3}</p>}
                {shop.phone && <p className="m-0">Telefone: {shop.phone}</p>}
                {shop.email && <p className="m-0">E-mail: {shop.email}</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <Button type="default" disabled={!shopHref}>
              {shopHref ? <Link href={shopHref}>Ver Site</Link> : "Site indisponível"}
            </Button>
            <Button type="primary" disabled={!bookingHref}>
              {bookingHref ? <Link href={bookingHref}>Reagendar</Link> : "Reagendar"}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-zinc-500 italic">Informações do estabelecimento não disponíveis</p>
      )}
    </Card>
  );
}
