"use client";

import React from "react";
import Link from "next/link";
import { Button, Card, Tag, Tooltip } from "antd";
import { CarOutlined, DeleteOutlined, EditOutlined, RightOutlined } from "@ant-design/icons";
import { Vehicle } from "@/types/vehicle";
import { CustomPopconfirm } from "@/components/ui";
import { formatVehiclePlate } from "@/utils/vehiclePlate";
import {
  VEHICLE_TYPE_LABEL,
  VEHICLE_SIZE_LABEL,
  VEHICLE_TYPE_ICON_COLOR,
  VEHICLE_TYPE_BG,
} from "./vehicleUi";

interface VehicleListCardProps {
  vehicle: Vehicle;
  onDelete: (id: string) => void;
  onEdit?: (vehicle: Vehicle) => void;
  isDeleting?: boolean;
}

export const VehicleListCard: React.FC<VehicleListCardProps> = ({
  vehicle,
  onDelete,
  onEdit,
  isDeleting,
}) => {
  const typeColor = VEHICLE_TYPE_ICON_COLOR[vehicle.type] || VEHICLE_TYPE_ICON_COLOR.OTHER;
  const typeBg = VEHICLE_TYPE_BG[vehicle.type] || VEHICLE_TYPE_BG.OTHER;

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900 hover:shadow-md hover:border-cyan-200 dark:hover:border-cyan-800 transition-all group">
      <div className="flex justify-between items-start">
        <Link
          href={`/client/vehicles/${vehicle.id}`}
          className="flex items-center gap-3 flex-1 min-w-0"
        >
          <div className={`w-12 h-12 ${typeBg} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
            <CarOutlined className={`${typeColor} text-xl`} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold m-0 text-zinc-800 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
              {vehicle.brand ?? "Veículo"} {vehicle.model ?? ""}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Tag className="font-mono uppercase !text-[10px] !m-0 !px-1.5 !py-0 border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {formatVehiclePlate(vehicle.plate)}
              </Tag>
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                {VEHICLE_TYPE_LABEL[vehicle.type] || vehicle.type}
              </span>
              {vehicle.size && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {VEHICLE_SIZE_LABEL[vehicle.size] || vehicle.size}
                  </span>
                </>
              )}
              {vehicle.color && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 capitalize">
                    {vehicle.color}
                  </span>
                </>
              )}
              {vehicle.year && vehicle.year > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {vehicle.year}
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {onEdit && (
            <Tooltip title="Editar veículo">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onEdit(vehicle);
                }}
              />
            </Tooltip>
          )}
          <CustomPopconfirm
            title="Remover veículo"
            description="Tem certeza que deseja remover este veículo?"
            onConfirm={() => onDelete(vehicle.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Tooltip title="Remover veículo">
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                loading={isDeleting}
              />
            </Tooltip>
          </CustomPopconfirm>
          <Link href={`/client/vehicles/${vehicle.id}`}>
            <Button
              type="text"
              size="small"
              icon={<RightOutlined className="text-zinc-400 dark:text-zinc-500" />}
            />
          </Link>
        </div>
      </div>
    </Card>
  );
};
