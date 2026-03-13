import { Shop } from './shop';
import { Vehicle } from './vehicle';
import { User } from './user';
import { Checklist } from './checklist';
import { VehicleSize } from './enums';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';

export interface AppointmentShopClient {
    id: string;
    customName?: string;
    customPhone?: string;
    customEmail?: string;
    notes?: string;
}

export interface Appointment {
    id: string;
    scheduledAt: string;
    endTime: string;
    status: AppointmentStatus;
    totalPrice: string;
    totalDuration: number;
    notes?: string;
    cancellationReason?: string;

    userId: string;
    shopId: string;
    vehicleId: string;

    shop?: Shop;
    vehicle?: Vehicle;
    user?: User;
    checklist?: Checklist;
    evaluation?: {
        id: string;
        rating: number;
        comment?: string;
    };

    /** Shop-specific client data with override fields */
    shopClient?: AppointmentShopClient;

    services: AppointmentService[];

    createdAt: string;
    updatedAt: string;
}

export interface AppointmentService {
    id: string;
    appointmentId: string;
    serviceId: string;
    
    serviceName: string;
    servicePrice: string;
    duration: number;
    isBudget?: boolean;
    vehicleSize?: VehicleSize | null;

    createdAt: string;
}
