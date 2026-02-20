export type VehicleSizeValue = "SMALL" | "MEDIUM" | "LARGE";

export const VEHICLE_SIZE_OPTIONS: Array<{ label: string; value: VehicleSizeValue }> = [
  { label: 'Pequeno', value: 'SMALL' },
  { label: 'Médio', value: 'MEDIUM' },
  { label: 'Grande', value: 'LARGE' },
];

export const VEHICLE_SIZE_LABEL: Record<VehicleSizeValue, string> = {
  SMALL: 'Pequeno',
  MEDIUM: 'Médio',
  LARGE: 'Grande',
};

export function formatCurrency(value: number | string): string {
  const parsed = typeof value === 'string' ? Number(value) : value;
  return `R$ ${Number.isFinite(parsed) ? parsed.toFixed(2).replace('.', ',') : '0,00'}`;
}
