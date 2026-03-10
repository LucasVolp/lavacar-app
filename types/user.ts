import { Role } from "./enums";
import { Appointment } from "./appointment";
import { Evaluation } from "./evaluation";
import { Organization, OrganizationMember } from "./organization";
import { Shop } from "./shop";
import { Vehicle } from "./vehicle";

export { Role };

export interface User {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    cpf?: string;
    password: string;
    phone?: string;
    picture?: string;
    role: Role;
    isActive: boolean;
    isGuest?: boolean;
    
    vehicles: Vehicle[];
    appointments: Appointment[];
    evaluations: Evaluation[];
    shops: Shop[];
    organizationMembers: OrganizationMember[];
    organizations: Organization[];

    createdAt: string;
    updatedAt: string;
}

export interface ShadowVehicle {
    id: string;
    plate?: string;
    model: string;
    brand: string;
    color?: string;
    year?: string;
    size: string;
    type: string;
    isActive: boolean;
}

export interface ShadowUser {
    id: string;
    firstName: string;
    lastName?: string;
    phone: string;
    role: Role;
    isGuest: boolean;
    isActive: boolean;
    vehicles: ShadowVehicle[];
}

export interface PublicUser {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    picture?: string;
    role: Role;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserPayload {
    firstName: string;
    lastName?: string;
    email?: string;
    cpf?: string;
    password?: string;
    phone?: string;
    picture?: string;
    role?: Role;
    isActive?: boolean;
    isGuest?: boolean;
}

export interface UpdateUserPayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    cpf?: string;
    password?: string;
    phone?: string;
    picture?: string;
    role?: Role;
    isActive?: boolean;
    isGuest?: boolean;
}

