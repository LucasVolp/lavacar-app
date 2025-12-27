import { Role } from "../../lavacar-api/prisma/generated/enums";
import { Appointment } from "./appointment";
import { Evaluation } from "./evaluation";
import { Organization, OrganizationMember } from "./organization";
import { Shop } from "./shop";
import { Vehicle } from "./vehicle";

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
    
    vehicles: Vehicle[];
    appointments: Appointment[];
    evaluations: Evaluation[];
    shops: Shop[];
    organizationMembers: OrganizationMember[];
    organizations: Organization[];

    createdAt: string;
    updatedAt: string;
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
    email: string;
    cpf?: string;
    password: string;
    phone?: string;
    picture?: string;
    role?: Role;
    isActive?: boolean;
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
}

