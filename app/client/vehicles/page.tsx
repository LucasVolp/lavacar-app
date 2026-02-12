"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spin, Empty, Button, Card, Tag, Tooltip, message } from "antd";
import { CarOutlined, PlusOutlined, DeleteOutlined, RightOutlined } from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useUserVehicles, useDeleteVehicle } from "@/hooks/useVehicles";
import { AddVehicleModal } from "@/components/booking/AddVehicleModal";
import { CustomPopconfirm } from "@/components/ui";

export default function VehiclesPage() {
  const { user } = useAuth();
  const { data: vehicles = [], isLoading } = useUserVehicles(user?.id || null, !!user?.id);
  const deleteVehicle = useDeleteVehicle();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteVehicle.mutateAsync(id);
      message.success("Veículo removido com sucesso");
    } catch {
      message.error("Erro ao remover veículo");
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Spin size="large" />
        <span className="mt-4 text-zinc-500 dark:text-zinc-400">Carregando veículos...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl flex items-center justify-center">
            <CarOutlined className="text-cyan-500 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold m-0 text-zinc-800 dark:text-zinc-100">Meus Veículos</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm m-0">
              Gerencie seus veículos cadastrados
            </p>
          </div>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalOpen(true)}
          size="large"
          className="rounded-xl font-semibold"
        >
          Novo Veículo
        </Button>
      </div>

      {/* Content */}
      {vehicles.length === 0 ? (
        <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900">
          <Empty 
            description={
              <span className="text-zinc-500 dark:text-zinc-400">
                Você ainda não tem veículos cadastrados
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="my-8"
          >
            <Button type="primary" onClick={() => setIsModalOpen(true)} icon={<PlusOutlined />}>
              Cadastrar Primeiro Veículo
            </Button>
          </Empty>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map(vehicle => (
            <Card
              key={vehicle.id}
              className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900 hover:shadow-md hover:border-cyan-200 dark:hover:border-cyan-800 transition-all group"
            >
              <div className="flex justify-between items-start">
                <Link
                  href={`/client/vehicles/${vehicle.id}`}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-500/20 transition-colors">
                    <CarOutlined className="text-cyan-500 text-xl" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold m-0 text-zinc-800 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                      {vehicle.brand ?? "Veículo"} {vehicle.model ?? ""}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Tag className="font-mono uppercase !text-[10px] !m-0 !px-1.5 !py-0 border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {vehicle.plate}
                      </Tag>
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
                  <CustomPopconfirm
                    title="Remover veículo"
                    description="Tem certeza que deseja remover este veículo?"
                    onConfirm={() => handleDelete(vehicle.id)}
                    okText="Sim"
                    cancelText="Não"
                  >
                    <Tooltip title="Remover veículo">
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        loading={deleteVehicle.isPending}
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
          ))}
        </div>
      )}

      <AddVehicleModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          // query is invalidated automatically by hook
        }}
      />
    </div>
  );
}
