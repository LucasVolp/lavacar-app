"use client";

import { Empty } from "antd";
import { CarOutlined, PlusOutlined, CheckCircleFilled } from "@ant-design/icons";
import { Vehicle } from "@/types/vehicle";

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelect: (vehicleId: string) => void;
  onAddVehicle?: () => void;
  loading?: boolean;
}

export function VehicleSelector({
  vehicles,
  selectedVehicleId,
  onSelect,
  onAddVehicle,
  loading = false,
}: VehicleSelectorProps) {
  const getVehicleTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      CAR: "Carro",
      MOTORCYCLE: "Moto",
      TRUCK: "Caminhão",
      SUV: "SUV",
      VAN: "Van",
      OTHER: "Outro",
    };
    return types[type] || type;
  };

  if (vehicles.length === 0 && !loading) {
    return (
      <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-2xl p-12 text-center transition-colors duration-300">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span className="text-slate-500 dark:text-slate-400">Você ainda não tem veículos cadastrados</span>}
          className="[&_.ant-empty-img-simple-path]:fill-slate-300 dark:[&_.ant-empty-img-simple-path]:fill-slate-700 [&_.ant-empty-img-simple-g]:stroke-slate-400 dark:[&_.ant-empty-img-simple-g]:stroke-slate-700 [&_.ant-empty-img-simple-ellipse]:fill-slate-100 dark:[&_.ant-empty-img-simple-ellipse]:fill-slate-800"
        />
        {onAddVehicle && (
          <button 
             onClick={onAddVehicle}
             className="mt-4 px-6 py-2.5 bg-slate-900 text-white dark:bg-slate-50 dark:text-black rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-white transition-colors inline-flex items-center gap-2 shadow-lg shadow-slate-900/10 dark:shadow-white/10"
          >
            <PlusOutlined /> Adicionar Veículo
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vehicles.map((vehicle) => {
        const isSelected = selectedVehicleId === vehicle.id;

        return (
          <div
            key={vehicle.id}
            onClick={() => onSelect(vehicle.id)}
            className={`
              relative group p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer flex items-center gap-6
              ${
                isSelected
                  ? "bg-emerald-50 dark:bg-[#18181b] border-emerald-500 dark:border-emerald-500 shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)] scale-[1.01]"
                  : "bg-white dark:bg-[#18181b] border-slate-200 dark:border-[#27272a] hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-[#202023]"
              }
            `}
          >
             {isSelected && (
                <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-200">
                  <CheckCircleFilled className="text-emerald-500 text-xl" />
                </div>
              )}

              <div className={`
                 w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-colors duration-300
                 ${isSelected ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' : 'bg-slate-100 dark:bg-[#27272a] text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-slate-800 group-hover:text-slate-700 dark:group-hover:text-slate-300'}
              `}>
                <CarOutlined />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 leading-tight transition-colors duration-300">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-[#27272a] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#3f3f46] transition-colors duration-300">
                     {getVehicleTypeLabel(vehicle.type)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-mono transition-colors duration-300">
                  <span className="bg-slate-50 dark:bg-[#09090b] px-2 py-0.5 rounded border border-slate-200 dark:border-[#27272a]">
                    {vehicle.plate}
                  </span>
                  {(vehicle.year || vehicle.color) && (
                     <span className="text-slate-500 dark:text-slate-500">
                        {vehicle.color} {vehicle.year ? `• ${vehicle.year}` : ''}
                     </span>
                  )}
                </div>
              </div>
          </div>
        );
      })}

      {onAddVehicle && (
        <button
          onClick={onAddVehicle}
          className="w-full h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#27272a] text-slate-500 dark:text-slate-400 font-medium hover:border-slate-500 dark:hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#18181b] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <PlusOutlined />
          Adicionar Novo Veículo
        </button>
      )}
    </div>
  );
}

export default VehicleSelector;
