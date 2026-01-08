"use client";

import { CarOutlined, UserOutlined } from "@ant-design/icons";
import { VehicleSelector } from "@/components/booking";
import { Vehicle } from "@/types/vehicle";
import { GuestVehicleForm, GuestVehicleData } from "./GuestVehicleForm";

interface VehicleStepProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
  onAddVehicle: () => void;
  onLogin: () => void;
  // Guest props
  guestVehicle?: GuestVehicleData | null;
  onGuestVehicleSelect?: (data: GuestVehicleData) => void;
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
    <div className="p-6 sm:p-10">
      {/* Step Header */}
      <div className="flex items-center gap-5 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl shadow-lg shadow-indigo-500/20">
          <CarOutlined />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1 transition-colors duration-300">
            Selecione seu Veículo
          </h2>
          <p className="text-slate-500 dark:text-slate-400 transition-colors duration-300">
            Escolha o veículo que receberá o serviço.
          </p>
        </div>
      </div>

      {!isAuthenticated ? (
         <div className="max-w-2xl mx-auto">
            <div className="bg-slate-50 dark:bg-[#09090b] p-6 rounded-3xl border border-slate-200 dark:border-[#27272a] mb-8">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                    <UserOutlined className="text-lg text-indigo-500" />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                       Modo Visitante
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                       Informe os dados do veículo para continuar
                    </p>
                 </div>
               </div>
               
               {onGuestVehicleSelect && (
                 <GuestVehicleForm 
                    initialData={guestVehicle}
                    onSelect={onGuestVehicleSelect}
                 />
               )}
            </div>

            <div className="text-center">
              <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">
                Já possui cadastro e veículos salvos?
              </p>
              <button
                onClick={onLogin}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:bg-[#18181b] dark:border-[#27272a] dark:text-slate-300 dark:hover:bg-[#27272a] dark:hover:text-white font-semibold rounded-xl transition-all"
              >
                Fazer Login
              </button>
            </div>
         </div>
      ) : isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <VehicleSelector
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSelect={onSelectVehicle}
          onAddVehicle={onAddVehicle}
        />
      )}
    </div>
  );
}
