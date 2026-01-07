export interface Services {
    id: string;
    name: string;
    description?: string;
    price: string;
    duration: number;
    isActive?: boolean;

    shopId: string;
    groupId?: string;
    
    createdAt: string;
    updatedAt: string;
}

export interface CreateServicePayload {
    name: string;
    description?: string;
    price: number;
    duration: number;
    isActive?: boolean;

    shopId: string;
    groupId?: string;
}

export interface UpdateServicePayload {
    name?: string;
    description?: string;
    price?: number;
    duration?: number;
    isActive?: boolean;

    groupId?: string;
}