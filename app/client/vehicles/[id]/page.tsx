"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Descriptions, Spin, Result, Tag, message } from "antd";
import { ArrowLeftOutlined, CarOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useVehicle, useDeleteVehicle } from "@/hooks/useVehicles";
import { CustomPopconfirm } from "@/components/ui";
import { formatVehiclePlate } from "@/utils/vehiclePlate";
import { AddVehicleModal } from "@/components/booking/AddVehicleModal";
import {
  VEHICLE_TYPE_LABEL,
  VEHICLE_SIZE_LABEL,
} from "@/components/client/vehicles";

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;

  const { data: vehicle, isLoading, error, refetch } = useVehicle(vehicleId);
  const deleteVehicle = useDeleteVehicle();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const handleDelete = async () => {
    try {
      await deleteVehicle.mutateAsync(vehicleId);
      message.success("Veículo removido com sucesso");
      router.push("/client/vehicles");
    } catch {
      message.error("Erro ao remover veículo");
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Result
          status="404"
          title="Veículo não encontrado"
          subTitle="O veículo que você procura não existe ou foi removido."
          extra={
            <Button type="primary" onClick={() => router.push("/client/vehicles")}>
              Voltar para Veículos
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
        >
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold m-0 dark:text-zinc-100">{vehicle.brand} {vehicle.model}</h1>
          <p className="text-zinc-500 m-0 dark:text-zinc-400">Gerencie as informações deste veículo</p>
        </div>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm rounded-2xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-auto flex justify-center">
            <div className="w-48 h-48 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-700">
               <CarOutlined className="text-6xl text-zinc-300 dark:text-zinc-600" />
            </div>
          </div>

          <div className="flex-1 w-full">
            <Descriptions
                column={1}
                bordered
                className="bg-white dark:bg-transparent"
                labelStyle={{ width: '140px', fontWeight: 500 }}
            >
              <Descriptions.Item label="Placa">
                <Tag className="font-mono text-base px-2 py-1 m-0 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                    {formatVehiclePlate(vehicle.plate)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Marca">{vehicle.brand}</Descriptions.Item>
              <Descriptions.Item label="Modelo">{vehicle.model}</Descriptions.Item>
              <Descriptions.Item label="Cor">{vehicle.color || "-"}</Descriptions.Item>
              <Descriptions.Item label="Ano">{vehicle.year || "-"}</Descriptions.Item>
              <Descriptions.Item label="Tipo">
                {VEHICLE_TYPE_LABEL[vehicle.type] || vehicle.type}
              </Descriptions.Item>
              <Descriptions.Item label="Porte">
                {vehicle.size ? (VEHICLE_SIZE_LABEL[vehicle.size] || vehicle.size) : "-"}
              </Descriptions.Item>
            </Descriptions>

            <div className="flex gap-3 mt-6 justify-end">
               <Button size="large" icon={<EditOutlined />} onClick={() => setIsEditModalOpen(true)}>
                 Editar
               </Button>
               <CustomPopconfirm
                  title="Remover veículo"
                  description="Tem certeza que deseja remover este veículo? Agendamentos futuros podem ser afetados."
                  onConfirm={handleDelete}
                  okText="Sim, remover"
                  cancelText="Cancelar"
                  okButtonProps={{ danger: true }}
                >
                  <Button danger size="large" icon={<DeleteOutlined />}>
                    Remover
                  </Button>
               </CustomPopconfirm>
            </div>
          </div>
        </div>
      </Card>

      <AddVehicleModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        vehicle={vehicle}
        onSuccess={() => {
          refetch();
          setIsEditModalOpen(false);
        }}
      />
    </div>
  );
}
