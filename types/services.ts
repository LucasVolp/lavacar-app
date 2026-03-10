import { VehicleSize } from './enums';

export interface ServiceVariant {
    id: string;
    size: VehicleSize;
    price: string;
    duration: number;
    serviceId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Services {
    id: string;
    name: string;
    description?: string;
    photoUrl?: string;
    price: string;
    duration: number;
    isActive?: boolean;
    isBudgetOnly?: boolean;
    hasVariants?: boolean;

    shopId: string;
    groupId?: string;
    variants?: ServiceVariant[];
    
    createdAt: string;
    updatedAt: string;
}

export interface CreateServicePayload {
    name: string;
    description?: string;
    photoUrl?: string;
    price: number;
    duration: number;
    isActive?: boolean;
    isBudgetOnly?: boolean;
    hasVariants?: boolean;

    shopId: string;
    groupId?: string;
}

export interface UpdateServicePayload {
    name?: string;
    description?: string;
    photoUrl?: string;
    price?: number;
    duration?: number;
    isActive?: boolean;
    isBudgetOnly?: boolean;
    hasVariants?: boolean;

    groupId?: string;
}
