import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { brasilApiService } from "@/services/brasilApi";
import { BrasilApiFipeType } from "@/types/fipe";
import { Vehicle } from "@/types/vehicle";

export const fipeKeys = {
  all: ["fipe"] as const,
  brands: (type: BrasilApiFipeType) => [...fipeKeys.all, "brands", type] as const,
  models: (type: BrasilApiFipeType, brandCode: string) => [...fipeKeys.all, "models", type, brandCode] as const,
};

export function mapVehicleCategoryToFipeType(type: Vehicle["type"]): BrasilApiFipeType {
  if (type === "MOTORCYCLE") return "motos";
  if (type === "TRUCK") return "caminhoes";
  return "carros";
}

export function useFipeBrandsByVehicleCategory(type: Vehicle["type"] | undefined) {
  const fipeType = useMemo(() => (type ? mapVehicleCategoryToFipeType(type) : null), [type]);

  return useQuery({
    queryKey: fipeType ? fipeKeys.brands(fipeType) : [...fipeKeys.all, "brands", "idle"],
    queryFn: () => brasilApiService.listFipeBrands(fipeType!),
    enabled: Boolean(fipeType),
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useFipeModelsByVehicleCategory(
  type: Vehicle["type"] | undefined,
  brandCode: string | null,
  enabled = true,
) {
  const fipeType = useMemo(() => (type ? mapVehicleCategoryToFipeType(type) : null), [type]);

  return useQuery({
    queryKey: fipeType && brandCode ? fipeKeys.models(fipeType, brandCode) : [...fipeKeys.all, "models", "idle"],
    queryFn: () => brasilApiService.listFipeModels(fipeType!, brandCode!),
    enabled: Boolean(fipeType && brandCode && enabled),
    staleTime: 6 * 60 * 60 * 1000,
  });
}
