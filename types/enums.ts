/**
 * Local enum definitions mirroring the Prisma schema from lavacar-api.
 * These must be kept in sync with the backend enums.
 */

export const Role = {
  USER: 'USER',
  OWNER: 'OWNER',
  EMPLOYEE: 'EMPLOYEE',
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const VehicleSize = {
  SMALL: 'SMALL',
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE',
} as const;

export type VehicleSize = (typeof VehicleSize)[keyof typeof VehicleSize];

export const VehicleType = {
  CAR: 'CAR',
  MOTORCYCLE: 'MOTORCYCLE',
  TRUCK: 'TRUCK',
  SUV: 'SUV',
  VAN: 'VAN',
  OTHER: 'OTHER',
} as const;

export type VehicleType = (typeof VehicleType)[keyof typeof VehicleType];
