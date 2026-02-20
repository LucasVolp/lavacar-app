export interface FipeBrand {
  id: number;
  brand: string;
}

export interface FipeModel {
  id: number;
  model: string;
  fipe_code: string;
  years: string;
}

export type VehicleType = 1 | 2 | 3; // 1: Carros, 2: Motos, 3: Caminhões

export type BrasilApiFipeType = "carros" | "motos" | "caminhoes";

export interface BrasilApiFipeOption {
  code: string;
  name: string;
}
