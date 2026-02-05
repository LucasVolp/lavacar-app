"use client";

import React from "react";
import { Button, Alert } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { Vehicle } from "@/types/vehicle";
import { VehicleSelector } from "@/components/booking/VehicleSelector";
import { GuestVehicleForm, GuestVehicleData } from "./GuestVehicleForm";

interface VehicleStepProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
  onAddVehicle: () => void;
  onLogin: () => void;
  guestVehicle: GuestVehicleData | null;
  onGuestVehicleSelect: (data: GuestVehicleData) => void;
}

export function VehicleStep({
  isAuthenticated,
  isLoading,
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  onAddVehicle,
  onLogin,
  guestVehicle,
  onGuestVehicleSelect,
}: VehicleStepProps) {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Selecione o Veículo
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Qual veículo receberá o tratamento hoje?
        </p>
      </div>

      {!isAuthenticated ? (
        <div className="space-y-8">
           <Alert
             message={
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                 <div>
                   <span className="font-bold text-blue-800 dark:text-blue-300">Tem uma conta?</span>
                   <span className="block text-blue-600 dark:text-blue-400 text-sm mt-1">
                     Faça login para selecionar seus veículos salvos.
                   </span>
                 </div>
                 <Button 
                   type="primary" 
                   icon={<LoginOutlined />}
                   onClick={onLogin}
                   ghost
                   className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                 >
                   Fazer Login
                 </Button>
               </div>
             }
             type="info"
             className="border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-900/30 rounded-xl"
           />
           
           <GuestVehicleForm 
             value={guestVehicle}
             onChange={onGuestVehicleSelect}
           />
        </div>
      ) : (
        <VehicleSelector
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSelect={onSelectVehicle}
          onAddVehicle={onAddVehicle}
          loading={isLoading}
        />
      )}
    </div>
  );
}
