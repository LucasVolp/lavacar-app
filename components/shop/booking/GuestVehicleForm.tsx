"use client";

import { useEffect, useState } from "react";
import { Select } from "antd";
import { fipeService } from "@/services/fipe";
import { VehicleType } from "@/types/fipe";

export interface GuestVehicleData {
  type: VehicleType;
  brand: string;
  model: string;
}

interface GuestVehicleFormProps {
  onSelect: (data: GuestVehicleData) => void;
  initialData?: GuestVehicleData | null;
}

const vehicleTypes: { label: string; value: VehicleType }[] = [
  { label: "Carro", value: 1 },
  { label: "Moto", value: 2 },
  { label: "Caminhão", value: 3 },
];

export function GuestVehicleForm({ onSelect, initialData }: GuestVehicleFormProps) {
  const [brands, setBrands] = useState<{ label: string; value: string }[]>([]);
  const [models, setModels] = useState<{ label: string; value: string }[]>([]);

  const [selectedType, setSelectedType] = useState<VehicleType | null>(initialData?.type || null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(initialData?.brand || null);
  
  const [selectedBrandCode, setSelectedBrandCode] = useState<string | null>(null);

  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  // Fetch Brands
  useEffect(() => {
    if (selectedType) {
      setLoadingBrands(true);
      setBrands([]);
      // Reset downstream
      if (selectedBrandCode) {
        setSelectedBrandCode(null);
        setSelectedBrand(null);
        setModels([]);
      }

      fipeService.getBrands(selectedType)
        .then((data) => {
          const formatted = data.map((item) => ({
            label: item.brand,
            value: String(item.id),
          }));
          setBrands(formatted);
        })
        .finally(() => setLoadingBrands(false));
    }
  }, [selectedType]);

  // Fetch Models
  useEffect(() => {
    if (selectedType && selectedBrandCode) {
      setLoadingModels(true);
      setModels([]);
      
      fipeService.getModels(Number(selectedBrandCode))
        .then((data) => {
          const formatted = data.map((item) => ({
            label: item.model,
            value: item.model,
          }));
          setModels(formatted);
        })
        .finally(() => setLoadingModels(false));
    }
  }, [selectedType, selectedBrandCode]);

  // Propagate changes
  const handleModelChange = (val: string) => {
    if (selectedType && selectedBrandCode && val) {
        // Find brand name
        const brandLabel = brands.find(b => b.value === selectedBrandCode)?.label || "";
        
        onSelect({
            type: selectedType,
            brand: brandLabel, // Pass the Name
            model: val
        });
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Tipo de Veículo
        </label>
        <Select
          className="w-full h-11"
          placeholder="Selecione o tipo"
          options={vehicleTypes}
          value={selectedType}
          onChange={(val) => setSelectedType(val)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Marca
        </label>
        <Select
          className="w-full h-11"
          placeholder="Selecione a marca"
          showSearch
          optionFilterProp="label"
          options={brands}
          value={selectedBrandCode} // Bind to Code
          disabled={!selectedType}
          loading={loadingBrands}
          onChange={(val) => {
              setSelectedBrandCode(val);
              const label = brands.find(b => b.value === val)?.label;
              if(label) setSelectedBrand(label);
          }}
          notFoundContent={loadingBrands ? "Carregando..." : "Nenhuma marca encontrada"}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Modelo
        </label>
        <Select
          className="w-full h-11"
          placeholder="Selecione o modelo"
          showSearch
          optionFilterProp="label"
          options={models}
          // value={initialData?.model} // This might need local state if we want controlled component fully
          onChange={handleModelChange}
          disabled={!selectedBrandCode}
          loading={loadingModels}
          notFoundContent={loadingModels ? "Carregando..." : "Nenhum modelo encontrado"}
        />
      </div>
    </div>
  );
}
