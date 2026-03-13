export function normalizeVehiclePlate(value: unknown): string {
  if (!value) return "";

  return String(value).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
}

export function formatVehiclePlate(value: unknown): string {
  const plate = normalizeVehiclePlate(value);

  if (!plate) return "";

  if (/^[A-Z]{3}\d{4}$/.test(plate)) {
    return `${plate.slice(0, 3)}-${plate.slice(3)}`;
  }

  if (/^[A-Z]{3}\d[A-Z]\d{2}$/.test(plate)) {
    return plate;
  }

  if (plate.length > 3) {
    return `${plate.slice(0, 3)}-${plate.slice(3)}`;
  }

  return plate;
}
