export interface Appointment {
    id: string;
    scheduledAt: string;
    endTime: string;
    status: 'PENDING' | 'CONFIRMED' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';
    totalPrice: string;
    totalDuration: number;
    notes?: string;
    cancellationReason?: string;

    userId: string;
    shopId: string;
    vehicleId: string;

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

    createdAt: string;
}