"use client";

import React from "react";
import { Tag } from "antd";
import { CarOutlined, RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { formatVehiclePlate } from "@/utils/vehiclePlate";

export interface VehicleCardData {
  id: string;
  plate?: string;
  brand: string;
  model: string;
  color: string;
  year: number;
}

interface VehicleCardProps {
  vehicle: VehicleCardData;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <Link href={`/client/vehicles/${vehicle.id}`}>
      <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer group">
        <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center shrink-0">
          <CarOutlined className="text-emerald-600 dark:text-emerald-400 text-sm" />
        </div>

        <div className="flex-grow min-w-0">
          <span className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
            {vehicle.brand ?? "Marca"} {vehicle.model ?? ""}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Tag className="font-mono uppercase !text-[9px] !m-0 !px-1.5 !py-0 !leading-relaxed rounded border bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-700 dark:text-zinc-400 dark:border-zinc-600">
              {formatVehiclePlate(vehicle.plate) || "---"}
            </Tag>
            {vehicle.color && vehicle.color !== "-" && (
              <span className="text-[10px] text-zinc-400 capitalize line-clamp-1">
                {vehicle.color}
              </span>
            )}
          </div>
        </div>

        <RightOutlined className="text-zinc-300 dark:text-zinc-600 text-[10px] group-hover:text-indigo-400 transition-colors" />
      </div>
    </Link>
  );
};

export default VehicleCard;
