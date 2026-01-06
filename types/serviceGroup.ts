import { Shop } from "./shop";
export interface ServiceGroup {
    id: string;
    name: string;
    description?: string;
    isActive?: boolean;
    shopId: string;
    shop: Shop;

    createdAt: string;
    updatedAt: string;
}

export interface CreateServiceGroupPayload {
    name: string;
    description?: string;
    isActive?: boolean;
    shopId: string;
}

export interface UpdateServiceGroupPayload {
    name?: string;
    description?: string;
    isActive?: boolean;
}