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

export interface CreateChecklistDTO {
  appointmentId: string;
  description?: string;
  photos?: File[];
}

// Backward compatibility with previous naming.
export type CreateChecklistPayload = CreateChecklistDTO;

export interface UpdateChecklistPayload {
  description?: string;
  photos?: string[];
}
