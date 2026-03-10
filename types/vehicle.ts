import { VehicleSize, VehicleType } from './enums';
import { Appointment } from './appointment';
export interface Vehicle {
    id: string;
    plate?: string;
    brand: string;
    model: string;
    year?: number;
    color?: string;
    size: VehicleSize;
    type: VehicleType;

    userId: string;
    appointments: Appointment[];

    createdAt: string;
    updatedAt: string;
}

export interface CreateVehiclePayload {
    plate?: string;
    brand: string;
    model: string;
    year?: number;
    color?: string;
    size?: VehicleSize;
    type: VehicleType;
    userId: string;
}
export interface UpdateVehiclePayload {
    plate?: string;
    brand?: string;
    model?: string;
    year?: number;
    color?: string;
    size?: VehicleSize;
    type?: VehicleType;
}
