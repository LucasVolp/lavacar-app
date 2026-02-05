import { Appointment } from "./appointment";

export interface Checklist {
    id: string;
    appointmentId: string;
    description?: string;
    photos: string[];
    
    appointment?: Appointment;

    createdAt: string;
    updatedAt: string;
}

export interface CreateChecklistPayload {
    appointmentId: string;
    description?: string;
    photos?: string[];
}

export interface UpdateChecklistPayload {
    description?: string;
    photos?: string[];
}
