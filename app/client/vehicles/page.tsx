"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spin, Empty, Button, Card, message } from "antd";
import { CarOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useUserVehicles, useDeleteVehicle } from "@/hooks/useVehicles";
import { AddVehicleModal } from "@/components/booking/AddVehicleModal"; // Reusing this component
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
    return <div className="p-12 text-center"><Spin size="large" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <CarOutlined className="text-blue-500 text-xl" />
            </div>
            <div>
            <h1 className="text-2xl font-bold">Meus Veículos</h1>
            <p className="text-slate-500">Gerencie seus veículos cadastrados</p>
            </div>
        </div>
        <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsModalOpen(true)}
            size="large"
            className="bg-slate-900 hover:bg-slate-800"
        >
            Novo Veículo
        </Button>
      </div>

      {vehicles.length === 0 ? (
         <Empty 
            description="Você ainda não tem veículos cadastrados" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
         >
            <Button type="primary" onClick={() => setIsModalOpen(true)}>Cadastrar Primeiro Veículo</Button>
         </Empty>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map(vehicle => (
                <Card key={vehicle.id} className="border-slate-200 dark:border-[#27272a] hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <Link href={`/client/vehicles/${vehicle.id}`} className="group hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <h3 className="text-lg font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {vehicle.brand} {vehicle.model}
                                </h3>
                            </Link>
                            <div className="inline-block bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm font-mono mt-1">
                                {vehicle.plate}
                            </div>
                            <p className="text-slate-500 text-sm mt-2">{vehicle.color} • {vehicle.year}</p>
                        </div>
                        <div className="flex gap-2">
                             <Link href={`/client/vehicles/${vehicle.id}`}>
                                <Button icon={<CarOutlined />} type="text" />
                             </Link>
                             <CustomPopconfirm
                                title="Remover veículo"
                                description="Tem certeza que deseja remover este veículo?"
                                onConfirm={() => handleDelete(vehicle.id)}
                                okText="Sim"
                                cancelText="Não"
                            >
                                <Button type="text" danger icon={<DeleteOutlined />} />
                            </CustomPopconfirm>
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
